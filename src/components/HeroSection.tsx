"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPinned, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getStrapiMedia } from "@/lib/api";
import type { CloudImage } from "@/types/strapi";

interface HeroSectionProps {
    images?: CloudImage[];
}

const HeroSection = ({ images }: HeroSectionProps) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language?.split("-")[0] || "en";

    const defaultHeroImages = [
        "/hero-mauritius.jpg",
        "/category-sea.jpg",
        "/category-land.jpg",
    ];
    const cmsHeroImages = (images || [])
        .map((img) => getStrapiMedia(img.url))
        .filter((url): url is string => Boolean(url));
    const heroImages = cmsHeroImages.length > 0 ? cmsHeroImages : defaultHeroImages;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const goToNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    };

    const goToPrevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    return (
        <section className="relative w-full flex flex-col items-center pt-24 pb-12 bg-transparent">
            {/* Background Image Container with Slideshow */}
            <div className="relative w-[95%] md:w-[85%] h-[60vh] md:h-[70vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex items-center group">
                {heroImages.map((img, idx) => (
                    <Image
                        key={idx}
                        src={img}
                        alt={`Mauritius view ${idx + 1}`}
                        sizes="100vw"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            idx === currentImageIndex ? "opacity-100" : "opacity-0"
                        }`}
                        fill
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />

                {/* Slideshow Navigation Arrows */}
                <button
                    onClick={goToPrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-foreground/30 hover:bg-foreground/50 text-accent rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-foreground/30 hover:bg-foreground/50 text-accent rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Slideshow Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {heroImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentImageIndex ? "bg-accent w-8" : "bg-accent/50"
                            }`}
                            aria-label={`Go to image ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-accent mb-4 uppercase">
                            {t("hero.title").split(' ').slice(0, -1).join(' ')}
                            <span className="block text-primary">{t("hero.title").split(' ').pop()}</span>
                        </h1>

                        <p className="text-accent/90 text-lg md:text-xl mb-8 max-w-lg">
                            {t("hero.subtitle")}
                        </p>

                        {/* Itinerary Builder CTA */}
                        <Link
                            href={`/${lang}/bucket-list`}
                            className="inline-flex items-center gap-4 bg-card/90 hover:bg-card transition-colors rounded-xl px-8 py-4 group max-w-xl w-full"
                        >
                            <div className="w-12 h-12 rounded-full bg-ocean flex items-center justify-center shrink-0">
                                <MapPinned className="w-6 h-6 text-ocean-foreground" />
                            </div>
                            <div>
                                <p className="font-bold text-foreground text-lg">{t("itineraryBuilder.title")}</p>
                                <p className="text-sm text-muted-foreground">{t("itineraryBuilder.description")}</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default HeroSection;
