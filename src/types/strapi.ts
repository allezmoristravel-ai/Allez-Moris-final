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

    // Deals (Holiday Packages carousel)
    isDeal?: boolean;
    discountPrice?: number;
    originalPrice?: number;

    // Media
    coverImages?: CloudImage[];

    // Location
    locationUrl?: string;

    // Localization
    locale: string;
    localizations?: StrapiAccommodation[];
}

export interface Testimonial {
    id: number;
    documentId: string;
    customerName: string;
    location: string;
    rating: number;
    quote: string;
    avatar?: CloudImage;
    locale: string;
}

export interface LegalPage {
    id: number;
    documentId: string;
    slug: string;
    title: string;
    body: string; // Rich Text
    locale: string;
}

export interface RentalVehicle {
    id: number;
    documentId: string;
    vehicleId: string; // matches local fleet keys e.g. "economy", "compact"
    model: string;
    price: string;
    image?: CloudImage;
    title: string;
    description: string;
    details: string;
    bestFor: string;
    features: string[];
    sortOrder?: number;
    locale: string;
}

export interface TransferVehicleCategory {
    id: number;
    documentId: string;
    categoryId: string; // "standard" | "family" | "coach" | "luxury"
    name: string;
    capacity: string;
    idealFor: string;
    locale: string;
}

export interface TransferPriceRoute {
    id: number;
    documentId: string;
    destination: string;
    standardPrice: string;
    familyPrice: string;
    coachPrice: string;
    luxuryPrice: string;
    sortOrder?: number;
    locale: string;
}

export interface HomePage {
    id: number;
    documentId: string;
    heroImages?: CloudImage[];
    categorySectionTitle?: string;
    categorySectionSubtitle?: string;
    testimonialsSectionTitle?: string;
    testimonialsSectionSubtitle?: string;
    testimonialsCtaLabel?: string;
    holidayPackagesTitle?: string;
    holidayPackagesSubtitle?: string;
    locale: string;
}

export interface AboutPage {
    id: number;
    documentId: string;
    heroTitle?: string;
    heroSubtitle?: string;
    // ourName.p1 is intentionally not CMS-managed: the dictionary version embeds
    // <1>...</1> markup that the page splits to style "Allez Moris" — only the
    // quote (p2) is exposed here to avoid editors breaking that markup.
    ourNameP2?: string;
    whoWeAreTitle?: string;
    whoWeAreP1?: string;
    whoWeAreP2?: string;
    whatWeDoTitle?: string;
    whatWeDoSubtitle?: string;
    whatWeDoItems?: string[]; // JSON field
    ourApproachTitle?: string;
    ourApproachSubtitle?: string;
    ourApproachItems?: string[]; // JSON field
    whyChooseUsTitle?: string;
    whyChooseUsSubtitle?: string;
    whyChooseUsP1?: string;
    whyChooseUsP2?: string;
    outroTitle?: string;
    outroSubtitle?: string;
    outroFooter?: string;
    locale: string;
}

export interface ServicesRentalPage {
    id: number;
    documentId: string;
    badge?: string;
    title?: string;
    description?: string;
    locale: string;
}

export interface ServicesTransferPage {
    id: number;
    documentId: string;
    badge?: string;
    title?: string;
    description?: string;
    locale: string;
}

export interface GlobalSettings {
    id: number;
    documentId: string;
    footerHelpLinks?: { id: number; label: string; url: string }[];
    locale: string;
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

