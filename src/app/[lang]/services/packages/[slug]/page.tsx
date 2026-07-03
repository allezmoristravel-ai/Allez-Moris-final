export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getHolidayPackageBySlug, getStrapiMedia } from "@/lib/api";
import { getAlternates } from "@/lib/seo";
import PackageDetailClient from "./PackageDetailClient";

export async function generateMetadata(
    props: { params: Promise<{ slug: string; lang: string }> }
): Promise<Metadata> {
    const params = await props.params;
    const pkg = await getHolidayPackageBySlug(params.slug, params.lang);
    if (!pkg) return { title: "Not Found" };
    const heroImage = getStrapiMedia(pkg.coverImages?.[0]?.url);
    return {
        title: `${pkg.title} | Allez Moris`,
        description: pkg.description,
        openGraph: { images: heroImage ? [heroImage] : [] },
        alternates: getAlternates(params.lang, `/services/packages/${params.slug}`),
    };
}

export default async function PackageDetailPage(
    props: { params: Promise<{ slug: string; lang: string }> }
) {
    const params = await props.params;
    const pkg = await getHolidayPackageBySlug(params.slug, params.lang);
    if (!pkg) notFound();
    return <PackageDetailClient pkg={pkg} lang={params.lang} />;
}
