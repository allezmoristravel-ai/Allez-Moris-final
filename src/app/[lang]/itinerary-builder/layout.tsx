import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";

export async function generateMetadata(props: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    return {
        title: dict.metadata?.itineraryBuilder?.title,
        description: dict.metadata?.itineraryBuilder?.description,
        alternates: getAlternates(params.lang, "/itinerary-builder"),
    };
}

export default function ItineraryBuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
