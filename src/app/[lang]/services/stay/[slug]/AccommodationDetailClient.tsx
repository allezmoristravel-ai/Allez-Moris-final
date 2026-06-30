"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, MapPin, Users, Bed, Check, Calendar, ChevronRight, X, Map } from "lucide-react";
import EnquireFormDialog from "@/components/EnquireFormDialog";
import { Accommodation } from "@/types/accommodation";

interface AccommodationDetailClientProps {
    accommodation: Accommodation;
    lang: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dict: Record<string, any>;
}

export default function AccommodationDetailClient({ accommodation, lang, dict }: AccommodationDetailClientProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const images = accommodation.images?.length ? accommodation.images : [accommodation.image];

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const nextImage = () => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
    const prevImage = () => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));

    // Extract query for Google Maps embed from locationUrl
    const getMapEmbedUrl = (urlStr?: string) => {
        if (!urlStr || urlStr.trim() === '') return null;

        try {
            // If it's a full URL, try to extract 'q' or 'query'
            if (urlStr.startsWith('http')) {
                const url = new URL(urlStr);
                const q = url.searchParams.get("q") || url.searchParams.get("query");
                if (q) {
                    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(q)}`;
                }
                // Handle place/ID paths
                const pathMatch = urlStr.match(/place\/([^/]+)/);
                if (pathMatch) {
                    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(pathMatch[1])}`;
                }
            }

            // If it's not a parseable URL or doesn't have a query, 
            // treat the locationUrl itself as a search query if it's not too long
            if (urlStr.length < 100) {
                return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(urlStr + ", Mauritius")}`;
            }
        } catch (e) {
            console.error("[MAP] Error parsing locationUrl:", e);
        }
        return null;
    };

    const mapEmbedUrl = getMapEmbedUrl(accommodation.locationUrl);

    return (
        <div className="min-h-screen bg-background">
            {/* Photo Gallery Grid */}
            <section className="relative pt-0">
                <div className="relative">
                    {/* Back button */}
                    <Link href={`/${lang}/services/stay`} className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-white hover:text-white/80 transition-colors z-20 bg-foreground/30 backdrop-blur-sm rounded-full px-4 py-2">
                        <ChevronLeft className="w-5 h-5" />
                        <span>{dict?.Back || "Back to Stays"}</span>
                    </Link>

                    {/* Gallery Grid */}
                    {images.length >= 5 ? (
                        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[50vh] md:h-[60vh]">
                            {/* Main large image */}
                            <div
                                className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden group"
                                onClick={() => openLightbox(0)}
                            >
                                <Image
                                    src={images[0]}
                                    alt={accommodation.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    priority
                                />
                            </div>
                            {/* 4 smaller images */}
                            {images.slice(1, 5).map((img, i) => (
                                <div
                                    key={i}
                                    className="relative cursor-pointer overflow-hidden group"
                                    onClick={() => openLightbox(i + 1)}
                                >
                                    <Image
                                        src={img}
                                        alt={`${accommodation.title} - ${i + 2}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {i === 3 && images.length > 5 && (
                                        <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                                            <span className="text-white font-semibold text-lg">+{images.length - 5} more</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Single hero image fallback */
                        <div className="relative h-[50vh] md:h-[60vh] w-full cursor-pointer" onClick={() => openLightbox(0)}>
                            <Image
                                src={images[0]}
                                alt={accommodation.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Overlay with title info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent p-6 md:p-12 pointer-events-none">
                        <div className="container mx-auto">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="secondary" className="capitalize pointer-events-auto">{accommodation.type}</Badge>
                                <Badge variant="outline" className="text-white border-white/50 pointer-events-auto">{accommodation.region}</Badge>
                            </div>
                            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">{accommodation.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-5 h-5" /> <span>{accommodation.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Bed className="w-5 h-5" /> <span>{accommodation.bedrooms} {dict?.Bedrooms || "Bedrooms"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-5 h-5" /> <span>{dict?.Guests || "Guests"}: {accommodation.guests}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={closeLightbox}>
                    <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-white/70 z-50">
                        <X className="w-8 h-8" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 text-white hover:text-white/70 z-50">
                        <ChevronLeft className="w-10 h-10" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 text-white hover:text-white/70 z-50">
                        <ChevronRight className="w-10 h-10" />
                    </button>
                    <div className="relative w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={images[lightboxIndex]}
                            alt={`${accommodation.title} - ${lightboxIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="absolute bottom-6 text-white/70 text-sm">
                        {lightboxIndex + 1} / {images.length}
                    </span>
                </div>
            )}

            {/* Main Content */}
            <section className="py-10 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-10">

                        {/* LEFT COLUMN: Content */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Overview */}
                            <div>
                                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{dict?.Overview || "Overview"}</h2>
                                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {accommodation.description}
                                </div>
                            </div>

                            {/* Features */}
                            {accommodation.features && accommodation.features.length > 0 && (
                                <div>
                                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{dict?.Features || "Property Features"}</h2>
                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {accommodation.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3 bg-secondary/10 rounded-lg p-3">
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Check className="w-4 h-4 text-primary-foreground" />
                                                </div>
                                                <span className="text-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Map Section */}
                            {mapEmbedUrl && (
                                <div>
                                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                                        <Map className="w-6 h-6 text-primary" />
                                        {dict?.Location || "Location"}
                                    </h2>
                                    <div className="rounded-xl overflow-hidden border border-border/50 shadow-md">
                                        <iframe
                                            src={mapEmbedUrl}
                                            width="100%"
                                            height="350"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                    {accommodation.locationUrl && (
                                        <a
                                            href={accommodation.locationUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
                                        >
                                            <MapPin className="w-4 h-4" />
                                            {dict?.ViewOnMap || "View on Google Maps"}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Booking Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-card rounded-2xl shadow-lg p-6 border border-border/50">
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-foreground">{accommodation.price}</span>
                                        <span className="text-muted-foreground">/ {accommodation.period}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-secondary/20 rounded-lg text-sm text-foreground/80">
                                        <p className="mb-2 font-medium">Interested in this property?</p>
                                        <p>Contact us to check availability and get a personalized quote.</p>
                                    </div>

                                    <EnquireFormDialog
                                        itemName={accommodation.title}
                                        type="accommodation"
                                        trigger={
                                            <Button size="lg" className="w-full h-14 text-lg">
                                                <Calendar className="w-5 h-5 mr-2" /> Enquire Now
                                            </Button>
                                        }
                                    />
                                </div>

                                <div className="mt-6 pt-4 border-t border-border">
                                    <p className="text-sm text-muted-foreground text-center">Best Rate Guarantee</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
