"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ActivityCard } from "@/components/ActivityCard";
import { Activity } from "@/types/strapi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MapPin, ArrowUpDown, Loader2 } from "lucide-react";
import { loadMoreCategoryActivities } from "@/app/actions";

interface ActivityListProps {
    activities: Activity[];
    category: string;
    initialPagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
    lang: string;
    translations: {
        viewDetails: string;
        perPerson: string;
        filterByRegion: string;
        allRegions: string;
        sortBy: string;
        sortDefault: string;
        sortPriceAsc: string;
        sortPriceDesc: string;
        regions: Record<string, string>;
    };
}

export function ActivityList({ activities, category, initialPagination, lang, translations }: ActivityListProps) {
    const searchParams = useSearchParams();
    const subcategory = searchParams.get("subcategory") ?? undefined;

    const [selectedRegion, setSelectedRegion] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("default");

    // Infinite scroll state
    const [items, setItems] = useState<Activity[]>(activities);
    const [page, setPage] = useState<number>(initialPagination.page);
    const [hasMore, setHasMore] = useState<boolean>(initialPagination.page < initialPagination.pageCount);
    const [loading, setLoading] = useState<boolean>(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    // Recharge depuis Strapi quand la subcategory change
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        loadMoreCategoryActivities(category, lang, 1, subcategory).then((response) => {
            if (cancelled) return;
            setItems(response.data);
            setPage(response.meta.pagination.page);
            setHasMore(response.meta.pagination.page < response.meta.pagination.pageCount);
        }).catch(() => {
            if (!cancelled) setItems([]);
        }).finally(() => {
            if (!cancelled) setLoading(false);
        });
        return () => { cancelled = true; };
    }, [subcategory, category, lang]);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await loadMoreCategoryActivities(category, lang, nextPage, subcategory);

            if (response && response.data) {
                setItems(prev => [...prev, ...response.data]);
                setPage(response.meta.pagination.page);
                setHasMore(response.meta.pagination.page < response.meta.pagination.pageCount);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more activities:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading, category, lang, subcategory]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            {
                root: null,
                rootMargin: "20px",
                threshold: 0.1,
            }
        );

        const currentLoaderRef = loaderRef.current;
        if (currentLoaderRef) {
            observer.observe(currentLoaderRef);
        }

        return () => {
            if (currentLoaderRef) {
                observer.unobserve(currentLoaderRef);
            }
        };
    }, [loadMore, hasMore, loading]);

    const filteredAndSorted = useMemo(() => {
        let result = items;
        if (selectedRegion !== "all") {
            result = result.filter(a => a.region === selectedRegion);
        }
        if (sortBy === "priceAsc") {
            result = [...result].sort((a, b) => a.publicPrice - b.publicPrice);
        } else if (sortBy === "priceDesc") {
            result = [...result].sort((a, b) => b.publicPrice - a.publicPrice);
        }
        return result;
    }, [items, selectedRegion, sortBy]);

    // Extract unique regions for the filter dropdown
    const availableRegions = useMemo(() => {
        const regions = new Set(items.map(a => a.region).filter(Boolean) as string[]);
        return Array.from(regions);
    }, [items]);

    if (items.length === 0) {
        return null; // Handled by parent wrapper entirely if the category itself is empty
    }

    return (
        <div className="space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-card p-4 rounded-xl shadow-md border border-border/40">

                {/* Filter */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                        <MapPin className="w-4 h-4 inline-block mr-1 mb-0.5" />
                        {translations.filterByRegion}
                    </span>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder={translations.allRegions} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{translations.allRegions}</SelectItem>
                            {availableRegions.map(region => (
                                <SelectItem key={region} value={region}>
                                    {translations.regions[region] || region}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                        <ArrowUpDown className="w-4 h-4 inline-block mr-1 mb-0.5" />
                        {translations.sortBy}
                    </span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder={translations.sortDefault} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">{translations.sortDefault}</SelectItem>
                            <SelectItem value="priceAsc">{translations.sortPriceAsc}</SelectItem>
                            <SelectItem value="priceDesc">{translations.sortPriceDesc}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>

            {filteredAndSorted.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border/40 shadow-sm">
                    <p className="text-muted-foreground text-lg">No activities match your selected filters.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSorted.map((activity, index) => (
                        <div key={`${activity.id}-${index}`} className="h-full">
                            <ActivityCard
                                activity={activity}
                                showCategoryBadge={false}
                                labels={{
                                    viewDetails: translations.viewDetails,
                                    perPerson: translations.perPerson
                                }}
                                lang={lang}
                                regionTranslation={activity.region ? translations.regions[activity.region] || activity.region : undefined}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Loading / Infinite Scroll Indicator */}
            {hasMore && (
                <div ref={loaderRef} className="py-8 flex justify-center items-center w-full">
                    {loading && <Loader2 className="w-8 h-8 animate-spin text-primary" />}
                </div>
            )}
        </div>
    );
}
