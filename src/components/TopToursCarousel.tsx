"use client";

import { useState, useEffect } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { ActivityCard } from "@/components/ActivityCard";
import { Star, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Activity } from "@/types/strapi";

const TopToursCarousel = () => {
    const { t, i18n } = useTranslation();

    // 1. Dynamic State to hold API data
    const [tours, setTours] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. Fetch Data from API Proxy on load
    useEffect(() => {
        const loadTours = async () => {
            setIsLoading(true);
            try {
                const currentLang = i18n.language ? i18n.language.split('-')[0] : 'en';
                const res = await fetch(`/api/proxy/toptours?locale=${currentLang}`);

                if (!res.ok) {
                    console.warn(`Failed to fetch top tours: ${res.status}`);
                    setTours([]);
                    return;
                }

                const data = await res.json();
                setTours(data);
            } catch (error) {
                console.warn("Failed to load top tours:", error instanceof Error ? error.message : "Unknown error");
                setTours([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadTours();
    }, [i18n.language]);

    if (!isLoading && tours.length === 0) {
        return null;
    }

    return (
        <section id="tours" className="py-16 md:py-24 bg-transparent">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {t("tours.title")}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                        ))}
                    </div>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        {t("tours.description")}
                    </p>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    /* Carousel */
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {tours.map((tour) => (
                                <CarouselItem
                                    key={tour.id}
                                    className="basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                                >
                                    <ActivityCard
                                        activity={tour}
                                        showCategoryBadge={true}
                                        labels={{
                                            viewDetails: t("tours.viewDetails"),
                                            perPerson: t("tours.perPerson")
                                        }}
                                        lang={i18n.language ? i18n.language.split('-')[0] : 'en'}
                                        regionTranslation={tour.region ? t(`itineraryBuilder.regions.${tour.region}`, tour.region) : undefined}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}
            </div>
        </section>
    );
};

export default TopToursCarousel;
