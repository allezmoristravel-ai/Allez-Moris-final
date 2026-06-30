import { activities as localActivities, Activity } from "@/data/activities";

// Point to your GraphQL Endpoint
// Use internal API route /api/graphql on client side to avoid CORS, and direct URL on server side
const WP_GRAPHQL_URL = typeof window !== 'undefined'
    ? "/api/graphql"
    : (process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || "http://localhost:8080/graphql");

class WordPressAPI {

    private async fetchGraphQL(query: string, variables = {}) {
        try {
            const response = await fetch(WP_GRAPHQL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables }),
            });

            if (!response.ok) {
                console.warn(`GraphQL Fetch Failed: ${response.statusText}. Using mock data.`);
                return null;
            }

            const result = await response.json();
            if (result.errors) {
                console.error("GraphQL Query Errors:", result.errors);
                return null;
            }

            return result.data;
        } catch {
            console.warn("GraphQL Connection Failed. Using mock data.");
            return null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapProductToActivity(node: Record<string, any>, langCode: string = 'en'): Activity {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let customData: Record<string, any> = {};
        try {
            if (node.activityData) {
                customData = JSON.parse(node.activityData);
            }
        } catch (e) {
            console.error("Error parsing activityData JSON", e);
        }

        // 2. LANGUAGE SELECTION
        // Normalize language code (e.g. 'fr-FR' -> 'fr')
        const selectedLang = ['en', 'fr', 'de'].includes(langCode) ? langCode : 'en';

        // Force selection of the requested language object.
        // If it's missing, fallback to English ONLY if the object key itself is missing.
        let localized = customData[selectedLang];

        // If the specific language object doesn't exist at all, use English
        if (!localized) {
            localized = customData['en'] || {};
        }

        // 3. Overview Fallback Logic
        // If Carbon Field 'overview' is empty, try WP 'shortDescription', then generic text.
        // We strip HTML tags from shortDescription just in case.
        let cleanShortDesc = "";
        if (node.shortDescription) {
            cleanShortDesc = node.shortDescription.replace(/<[^>]*>?/gm, '');
        }

        const overviewText = localized.overview || cleanShortDesc || "Explore this amazing activity in Mauritius.";

        const mappedPrice = typeof customData.price === 'number'
            ? customData.price
            : parseFloat(customData.price || '');

        const publicPrice = mappedPrice || parseFloat(node.price?.replace(/[^0-9.]/g, '')) || 0;

        return {
            id: node.slug,
            documentId: node.slug,
            slug: node.slug,
            internalName: localized.title || node.name,
            isActive: true,
            isBookable: true,
            title: localized.title || node.name,
            overview: overviewText,
            highlights: localized.highlights || '',
            inclusions: localized.inclusions || '',
            exclusions: localized.exclusions || '',
            duration: localized.duration || 'Flexible',
            region: localized.region || '',
            bookingWidget: '',
            publicPrice,
            netRate: undefined,
            publicPriceMur: undefined,
            maxPersons: customData.max_persons ? Number(customData.max_persons) : undefined,
            price: publicPrice ? `€${publicPrice}` : '€0',
            isGroupPrice: false,
            childPrice: undefined,
            coverImage: node.image ? [{
                id: 0,
                documentId: node.slug,
                url: node.image.sourceUrl,
                provider: 'wordpress',
                width: 0,
                height: 0,
                alternativeText: localized.title || node.name,
            }] : undefined,
            category: { id: 0, documentId: customData.category || 'sea', name: customData.category || 'Sea', slug: customData.category || 'sea' },
            subcategory: customData.subcategory || undefined,
            locationUrl: customData.locationUrl || undefined,
            youtubeLink: customData.youtubeLink || undefined,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            itinerary: Array.isArray(localized.itinerary) ? localized.itinerary.map((item: Record<string, any>) => ({
                id: item.id || 0,
                time: item.time || '',
                title: item.title || '',
                description: item.description || ''
            })) : [],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            faqs: Array.isArray(localized.faqs) ? localized.faqs.map((item: Record<string, any>) => ({
                id: item.id || 0,
                question: item.question || '',
                answer: item.answer || ''
            })) : [],
            locale: langCode,
        };
    }

    // --- PUBLIC METHODS ---

    async getActivities(lang: string = 'en'): Promise<Activity[]> {
        const query = `
      query GetActivities {
        products(first: 50) {
          nodes {
            slug
            name
            shortDescription
            image { sourceUrl }
            ... on SimpleProduct {
              price
            }
            activityData
          }
        }
      }
    `;

        const data = await this.fetchGraphQL(query);
        if (!data) {
            return localActivities;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.products.nodes.map((node: Record<string, any>) => this.mapProductToActivity(node, lang));
    }

    async getActivityBySlug(slug: string, lang: string = 'en'): Promise<Activity | null> {
        const query = `
      query GetActivityBySlug($slug: ID!) {
        product(id: $slug, idType: SLUG) {
          slug
          name
          shortDescription
          image { sourceUrl }
          ... on SimpleProduct {
            price
          }
          activityData
        }
      }
    `;

        const data = await this.fetchGraphQL(query, { slug });
        if (!data || !data.product) {
            const all = await this.getActivities(lang);
            return all.find(a => a.slug === slug) || all[0] || null;
        }

        return this.mapProductToActivity(data.product, lang);
    }

    async getActivitiesByCategory(category: string, lang: string = 'en'): Promise<Activity[]> {
        const all = await this.getActivities(lang);
        // Simple filter for now since we added 'category' to the mapper
        if (!category) return all;
        return all.filter(a => a.category?.slug?.toLowerCase() === category.toLowerCase() || a.category?.name?.toLowerCase() === category.toLowerCase());
    }
}

export const wpApi = new WordPressAPI();
