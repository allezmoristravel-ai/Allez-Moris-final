import { StrapiAccommodation, CloudImage } from './strapi';
import { getStrapiMedia } from '@/lib/api';

export interface Accommodation {
    id: string;
    title: string;
    region: string;
    location: string;
    type: string;
    price: string;
    period: string;
    image: string;
    images: string[];
    bedrooms: number;
    guests: number;
    description: string;
    features: string[];
    slug: string;
    locationUrl?: string;
}

/**
 * Parse a richtext features field (one feature per line) into a string array.
 */
function parseFeaturesFromRichtext(raw: string | undefined | null): string[] {
    if (!raw) return [];
    return raw
        .split('\n')
        .map(line => line.replace(/^[-*•]\s*/, '').trim())
        .filter(Boolean);
}

function getImageUrl(img: CloudImage): string {
    return getStrapiMedia(img.url) || img.url;
}

/**
 * Convert a Strapi Accommodation into the UI Accommodation interface.
 */
export function mapStrapiAccommodation(s: StrapiAccommodation): Accommodation {
    const images = (s.coverImages ?? []).map(getImageUrl);
    return {
        id: s.slug,
        slug: s.slug,
        title: s.title,
        region: s.region || '',
        location: s.location || '',
        type: s.propertyType || '',
        price: `${s.currency ?? '€'}${s.pricePerNight ?? 0}`,
        period: 'per night',
        image: images[0] || '/placeholder.jpg',
        images: images.length ? images : ['/placeholder.jpg'],
        bedrooms: s.bedrooms ?? 0,
        guests: s.maxGuests ?? 0,
        description: s.description || '',
        features: parseFeaturesFromRichtext(s.features),
        locationUrl: s.locationUrl,
    };
}
