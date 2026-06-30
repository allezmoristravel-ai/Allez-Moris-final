export interface CloudImageFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: string | null;
    width: number;
    height: number;
    size: number;
    url: string;
}

export interface CloudImage {
    id: number;
    documentId: string;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: Record<string, unknown>;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
        thumbnail?: CloudImageFormat;
        small?: CloudImageFormat;
        medium?: CloudImageFormat;
        large?: CloudImageFormat;
    };
}

export interface ComponentItinerary {
    id: number;
    time: string;
    title: string;
    description: string;
}

export interface ComponentFaq {
    id: number;
    question: string;
    answer: string;
}

export interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
}

export interface Activity {
    id: number;
    documentId: string;
    slug: string;
    internalName: string;
    isActive: boolean;
    isBookable: boolean;

    // Core Content (Localized)
    title: string;
    overview: string; // Rich Text (Markdown)
    highlights: string; // Rich Text
    inclusions: string; // Rich Text
    exclusions: string; // Rich Text
    duration: string;
    region?: string;
    bookingWidget?: string;

    // Pricing & Capacity
    publicPrice: number;
    publicPriceMur?: number;
    netRate?: number;
    maxPersons?: number;
    price?: string; // Legacy string field if used
    isGroupPrice?: boolean;
    childPrice?: number;

    // Media & Relations
    coverImage?: CloudImage[];
    category?: Category;
    subcategory?: string;

    // Location
    locationUrl?: string;

    // Video
    youtubeLink?: string;

    // Components
    itinerary: ComponentItinerary[];
    faqs: ComponentFaq[];

    // Localization
    locale: string;
    localizations?: Activity[];

}

export interface StrapiAccommodation {
    id: number;
    documentId: string;
    slug: string;
    internalName: string;
    isActive: boolean;

    // Core Content (Localized)
    title: string;
    description: string; // Rich Text (Markdown)
    propertyType: string; // Apartment, Villa, Guesthouse, Hotel
    region: string; // North, South, East, West
    location: string;

    // Capacity & Pricing
    bedrooms: number;
    maxGuests: number;
    pricePerNight: number;
    publicPriceMur?: number;
    currency: string;

    // Features (stored as richtext list in Strapi, parsed as string[])
    features: string; // Rich Text - each line = one feature

    // Media
    coverImages?: CloudImage[];

    // Location
    locationUrl?: string;

    // Localization
    locale: string;
    localizations?: StrapiAccommodation[];
}

export interface ContactDetails {
    id: number;
    documentId: string;
    facebookUrl: string | null;
    instagramUrl: string | null;
    whatsappUrl: string | null;
    phoneNumber: string | null;
    email: string | null;
    address: string | null;
}

export interface StrapiSingleResponse<T> {
    data: T;
    meta: Record<string, unknown>;
}

export interface StrapiResponse<T> {
    data: T[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

