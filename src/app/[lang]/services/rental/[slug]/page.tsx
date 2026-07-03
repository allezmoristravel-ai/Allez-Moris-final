export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRentalVehicleBySlug, getStrapiMedia } from "@/lib/api";
import { getAlternates } from "@/lib/seo";
import CarDetailClient from "./CarDetailClient";

export async function generateMetadata(props: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
    const params = await props.params;
    const vehicle = await getRentalVehicleBySlug(params.slug, params.lang);

    if (!vehicle) return { title: "Not Found" };

    const heroImage = getStrapiMedia(vehicle.coverImages?.[0]?.url ?? vehicle.image?.url);

    return {
        title: `${vehicle.title} | Allez Moris`,
        description: vehicle.description,
        openGraph: {
            images: heroImage ? [heroImage] : [],
        },
        alternates: getAlternates(params.lang, `/services/rental/${params.slug}`),
    };
}

export default async function CarDetailPage(props: { params: Promise<{ slug: string; lang: string }> }) {
    const params = await props.params;
    const vehicle = await getRentalVehicleBySlug(params.slug, params.lang);

    if (!vehicle) {
        notFound();
    }

    return <CarDetailClient vehicle={vehicle} lang={params.lang} />;
}
