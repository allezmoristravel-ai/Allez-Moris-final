"use client";

import Link from "next/link";
import { MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIItinerarySectionProps {
    title: string;
    description: string;
    cta: string;
    lang: string;
}

export default function AIItinerarySection({
    title,
    description,
    cta,
    lang,
}: AIItinerarySectionProps) {
    return (
        <section className="py-12 bg-primary/5 border-y border-primary/10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 text-primary font-medium mb-2">
                            <MapPinned className="w-5 h-5" />
                            <span>Trip Planning</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
                        <p className="text-muted-foreground">{description}</p>
                    </div>
                    <Button asChild size="lg" className="rounded-full px-8 text-lg shrink-0">
                        <Link href={`/${lang}/itinerary-builder`}>
                            {cta}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
