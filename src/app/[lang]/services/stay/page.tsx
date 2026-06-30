export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { getAccommodations } from "@/lib/api";
import { getAccommodations as getMockAccommodations } from "@/data/accommodations";
import { mapStrapiAccommodation } from "@/types/accommodation";
import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";

export async function generateMetadata(props: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    return {
        title: dict.metadata?.stay?.title,
        description: dict.metadata?.stay?.description,
        alternates: getAlternates(params.lang, "/services/stay"),
    };
}

export default async function AccommodationPage(props: { params: Promise<{ lang: string }> }) {
    const params = await props.params;
    const { data: strapiAccommodations } = await getAccommodations(params.lang);
    const accommodations = strapiAccommodations.length > 0
        ? strapiAccommodations.map(mapStrapiAccommodation)
        : getMockAccommodations();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dict: Record<string, any> = await getDictionary(params.lang);

    return (
        <div className="bg-[url('/sand-background-phone.png')] md:bg-[url('/sand_background.png')] bg-cover bg-fixed bg-center bg-no-repeat min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
                            <Bed className="w-5 h-5 text-primary" />
                            <span className="font-medium text-primary">{dict.services.stay.Badge}</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            {dict.services.stay.Title}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            {dict.services.stay.Description}
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 -mt-10 md:-mt-16 relative z-10">

                {/* Accommodations Grid */}
                {accommodations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">No accommodations available at the moment.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {accommodations.map((item) => (
                            <Link href={`/${params.lang}/services/stay/${item.slug}`} key={item.id} className="block h-full">
                                <Card className="overflow-hidden border-none shadow-lg bg-card hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <Badge className="absolute top-4 left-4 bg-white/90 text-foreground hover:bg-white">
                                            {item.type}
                                        </Badge>
                                        <Badge variant="secondary" className="absolute top-4 right-4 capitalize shadow-sm">
                                            {dict.services.stay.Card.Region}: {item.region}
                                        </Badge>
                                    </div>

                                    <CardContent className="p-6 flex-grow">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <div className="flex items-center gap-1.5 text-sm text-primary font-medium mb-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {item.location}
                                                </div>
                                                <h3 className="font-serif text-xl font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-foreground/80 mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <Bed className="w-4 h-4" />
                                                <span>{item.bedrooms} {dict.services.stay.Card.Beds}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-4 h-4" />
                                                <span>{dict.services.stay.Card.Guests.replace("{{count}}", item.guests.toString())}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {item.features.slice(0, 3).map((feature, i) => (
                                                <span key={i} className="text-xs px-2.5 py-1 bg-secondary/10 rounded-full text-secondary-foreground">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between border-t border-border/50 bg-secondary/5">
                                        <div className="pt-4">
                                            <span className="text-2xl font-bold text-primary">{item.price}</span>
                                            <span className="text-sm text-muted-foreground"> {dict.services.stay.Card.PricePerPeriod.replace("{{period}}", item.period)}</span>
                                        </div>
                                        <div className="pt-4">
                                            <Button size="sm">{dict.services.stay.Card.ViewDetails}</Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Requirements/Info Section */}
                <div className="max-w-4xl mx-auto mb-20 bg-card rounded-2xl p-8 shadow-sm border border-border/50">
                    <h2 className="font-serif text-2xl font-bold mb-6 text-center">{dict.services.stay.WhyBook.Title}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center p-0 border-primary text-primary">1</Badge>
                                {dict.services.stay.WhyBook.Reason1Title}
                            </h3>
                            <p className="text-muted-foreground text-sm">{dict.services.stay.WhyBook.Reason1Desc}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center p-0 border-primary text-primary">2</Badge>
                                {dict.services.stay.WhyBook.Reason2Title}
                            </h3>
                            <p className="text-muted-foreground text-sm">{dict.services.stay.WhyBook.Reason2Desc}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
