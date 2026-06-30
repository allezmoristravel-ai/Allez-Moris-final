export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAccommodationBySlug } from "@/lib/api";
import { getAccommodationBySlug as getMockAccommodationBySlug } from "@/data/accommodations";
import { mapStrapiAccommodation } from "@/types/accommodation";
import { getDictionary } from "@/lib/i18n";
import AccommodationDetailClient from "./AccommodationDetailClient";
import { getAlternates } from "@/lib/seo";

export async function generateMetadata(props: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
    const params = await props.params;
    const strapiAccommodation = await getAccommodationBySlug(params.slug, params.lang);
    let accommodation = strapiAccommodation ? mapStrapiAccommodation(strapiAccommodation) : null;

    if (!accommodation) {
        accommodation = getMockAccommodationBySlug(params.slug) || null;
    }

    if (!accommodation) return { title: "Not Found" };

    return {
        title: `${accommodation.title} | Allez Moris`,
        description: accommodation.description,
        openGraph: {
            images: accommodation.image ? [accommodation.image] : [],
        },
        alternates: getAlternates(params.lang, `/services/stay/${params.slug}`),
    };
}

export default async function AccommodationDetailPage(props: { params: Promise<{ slug: string; lang: string }> }) {
    const params = await props.params;
    const strapiAccommodation = await getAccommodationBySlug(params.slug, params.lang);
    const accommodation = strapiAccommodation
        ? mapStrapiAccommodation(strapiAccommodation)
        : getMockAccommodationBySlug(params.slug);

    if (!accommodation) {
        notFound();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dict: Record<string, any> = await getDictionary(params.lang);

    return <AccommodationDetailClient accommodation={accommodation} lang={params.lang} dict={dict.services.stayDetail} />;
}
