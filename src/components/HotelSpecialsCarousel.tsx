"use client";

import { useState, useMemo } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "@/lib/api";
import type { RentalVehicle } from "@/types/strapi";

interface DealItem {
    id: number;
    name: string;
    category: "car";
    region: string;
    rating: number;
    priceDisplay: string;
    originalPriceDisplay?: string;
    discountPercent?: number;
    location: string;
    image: string;
    description: string;
    amenities: string[];
    detailPath: string;
}

interface HotelSpecialsCarouselProps {
    rentalDeals?: RentalVehicle[];
    title?: string;
    subtitle?: string;
    lang: string;
}

const PLACEHOLDER_RATING = 4.8;

const mapRentalToDeal = (v: RentalVehicle, lang: string): DealItem => {
    const parseNum = (s?: string) => parseFloat((s || "0").replace(/[^0-9.]/g, "")) || 0;
    const price = parseNum(v.discountPrice || v.price);
    const original = v.originalPrice ? parseNum(v.originalPrice) : undefined;
    return {
        id: v.id,
        name: v.title,
        category: "car",
        region: v.region || "",
        rating: PLACEHOLDER_RATING,
        priceDisplay: v.discountPrice || v.price,
        originalPriceDisplay: v.originalPrice || undefined,
        discountPercent: original && price ? Math.round(((original - price) / original) * 100) : undefined,
        location: v.region || "Mauritius",
        image: getStrapiMedia(v.coverImages?.[0]?.url ?? v.image?.url) || "/category-rental.jpg",
        description: v.description,
        amenities: Array.isArray(v.features) ? v.features.slice(0, 3) : [],
        detailPath: `/${lang}/services/rental/${v.vehicleId}`,
    };
};

const mockDeals = (lang: string): DealItem[] => [
    {
        id: 1, name: "Compact City Runabout", category: "car", region: "North", rating: 4.8,
        priceDisplay: "€25", originalPriceDisplay: "€32", discountPercent: 22,
        location: "Grand Baie", image: "/category-rental.jpg",
        description: "Fuel-efficient compact car, perfect for getting around town",
        amenities: ["A/C", "Bluetooth", "Automatic"], detailPath: `/${lang}/services/rental`,
    },
    {
        id: 2, name: "Family SUV", category: "car", region: "Central", rating: 4.6,
        priceDisplay: "€45", originalPriceDisplay: "€58", discountPercent: 22,
        location: "Port Louis", image: "/category-rental.jpg",
        description: "Spacious SUV with room for the whole family and luggage",
        amenities: ["7 Seats", "A/C", "GPS"], detailPath: `/${lang}/services/rental`,
    },
    {
        id: 3, name: "Convertible Coastal Cruiser", category: "car", region: "South", rating: 4.9,
        priceDisplay: "€60", originalPriceDisplay: "€75", discountPercent: 20,
        location: "Bel Ombre", image: "/category-rental.jpg",
        description: "Open-top convertible ideal for scenic coastal drives",
        amenities: ["Convertible", "A/C", "Automatic"], detailPath: `/${lang}/services/rental`,
    },
];

const HotelSpecialsCarousel = ({ rentalDeals, title, subtitle, lang }: HotelSpecialsCarouselProps) => {
    const [activeRegion, setActiveRegion] = useState<string>("all");

    const allDeals = useMemo<DealItem[]>(() => {
        if (!rentalDeals || rentalDeals.length === 0) return mockDeals(lang);
        return rentalDeals.map((v) => mapRentalToDeal(v, lang));
    }, [rentalDeals, lang]);

    const regions = useMemo(() => {
        const unique = Array.from(new Set(allDeals.map((d) => d.region).filter(Boolean))).sort();
        return unique;
    }, [allDeals]);

    const filtered = useMemo(() => {
        return allDeals.filter((d) => activeRegion === "all" || d.region === activeRegion);
    }, [allDeals, activeRegion]);

    if (allDeals.length === 0) return null;

    return (
        <section id="hotel-specials" className="py-16 md:py-24 bg-transparent">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {title || "Rental Deals"}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                        ))}
                    </div>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        {subtitle || "Discover our best rental car deals for your Mauritius trip"}
                    </p>
                </div>

                {/* Region Filter — only shown when 2+ distinct regions exist */}
                {regions.length >= 2 && (
                    <div className="flex justify-center gap-2 mb-8 flex-wrap">
                        <Button
                            variant={activeRegion === "all" ? "default" : "outline"}
                            className="rounded-full text-sm"
                            onClick={() => setActiveRegion("all")}
                        >
                            All Regions
                        </Button>
                        {regions.map((r) => (
                            <Button
                                key={r}
                                variant={activeRegion === r ? "default" : "outline"}
                                className="rounded-full text-sm capitalize"
                                onClick={() => setActiveRegion(r)}
                            >
                                {r}
                            </Button>
                        ))}
                    </div>
                )}

                {filtered.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">No deals match the selected filters.</p>
                ) : (
                    <Carousel opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent>
                            {filtered.map((item) => (
                                <CarouselItem
                                    key={`${item.category}-${item.id}`}
                                    className="basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                                >
                                    <div className="h-full">
                                        <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group h-full flex flex-col">
                                            {/* Image */}
                                            <div className="relative h-48 overflow-hidden shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                                                {item.discountPercent != null && (
                                                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                        -{item.discountPercent}%
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 flex flex-col flex-1">
                                                <h3 className="font-serif text-lg font-bold mb-1 line-clamp-2">
                                                    {item.name}
                                                </h3>

                                                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                                                    <MapPin className="w-4 h-4" />
                                                    {item.location}
                                                </div>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${
                                                                    i < Math.floor(item.rating)
                                                                        ? "fill-primary text-primary"
                                                                        : "text-muted-foreground"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-semibold">{item.rating}</span>
                                                </div>

                                                <div className="flex items-baseline gap-2 mb-4">
                                                    <span className="text-2xl font-bold text-primary">
                                                        {item.priceDisplay}
                                                    </span>
                                                    {item.originalPriceDisplay && (
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            {item.originalPriceDisplay}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-muted-foreground">
                                                        /day
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {item.amenities.slice(0, 2).map((amenity, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                            {amenity}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <Link href={item.detailPath} className="mt-auto">
                                                    <Button className="w-full">View Details</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}
            </div>
        </section>
    );
};

export default HotelSpecialsCarousel;
