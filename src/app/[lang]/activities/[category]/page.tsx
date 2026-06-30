export const dynamic = 'force-dynamic';

import { getActivitiesByCategory, getCategoryBySlug } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslation } from "@/i18n";
import { ActivityList } from "@/components/ActivityList";
import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";
import type { Metadata } from "next";

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function generateMetadata(props: {
    params: Promise<{ category: string; lang: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    const cat = capitalize(params.category);
    const title = dict.metadata?.activitiesCategory?.title?.replace("{{category}}", cat);
    const description = dict.metadata?.activitiesCategory?.description?.replace("{{category}}", cat);
    return {
        title,
        description,
        alternates: getAlternates(params.lang, `/activities/${params.category}`),
    };
}

export default async function ActivityCategoryPage(props: { params: Promise<{ lang: string, category: string }>; searchParams?: Promise<{ subcategory?: string }> }) {
    const params = await props.params;
    const searchParams = props.searchParams ? await props.searchParams : {};
    const subcategory = searchParams.subcategory;
    const { t } = await getTranslation(params.lang);
    const category = params.category;

    const validCategories = ["sea", "land", "air"];
    if (!validCategories.includes(category.toLowerCase())) {
        notFound();
    }

    const categoryInfo = await getCategoryBySlug(category, params.lang);
    const categoryTitle = categoryInfo?.name || t("categories.items." + category + ".title");
    const categoryDescription = t("categories.items." + category + ".description");

    console.log(`[Server] Rendering Category Page: ${category} (${params.lang})${subcategory ? ` subcategory: ${subcategory}` : ''}`);
    const { data: activities, meta: { pagination } } = await getActivitiesByCategory(category, params.lang, 1, 20, subcategory);
    console.log(`[Page] Found ${activities.length} activities for ${category}`);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Link href={`/${params.lang}/activities`} className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
                    {t("categories.backToCategories")}
                </Link>
                <h1 className="text-4xl font-bold mb-4">{categoryTitle}</h1>
                <p className="text-muted-foreground max-w-3xl">{categoryDescription}</p>
            </div>

            {activities.length === 0 ? (
                <div className="rounded-2xl bg-card p-8 text-center shadow-sm border border-border/50">
                    <p className="text-muted-foreground text-lg">{t("categories.noActivitiesFound", "No activities found in this category.")}</p>
                </div>
            ) : (
                <ActivityList
                    activities={activities}
                    category={category}
                    initialPagination={pagination}
                    lang={params.lang}
                    translations={{
                        viewDetails: t("tours.viewDetails"),
                        perPerson: t("tours.perPerson"),
                        filterByRegion: t("itineraryBuilder.common.filterByRegion", "Filter by Region"),
                        allRegions: t("itineraryBuilder.common.allRegions", "All Regions"),
                        sortBy: t("itineraryBuilder.common.sortBy", "Sort by..."),
                        sortDefault: t("itineraryBuilder.common.sortDefault", "Default"),
                        sortPriceAsc: t("itineraryBuilder.common.sortPriceAsc", "Price (Low to High)"),
                        sortPriceDesc: t("itineraryBuilder.common.sortPriceDesc", "Price (High to Low)"),
                        regions: {
                            North: t("itineraryBuilder.regions.North", "North"),
                            South: t("itineraryBuilder.regions.South", "South"),
                            East: t("itineraryBuilder.regions.East", "East"),
                            West: t("itineraryBuilder.regions.West", "West"),
                        }
                    }}
                />
            )}
        </div>
    );
}
