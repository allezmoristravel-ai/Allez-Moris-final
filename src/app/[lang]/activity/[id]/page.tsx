import { getActivityBySlug, getStrapiMedia } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ActivityDetailClient from "./client";
import { getAlternates } from "@/lib/seo";

/**
 * Resolves a Google Maps short URL (maps.app.goo.gl) to extract coordinates.
 * Returns a coordinates string like "-20.293359,57.787061" or null.
 */
async function resolveMapCoordinates(locationUrl?: string): Promise<string | null> {
    if (!locationUrl || locationUrl.trim() === '') return null;

    try {
        // If it's already a full Google Maps URL with coordinates, extract them directly
        const coordsMatch = locationUrl.match(/@(-?\d+\.\d+),\+?(-?\d+\.\d+)/);
        if (coordsMatch) {
            return `${coordsMatch[1]},${coordsMatch[2]}`;
        }

        // For short URLs (maps.app.goo.gl), follow all redirects to get the final URL
        if (locationUrl.includes('goo.gl') || locationUrl.includes('maps.app')) {
            const res = await fetch(locationUrl, { redirect: 'follow' });
            const finalUrl = res.url;
            if (finalUrl) {
                // Format: /maps/search/-20.293359,+57.787061
                const searchMatch = finalUrl.match(/maps\/search\/(-?\d+\.\d+),\+?(-?\d+\.\d+)/);
                if (searchMatch) {
                    return `${searchMatch[1]},${searchMatch[2]}`;
                }
                // Format: @-20.293359,57.787061
                const atMatch = finalUrl.match(/@(-?\d+\.\d+),\+?(-?\d+\.\d+)/);
                if (atMatch) {
                    return `${atMatch[1]},${atMatch[2]}`;
                }
                // Format: q=-20.293359,57.787061 (coordinates)
                const qMatch = finalUrl.match(/[?&]q=(-?\d+\.\d+),\+?(-?\d+\.\d+)/);
                if (qMatch) {
                    return `${qMatch[1]},${qMatch[2]}`;
                }
                // Format: q=Place+Name (place name query)
                const qParam = new URL(finalUrl).searchParams.get('q');
                if (qParam) {
                    return qParam;
                }
            }
        }

        // For standard Google Maps URLs with a query parameter
        if (locationUrl.startsWith('http')) {
            const url = new URL(locationUrl);
            const q = url.searchParams.get("q") || url.searchParams.get("query");
            if (q) return q;

            const placeMatch = locationUrl.match(/place\/([^/]+)/);
            if (placeMatch) return decodeURIComponent(placeMatch[1]);
        }
    } catch (e) {
        console.error("[MAP] Error resolving location URL:", e);
    }
    return null;
}

// 1. Generate Metadata for SEO automatically
export async function generateMetadata(props: { params: Promise<{ id: string; lang: string }> }): Promise<Metadata> {
    const params = await props.params;
    const activity = await getActivityBySlug(params.id, params.lang);
    if (!activity) return { title: "Not Found" };

    const imageUrl = getStrapiMedia(activity.coverImage?.[0]?.url);

    return {
        title: `${activity.title} | Allez Moris`,
        description: activity.overview,
        openGraph: {
            images: imageUrl ? [imageUrl] : [],
        },
        alternates: getAlternates(params.lang, `/activity/${params.id}`),
    };
}

// 2. Server Component fetches data
export default async function ActivityPage(props: { params: Promise<{ id: string; lang: string }> }) {
    const params = await props.params;
    const activity = await getActivityBySlug(params.id, params.lang);

    if (!activity) {
        notFound(); // Triggers Next.js 404 page
    }

    const imageUrl = getStrapiMedia(activity.coverImage?.[0]?.url);

    // Resolve the short map URL server-side to get coordinates
    const resolvedMapQuery = await resolveMapCoordinates(activity.locationUrl);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: activity.title,
        description: activity.overview,
        url: `https://www.allezmoristravel.com/${params.lang}/activity/${activity.slug}`,
        image: imageUrl ? [imageUrl] : [],
        offers: {
            '@type': 'Offer',
            price: activity.publicPrice,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock'
        }
    };

    // Pass data to a client component that handles the interactive parts (Accordion, Buttons, etc.)
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ActivityDetailClient activity={activity} lang={params.lang} resolvedMapQuery={resolvedMapQuery} />
        </>
    );
}
