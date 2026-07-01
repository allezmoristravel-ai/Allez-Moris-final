import qs from 'qs';
import { wpApi } from '@/lib/wordpress';
import { activities as localActivities } from '@/data/activities';
import { accommodations as localAccommodations } from '@/data/accommodations';
import {
    Activity, Category, StrapiResponse, ContactDetails, StrapiAccommodation,
    Testimonial, LegalPage, RentalVehicle, TransferVehicleCategory, TransferPriceRoute,
    HomePage, AboutPage, ServicesRentalPage, ServicesTransferPage, GlobalSettings,
} from '@/types/strapi';
import { ENABLED_LOCALES, DEFAULT_LOCALE } from '@/config/i18n.config';
import { cache } from 'react';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

/**
 * Returns the locale if it's enabled, otherwise falls back to the default.
 * This ensures Strapi only receives locales we actively support.
 */
const sanitizeLocale = (locale: string): string =>
    ENABLED_LOCALES.includes(locale as typeof ENABLED_LOCALES[number]) ? locale : DEFAULT_LOCALE;

const getStrapiUrl = () => {
    let url = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://phenomenal-growth-682e298e29.strapiapp.com';
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }
    // Remove trailing slash if present
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    return url;
};

const STRAPI_URL = getStrapiUrl();

const getBaseUrl = () => `${STRAPI_URL}/api`;

const getHeaders = () => {
    const token = process.env.STRAPI_TOKEN;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

const getLocalActivityCategory = (activity: Activity) => {
    if (!activity.category) return undefined;
    if (typeof activity.category === 'string') return activity.category;
    return activity.category.slug || activity.category.name;
};

const getLocalActivitiesByCategory = (category: string): Activity[] => {
    return localActivities.filter((activity) => {
        const activityCategory = getLocalActivityCategory(activity)?.toLowerCase();
        return activityCategory === category.toLowerCase();
    });
};

const getLocalActivityBySlug = (slug: string): Activity | undefined => {
    return localActivities.find((activity) => activity.slug === slug || activity.documentId === slug);
};

const populateMissingImagesWithEn = async (activities: Activity[], locale: string): Promise<Activity[]> => {
    if (locale === 'en' || !activities?.length) return activities;

    const missingImageIds = activities.filter(a => !a.coverImage?.length).map(a => a.documentId).filter(Boolean);
    if (!missingImageIds.length) return activities;

    try {
        const query = qs.stringify({
            locale: 'en',
            filters: {
                documentId: {
                    $in: missingImageIds
                }
            },
            populate: ['coverImage'],
            pagination: { pageSize: missingImageIds.length }
        }, { encodeValuesOnly: true });

        const url = `${getBaseUrl()}/activities?${query}`;
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const enDataFull = (await res.json()) as StrapiResponse<Activity>;
        const enData = enDataFull.data;

        return activities.map(activity => {
            if (!activity.coverImage?.length) {
                const enActivity = enData.find(en => en.documentId === activity.documentId);
                if (enActivity?.coverImage?.length) {
                    // clone activity to safely mutate if needed, or directly assign
                    return { ...activity, coverImage: enActivity.coverImage };
                }
            }
            return activity;
        });
    } catch (e) {
        console.error("[API] Failed to fetch fallback EN images:", e);
        return activities;
    }
};

export const getStrapiMedia = (url: string | undefined) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('//')) return url;
    if (url.startsWith('/uploads/') || url.includes('/uploads/')) {
        return `${STRAPI_URL}${url}`;
    }
    return url;
};

export const getActivities = async (locale = 'en', page = 1, pageSize = 20): Promise<StrapiResponse<Activity>> => {
    if (DEMO_MODE) {
        return {
            data: localActivities,
            meta: { pagination: { page: 1, pageSize: localActivities.length, pageCount: 1, total: localActivities.length } },
        };
    }
    const safeLocale = sanitizeLocale(locale);
    const query = qs.stringify({
        locale: safeLocale,
        pagination: {
            page: page,
            pageSize: pageSize,
        },
        populate: '*',
    }, { encodeValuesOnly: true });

    const url = `${getBaseUrl()}/activities?${query}`;

    try {
        console.log(`Fetching activities from: ${url}`);
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();

        if (data.data.length === 0) {
            if (locale !== 'en') {
                console.log(`[API] fallback to English for activities`);
                return getActivities('en', page, pageSize);
            }
            console.log('[API] Strapi returned empty activity list, using WordPress fallback');
            try {
                const wpActivities = await wpApi.getActivities(locale);
                return {
                    data: wpActivities,
                    meta: { pagination: { page: 1, pageSize: wpActivities.length, pageCount: 1, total: wpActivities.length } },
                };
            } catch (fallbackError) {
                console.error('WordPress fallback failed for activities:', fallbackError);
                return {
                    data: localActivities,
                    meta: { pagination: { page: 1, pageSize: localActivities.length, pageCount: 1, total: localActivities.length } },
                };
            }
        }

        data.data = await populateMissingImagesWithEn(data.data, locale);

        return data;
    } catch (error) {
        console.error('Unexpected Error fetching activities:', error);
        try {
            const wpActivities = await wpApi.getActivities(locale);
            return {
                data: wpActivities,
                meta: { pagination: { page: 1, pageSize: wpActivities.length, pageCount: 1, total: wpActivities.length } },
            };
        } catch (fallbackError) {
            console.error('WordPress fallback failed for activities:', fallbackError);
            return {
                data: localActivities,
                meta: { pagination: { page: 1, pageSize: localActivities.length, pageCount: 1, total: localActivities.length } },
            };
        }
    }
};

export const getActivityBySlug = async (slug: string, locale = 'en'): Promise<Activity | null> => {
    if (DEMO_MODE) {
        return localActivities.find(a => a.slug === slug || a.documentId === slug) || null;
    }
    const safeLocale = sanitizeLocale(locale);
    const query = qs.stringify({
        locale: safeLocale,
        filters: {
            slug: { $eq: slug },
        },
        populate: '*',
    }, { encodeValuesOnly: true });

    const url = `${getBaseUrl()}/activities?${query}`;

    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        const data = json.data[0];

        if (!data) {
            if (locale !== 'en') {
                console.log(`[API] fallback to English for slug: ${slug}`);
                return getActivityBySlug(slug, 'en');
            }
            console.log(`[API] Strapi returned no activity for slug ${slug}, using WordPress fallback`);
            try {
                const wpActivity = await wpApi.getActivityBySlug(slug, locale);
                return wpActivity || getLocalActivityBySlug(slug) || null;
            } catch (fallbackError) {
                console.error(`WordPress fallback failed for slug ${slug}:`, fallbackError);
                return getLocalActivityBySlug(slug) || null;
            }
        }

        const populated = await populateMissingImagesWithEn([data], locale);
        return populated[0];
    } catch (error) {
        console.error(`Error fetching activity by slug ${slug}:`, error);
        try {
            const wpActivity = await wpApi.getActivityBySlug(slug, locale);
            return wpActivity || getLocalActivityBySlug(slug) || null;
        } catch (fallbackError) {
            console.error(`WordPress fallback failed for slug ${slug}:`, fallbackError);
            return getLocalActivityBySlug(slug) || null;
        }
    }
};

export const getActivitiesByCategory = async (category: string, locale = 'en', page = 1, pageSize = 20, subcategory?: string): Promise<StrapiResponse<Activity>> => {
    if (DEMO_MODE) {
        const filtered = localActivities.filter(a => {
            const cat = a.category?.slug?.toLowerCase();
            return cat === category.toLowerCase();
        });
        return {
            data: filtered,
            meta: { pagination: { page: 1, pageSize: filtered.length, pageCount: 1, total: filtered.length } },
        };
    }
    const filters: Record<string, unknown> = {
        category: {
            slug: { $eq: category }
        },
    };
    if (subcategory) {
        filters.subcategory = { $eq: subcategory };
    }

    const safeLocale = sanitizeLocale(locale);
    const query = qs.stringify({
        locale: safeLocale,
        filters,
        populate: '*',
        pagination: { page, pageSize },
    }, { encodeValuesOnly: true });

    const url = `${getBaseUrl()}/activities?${query}`;
    console.log(`[API] fetch category '${category}'${subcategory ? ` subcategory '${subcategory}'` : ''}: ${url}`);

    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data?.data?.length === 0) {
            if (locale !== 'en') {
                console.log(`[API] fallback to English for category: ${category}`);
                return getActivitiesByCategory(category, 'en', page, pageSize, subcategory);
            }
            console.log('[API] Strapi returned empty activity category list, using WordPress fallback');
            try {
                const wpActivities = await wpApi.getActivities(locale);
                const filtered = wpActivities.filter((a) => {
                    const activityCategory = getLocalActivityCategory(a)?.toLowerCase();
                    return activityCategory === category.toLowerCase();
                });
                const mapped = filtered;
                return {
                    data: mapped,
                    meta: { pagination: { page: 1, pageSize: mapped.length, pageCount: 1, total: mapped.length } },
                };
            } catch (fallbackError) {
                console.error(`WordPress fallback failed for category ${category}:`, fallbackError);
                const mapped = getLocalActivitiesByCategory(category);
                return {
                    data: mapped,
                    meta: { pagination: { page: 1, pageSize: mapped.length, pageCount: 1, total: mapped.length } },
                };
            }
        }

        data.data = await populateMissingImagesWithEn(data.data, locale);

        return data;
    } catch (error) {
        console.error(`Error fetching activities by category ${category}:`, error);
        try {
            const wpActivities = await wpApi.getActivities(locale);
            const filtered = wpActivities.filter((a) => {
                const activityCategory = getLocalActivityCategory(a)?.toLowerCase();
                return activityCategory === category.toLowerCase();
            });
            const mapped = filtered;
            return {
                data: mapped,
                meta: { pagination: { page: 1, pageSize: mapped.length, pageCount: 1, total: mapped.length } },
            };
        } catch (fallbackError) {
            console.error(`WordPress fallback failed for category ${category}:`, fallbackError);
            const mapped = getLocalActivitiesByCategory(category);
            return {
                data: mapped,
                meta: { pagination: { page, pageSize: mapped.length, pageCount: 1, total: mapped.length } },
            };
        }
    }
}

export const getCategories = async (locale = 'en'): Promise<Category[]> => {
    if (DEMO_MODE) {
        return [
            { id: 1, documentId: 'sea', name: 'Sea', slug: 'sea' },
            { id: 2, documentId: 'land', name: 'Land', slug: 'land' },
            { id: 3, documentId: 'air', name: 'Air', slug: 'air' },
        ];
    }
    const safeLocale = sanitizeLocale(locale);
    const query = qs.stringify({
        locale: safeLocale,
        populate: '*',
        sort: ['name:asc'],
    }, { encodeValuesOnly: true });

    const url = `${getBaseUrl()}/categories?${query}`;

    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();

        if (json.data.length === 0 && locale !== 'en') {
            console.log(`[API] fallback to English for categories`);
            return getCategories('en');
        }

        return json.data;
    } catch (error) {
        console.error(`Error fetching categories:`, error);
        return [
            { id: 0, documentId: 'sea', name: 'Sea', slug: 'sea' },
            { id: 0, documentId: 'land', name: 'Land', slug: 'land' },
            { id: 0, documentId: 'air', name: 'Air', slug: 'air' },
        ];
    }
};

export const getCategoryBySlug = async (slug: string, locale = 'en'): Promise<Category | null> => {
    if (DEMO_MODE) {
        const cats = [
            { id: 1, documentId: 'sea', name: 'Sea', slug: 'sea' },
            { id: 2, documentId: 'land', name: 'Land', slug: 'land' },
            { id: 3, documentId: 'air', name: 'Air', slug: 'air' },
        ];
        return cats.find(c => c.slug === slug) || null;
    }
    const safeLocale = sanitizeLocale(locale);
    const query = qs.stringify({
        locale: safeLocale,
        filters: { slug: { $eq: slug } },
        populate: '*',
    }, { encodeValuesOnly: true });

    const url = `${getBaseUrl()}/categories?${query}`;
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        const category = json.data?.[0] || null;

        if (!category && locale !== 'en') {
            console.log(`[API] fallback to English for category slug: ${slug}`);
            return getCategoryBySlug(slug, 'en');
        }

        return category;
    } catch (error) {
        console.error(`Error fetching category by slug ${slug}:`, error);
        return null;
    }
};

export const getContactDetails = cache(async (locale = 'en'): Promise<ContactDetails | null> => {
    if (DEMO_MODE) {
        return {
            id: 0,
            documentId: 'demo',
            facebookUrl: 'https://www.facebook.com/allezmoristravel',
            instagramUrl: 'https://www.instagram.com/allezmoristravel',
            whatsappUrl: 'https://wa.me/23057218070',
            phoneNumber: '+230 5721 8070',
            email: 'info@allezmoristravel.com',
            address: 'Mont Choisy, Grand Baie, Mauritius',
        };
    }
    const safeLocale = sanitizeLocale(locale);
    const query = qs.stringify({
        locale: safeLocale,
        populate: '*',
    }, { encodeValuesOnly: true });

    const url = `${getBaseUrl()}/contactdetails?${query}`;

    const fallbackDetails: ContactDetails = {
        id: 0,
        documentId: '',
        facebookUrl: 'https://www.facebook.com',
        instagramUrl: 'https://www.instagram.com',
        whatsappUrl: '',
        phoneNumber: '',
        email: 'info@allezmoristravel.com',
        address: ''
    };

    try {
        const response = await fetch(url, { 
            headers: getHeaders(),
            next: { revalidate: 3600 } // Cache the response globally for 1 hour
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();

        // Strapi may return an error object like {statusCode, name, message} inside
        // an otherwise 200 response. Detect this and bail out to fallback.
        if (json?.error || json?.statusCode || json?.data?.statusCode) {
            console.error('[API] Strapi returned an error payload for contact details:', json.error || json);
            return fallbackDetails;
        }

        const data = json?.data;
        if (!data) {
            console.warn('[API] No data returned for contact details, using fallback.');
            return fallbackDetails;
        }
        const attributes = data?.attributes || data || {};

        // Ensure a URL has the https:// protocol prefix
        const ensureAbsoluteUrl = (url: string): string => {
            if (!url) return url;
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return url;
            return `https://${url}`;
        };

        // Apply fallback logic for all social URLs as requested
        const processedDetails: ContactDetails = {
            id: data?.id || attributes.id || 0,
            documentId: attributes.documentId || '',
            facebookUrl: attributes.facebookUrl?.trim() ? ensureAbsoluteUrl(attributes.facebookUrl.trim()) : 'https://www.facebook.com',
            instagramUrl: attributes.instagramUrl?.trim() ? ensureAbsoluteUrl(attributes.instagramUrl.trim()) : 'https://www.instagram.com',
            whatsappUrl: attributes.whatsappUrl?.trim() ? ensureAbsoluteUrl(attributes.whatsappUrl.trim()) : '',
            phoneNumber: attributes.phoneNumber || '',
            email: attributes.email || 'info@allezmoristravel.com',
            address: attributes.address || ''
        };

        return processedDetails;
    } catch (error) {
        console.error(`Error fetching contact details:`, error);
        return fallbackDetails;
    }
});

// ─── Accommodations ──────────────────────────────────────────────────────────

const populateAccommodationMissingImagesWithEn = async (
    accommodations: StrapiAccommodation[],
    locale: string,
): Promise<StrapiAccommodation[]> => {
    if (locale === 'en' || !accommodations?.length) return accommodations;

    const missingIds = accommodations
        .filter(a => !a.coverImages?.length)
        .map(a => a.documentId)
        .filter(Boolean);
    if (!missingIds.length) return accommodations;

    try {
        const query = qs.stringify({
            locale: 'en',
            filters: { documentId: { $in: missingIds } },
            populate: ['coverImages'],
            pagination: { pageSize: missingIds.length },
        }, { encodeValuesOnly: true });

        const url = `${getBaseUrl()}/accommodations?${query}`;
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const enDataFull = (await res.json()) as StrapiResponse<StrapiAccommodation>;
        const enData = enDataFull.data;

        return accommodations.map(acc => {
            if (!acc.coverImages?.length) {
                const enAcc = enData.find(en => en.documentId === acc.documentId);
                if (enAcc?.coverImages?.length) {
                    return { ...acc, coverImages: enAcc.coverImages };
                }
            }
            return acc;
        });
    } catch (e) {
        console.error('[API] Failed to fetch fallback EN images for accommodations:', e);
        return accommodations;
    }
};

const mockAccommodationToStrapi = (a: typeof localAccommodations[number]): StrapiAccommodation => ({
    id: parseInt(a.id, 10) || 0,
    documentId: a.slug,
    slug: a.slug,
    internalName: a.title,
    isActive: true,
    title: a.title,
    description: a.description,
    propertyType: a.type,
    region: a.region,
    location: a.location,
    bedrooms: a.bedrooms,
    maxGuests: a.guests,
    pricePerNight: parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0,
    currency: '€',
    features: a.features.join('\n'),
    coverImages: a.images.map((url, i) => ({
        id: i,
        documentId: a.slug,
        url,
        provider: 'local',
        width: 1200,
        height: 800,
        alternativeText: a.title,
    })),
    locationUrl: a.locationUrl,
    locale: 'en',
});

export const getAccommodations = async (locale = 'en'): Promise<StrapiResponse<StrapiAccommodation>> => {
    if (DEMO_MODE) {
        const data = localAccommodations.map(mockAccommodationToStrapi);
        return {
            data,
            meta: { pagination: { page: 1, pageSize: data.length, pageCount: 1, total: data.length } },
        };
    }
    const safeLocale = sanitizeLocale(locale);
    const query = qs.stringify({
        locale: safeLocale,
        filters: { isActive: { $eq: true } },
        populate: '*',
        sort: ['title:asc'],
    }, { encodeValuesOnly: true });

    const url = `${getBaseUrl()}/accommodations?${query}`;
    console.log(`[API] fetch accommodations: ${url}`);

    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.data.length === 0 && locale !== 'en') {
            console.log(`[API] fallback to English for accommodations`);
            return getAccommodations('en');
        }

        data.data = await populateAccommodationMissingImagesWithEn(data.data, locale);

        return data;
    } catch (error) {
        console.error('Error fetching accommodations:', error);
        return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
    }
};

export const getAccommodationBySlug = async (slug: string, locale = 'en'): Promise<StrapiAccommodation | null> => {
    if (DEMO_MODE) {
        const found = localAccommodations.find(a => a.slug === slug);
        return found ? mockAccommodationToStrapi(found) : null;
    }
    const safeLocale = sanitizeLocale(locale);
    const query = qs.stringify({
        locale: safeLocale,
        filters: { slug: { $eq: slug } },
        populate: '*',
    }, { encodeValuesOnly: true });

    const url = `${getBaseUrl()}/accommodations?${query}`;
    console.log(`[API] fetch accommodation by slug '${slug}': ${url}`);

    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        const data = json.data[0];

        if (!data && locale !== 'en') {
            console.log(`[API] fallback to English for accommodation slug: ${slug}`);
            return getAccommodationBySlug(slug, 'en');
        }

        if (data) {
            const populated = await populateAccommodationMissingImagesWithEn([data], locale);
            return populated[0];
        }

        return null;
    } catch (error) {
        console.error(`Error fetching accommodation by slug ${slug}:`, error);
        return null;
    }
};

// ─── CMS-managed editorial content ───────────────────────────────────────────
// Unlike Activities/Accommodations, these have no WordPress/local-data fallback
// tier — if Strapi has no entry yet (content type not created, or empty),
// these resolve to [] / null and callers fall back to existing static/i18n content.

const fetchStrapiCollection = async <T>(
    endpoint: string,
    locale: string,
    extraQuery: Record<string, unknown> = {},
): Promise<T[]> => {
    if (DEMO_MODE) return [];
    const safeLocale = sanitizeLocale(locale);
    const query = qs.stringify({ locale: safeLocale, populate: '*', ...extraQuery }, { encodeValuesOnly: true });
    const url = `${getBaseUrl()}/${endpoint}?${query}`;

    try {
        const response = await fetch(url, { headers: getHeaders(), next: { revalidate: 3600 } });
        if (response.status === 404) return [];
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        const data = Array.isArray(json?.data) ? json.data : [];

        if (data.length === 0 && locale !== 'en') {
            return fetchStrapiCollection<T>(endpoint, 'en', extraQuery);
        }
        return data;
    } catch (error) {
        console.error(`[API] Error fetching ${endpoint}:`, error);
        return [];
    }
};

const fetchStrapiSingle = async <T>(endpoint: string, locale: string): Promise<T | null> => {
    if (DEMO_MODE) return null;
    const safeLocale = sanitizeLocale(locale);
    const query = qs.stringify({ locale: safeLocale, populate: '*' }, { encodeValuesOnly: true });
    const url = `${getBaseUrl()}/${endpoint}?${query}`;

    try {
        const response = await fetch(url, { headers: getHeaders(), next: { revalidate: 3600 } });
        if (response.status === 404) return null;
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();

        if (!json?.data && locale !== 'en') {
            return fetchStrapiSingle<T>(endpoint, 'en');
        }
        return json?.data || null;
    } catch (error) {
        console.error(`[API] Error fetching ${endpoint}:`, error);
        return null;
    }
};

export const getTestimonials = (locale = 'en'): Promise<Testimonial[]> =>
    fetchStrapiCollection<Testimonial>('testimonials', locale, { sort: ['createdAt:asc'] });

export const getLegalPageBySlug = async (slug: string, locale = 'en'): Promise<LegalPage | null> => {
    const pages = await fetchStrapiCollection<LegalPage>('legal-pages', locale, {
        filters: { slug: { $eq: slug } },
    });
    return pages[0] || null;
};

export const getRentalVehicles = (locale = 'en'): Promise<RentalVehicle[]> =>
    fetchStrapiCollection<RentalVehicle>('rental-vehicles', locale, { sort: ['sortOrder:asc'] });

export const getTransferVehicleCategories = (locale = 'en'): Promise<TransferVehicleCategory[]> =>
    fetchStrapiCollection<TransferVehicleCategory>('transfer-vehicle-categories', locale);

export const getTransferPriceRoutes = (locale = 'en'): Promise<TransferPriceRoute[]> =>
    fetchStrapiCollection<TransferPriceRoute>('transfer-price-routes', locale, { sort: ['sortOrder:asc'] });

export const getHomePage = (locale = 'en'): Promise<HomePage | null> =>
    fetchStrapiSingle<HomePage>('home-page', locale);

export const getAboutPage = (locale = 'en'): Promise<AboutPage | null> =>
    fetchStrapiSingle<AboutPage>('about-page', locale);

export const getServicesRentalPage = (locale = 'en'): Promise<ServicesRentalPage | null> =>
    fetchStrapiSingle<ServicesRentalPage>('services-rental-page', locale);

export const getServicesTransferPage = (locale = 'en'): Promise<ServicesTransferPage | null> =>
    fetchStrapiSingle<ServicesTransferPage>('services-transfer-page', locale);

export const getGlobalSettings = (locale = 'en'): Promise<GlobalSettings | null> =>
    fetchStrapiSingle<GlobalSettings>('global', locale);
