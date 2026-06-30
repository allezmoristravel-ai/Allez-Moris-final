"use client";

import { useState, useEffect } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Loader2, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import EnquireFormDialog from "@/components/EnquireFormDialog";

interface HotelSpecial {
    id: number;
    name: string;
    category: "hotel" | "apartment";
    rating: number;
    price: number;
    originalPrice?: number;
    location: string;
    image: string;
    description: string;
    amenities: string[];
}

const HotelSpecialsCarousel = () => {
    const { i18n } = useTranslation();
    const [hotels, setHotels] = useState<HotelSpecial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mock hotel data for now
    const mockHotels: HotelSpecial[] = [
        {
            id: 1,
            name: "Beachfront Paradise Resort",
            category: "hotel",
            rating: 4.8,
            price: 180,
            originalPrice: 220,
            location: "Trou aux Biches",
            image: "/category-stay.jpg",
            description: "Luxury beachfront resort with all amenities",
            amenities: ["Pool", "Spa", "Beach Access"],
        },
        {
            id: 2,
            name: "Mountain View Apartments",
            category: "apartment",
            rating: 4.6,
            price: 95,
            originalPrice: 120,
            location: "Moka",
            image: "/category-sea.jpg",
            description: "Cozy apartments with stunning mountain views",
            amenities: ["Kitchen", "WiFi", "Balcony"],
        },
        {
            id: 3,
            name: "Coastal Elegance Hotel",
            category: "hotel",
            rating: 4.9,
            price: 210,
            originalPrice: 260,
            location: "Bel Ombre",
            image: "/category-land.jpg",
            description: "Premium hotel with world-class services",
            amenities: ["Restaurant", "Gym", "Concierge"],
        },
        {
            id: 4,
            name: "Urban Studio Apartments",
            category: "apartment",
            rating: 4.5,
            price: 75,
            originalPrice: 95,
            location: "Port Louis",
            image: "/category-air.jpg",
            description: "Modern apartments in the heart of the city",
            amenities: ["Modern Design", "Public Transport", "Shops Nearby"],
        },
        {
            id: 5,
            name: "Sunset Harbor Hotel",
            category: "hotel",
            rating: 4.7,
            price: 165,
            originalPrice: 200,
            location: "Grand Baie",
            image: "/category-rental.jpg",
            description: "Charming hotel with sunset beach access",
            amenities: ["Beach Bar", "Water Sports", "Sunset Views"],
        },
    ];

    useEffect(() => {
        const loadHotels = async () => {
            setIsLoading(true);
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));
                setHotels(mockHotels);
            } catch (error) {
                console.error("Failed to load hotel specials", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadHotels();
    }, [i18n.language]);

    if (!isLoading && hotels.length === 0) {
        return null;
    }

    return (
        <section id="hotel-specials" className="py-16 md:py-24 bg-transparent">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Holiday Packages
                    </h2>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                        ))}
                    </div>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Discover our best accommodation deals for your Mauritius getaway
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    <Button variant="outline" className="rounded-full">
                        All
                    </Button>
                    <Button variant="outline" className="rounded-full">
                        Hotels
                    </Button>
                    <Button variant="outline" className="rounded-full">
                        Apartments
                    </Button>
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
                            {hotels.map((hotel) => (
                                <CarouselItem
                                    key={hotel.id}
                                    className="basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                                >
                                    <div className="h-full block">
                                        <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group h-full flex flex-col">
                                            {/* Image with Badge */}
                                            <div className="relative h-48 overflow-hidden shrink-0">
                                                <Image
                                                    src={hotel.image}
                                                    alt={hotel.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />

                                                {/* Category Badge */}
                                                <Badge className="absolute top-3 left-3 capitalize">
                                                    {hotel.category}
                                                </Badge>

                                                {/* Discount Badge */}
                                                {hotel.originalPrice && (
                                                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                        -{Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)}%
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 flex flex-col flex-1">
                                                <h3 className="font-serif text-lg font-bold mb-1 line-clamp-2">
                                                    {hotel.name}
                                                </h3>

                                                {/* Location */}
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                                                    <MapPin className="w-4 h-4" />
                                                    {hotel.location}
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${
                                                                    i < Math.floor(hotel.rating)
                                                                        ? "fill-primary text-primary"
                                                                        : "text-muted-foreground"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-semibold">{hotel.rating}</span>
                                                </div>

                                                {/* Price */}
                                                <div className="flex items-baseline gap-2 mb-4">
                                                    <span className="text-2xl font-bold text-primary">
                                                        ${hotel.price}
                                                    </span>
                                                    {hotel.originalPrice && (
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            ${hotel.originalPrice}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-muted-foreground">/night</span>
                                                </div>

                                                {/* Amenities */}
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                            {amenity}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                {/* CTA Button */}
                                                <EnquireFormDialog
                                                    itemName={hotel.name}
                                                    type="accommodation"
                                                    trigger={
                                                        <Button className="w-full mt-auto">
                                                            Pre-Book
                                                        </Button>
                                                    }
                                                />
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
