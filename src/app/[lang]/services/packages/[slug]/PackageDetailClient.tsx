"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, MapPin, Users, Clock, Check, X, Calendar, ChevronRight, Map } from "lucide-react";
import EnquireFormDialog from "@/components/EnquireFormDialog";
import { getStrapiMedia } from "@/lib/api";
import type { HolidayPackage } from "@/types/strapi";

interface PackageDetailClientProps {
    pkg: HolidayPackage;
    lang: string;
}

const getMapEmbedUrl = (urlStr?: string): string | null => {
    if (!urlStr || urlStr.trim() === "") return null;
    try {
        if (urlStr.startsWith("http")) {
            const url = new URL(urlStr);
            const q = url.searchParams.get("q") || url.searchParams.get("query");
            if (q) return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(q)}`;
            const pathMatch = urlStr.match(/place\/([^/]+)/);
            if (pathMatch) return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(pathMatch[1])}`;
        }
        if (urlStr.length < 100) {
            return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(urlStr + ", Mauritius")}`;
        }
    } catch {
        // invalid URL — fall through to null
    }
    return null;
};

export default function PackageDetailClient({ pkg, lang }: PackageDetailClientProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const images: string[] = (() => {
        if (pkg.coverImages && pkg.coverImages.length > 0) {
            return pkg.coverImages.map((img) => getStrapiMedia(img.url)).filter(Boolean) as string[];
        }
        return ["/category-stay.jpg"];
    })();

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const nextImage = () => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
    const prevImage = () => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));

    const highlightsList = pkg.highlights ? pkg.highlights.split("\n").filter((s) => s.trim()) : [];
    const inclusionsList = pkg.inclusions ? pkg.inclusions.split("\n").filter((s) => s.trim()) : [];
    const exclusionsList = pkg.exclusions ? pkg.exclusions.split("\n").filter((s) => s.trim()) : [];
    const features = Array.isArray(pkg.features) ? pkg.features : [];

    const displayPrice = pkg.discountPrice ?? pkg.price;
    const mapEmbedUrl = getMapEmbedUrl(pkg.location);

    return (
        <div className="min-h-screen bg-background">

            {/* Photo Gallery */}
            <section className="relative pt-0">
                <div className="relative">
                    <Link
                        href={`/${lang}`}
                        className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-white hover:text-white/80 transition-colors z-20 bg-foreground/30 backdrop-blur-sm rounded-full px-4 py-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back to Home</span>
                    </Link>

                    {images.length >= 5 ? (
                        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[50vh] md:h-[60vh]">
                            <div
                                className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden group"
                                onClick={() => openLightbox(0)}
                            >
                                <Image src={images[0]} alt={pkg.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" priority />
                            </div>
                            {images.slice(1, 5).map((img, i) => (
                                <div key={i} className="relative cursor-pointer overflow-hidden group" onClick={() => openLightbox(i + 1)}>
                                    <Image src={img} alt={`${pkg.title} - ${i + 2}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    {i === 3 && images.length > 5 && (
                                        <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                                            <span className="text-white font-semibold text-lg">+{images.length - 5} more</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative h-[50vh] md:h-[60vh] w-full cursor-pointer" onClick={() => openLightbox(0)}>
                            <Image src={images[0]} alt={pkg.title} fill className="object-cover" priority />
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent p-6 md:p-12 pointer-events-none">
                        <div className="container mx-auto">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="secondary" className="capitalize pointer-events-auto">{pkg.packageType}</Badge>
                                {pkg.region && (
                                    <Badge variant="outline" className="text-white border-white/50 pointer-events-auto">{pkg.region}</Badge>
                                )}
                            </div>
                            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">{pkg.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
                                {pkg.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-5 h-5" />
                                        <span>{pkg.location}</span>
                                    </div>
                                )}
                                {pkg.duration && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-5 h-5" />
                                        <span>{pkg.duration}</span>
                                    </div>
                                )}
                                {pkg.maxGuests && (
                                    <div className="flex items-center gap-1">
                                        <Users className="w-5 h-5" />
                                        <span>Up to {pkg.maxGuests} guests</span>
                                    </div>
                                )}
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
                        <Image src={images[lightboxIndex]} alt={`${pkg.title} - ${lightboxIndex + 1}`} fill className="object-contain" />
                    </div>
                    <span className="absolute bottom-6 text-white/70 text-sm">{lightboxIndex + 1} / {images.length}</span>
                </div>
            )}

            {/* Main Content */}
            <section className="py-10 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-10">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-10">

                            {/* Overview — maps to CMS "overview" field */}
                            {(pkg.overview || pkg.description) && (
                                <div>
                                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Overview</h2>
                                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {pkg.overview || pkg.description}
                                    </div>
                                </div>
                            )}

                            {/* Highlights — maps to CMS "highlights" field (one per line) */}
                            {highlightsList.length > 0 && (
                                <div>
                                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Highlights</h2>
                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {highlightsList.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 bg-secondary/10 rounded-lg p-3">
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Check className="w-4 h-4 text-primary-foreground" />
                                                </div>
                                                <span className="text-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Inclusions + Exclusions — maps to CMS "inclusions" / "exclusions" fields */}
                            {(inclusionsList.length > 0 || exclusionsList.length > 0) && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {inclusionsList.length > 0 && (
                                        <div>
                                            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">What&apos;s Included</h2>
                                            <ul className="space-y-2">
                                                {inclusionsList.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                        <span className="text-muted-foreground">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {exclusionsList.length > 0 && (
                                        <div>
                                            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Not Included</h2>
                                            <ul className="space-y-2">
                                                {exclusionsList.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                                        <span className="text-muted-foreground">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Features — maps to CMS "features" JSON array field */}
                            {features.length > 0 && (
                                <div>
                                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Features &amp; Amenities</h2>
                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 bg-secondary/10 rounded-lg p-3">
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Check className="w-4 h-4 text-primary-foreground" />
                                                </div>
                                                <span className="text-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Location map — derived from CMS "location" field if it contains a URL */}
                            {mapEmbedUrl && (
                                <div>
                                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                                        <Map className="w-6 h-6 text-primary" />
                                        Location
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
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Booking Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-card rounded-2xl shadow-lg p-6 border border-border/50">
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-foreground">€{displayPrice}</span>
                                        <span className="text-muted-foreground">/ night</span>
                                    </div>
                                    {pkg.originalPrice && (
                                        <p className="text-sm text-muted-foreground line-through mt-0.5">€{pkg.originalPrice} / night</p>
                                    )}
                                    {pkg.duration && (
                                        <p className="text-sm text-muted-foreground mt-1">{pkg.duration}</p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-secondary/20 rounded-lg text-sm text-foreground/80">
                                        <p className="mb-2 font-medium">Interested in this package?</p>
                                        <p>Contact us to check availability and get a personalised quote.</p>
                                    </div>

                                    <EnquireFormDialog
                                        itemName={pkg.title}
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
