import type { Metadata } from "next";
import Image from "next/image";
import { Car, CheckCircle2, MapPin, ShieldCheck, Fuel, Users } from "lucide-react";
import {
    Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CarEnquireButton from "@/components/CarEnquireButton";
import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";
import { getRentalVehicles, getServicesRentalPage, getStrapiMedia } from "@/lib/api";

export async function generateMetadata(props: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    return {
        title: dict.metadata?.rental?.title,
        description: dict.metadata?.rental?.description,
        alternates: getAlternates(params.lang, "/services/rental"),
    };
}

export default async function CarRentalPage(props: { params: Promise<{ lang: string }> }) {
    const params = await props.params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dict: Record<string, any> = await getDictionary(params.lang);
    const [cmsVehicles, cmsPage] = await Promise.all([
        getRentalVehicles(params.lang),
        getServicesRentalPage(params.lang),
    ]);

    const cars = cmsVehicles.length > 0
        ? cmsVehicles.map((v) => ({
            id: v.vehicleId,
            model: v.model,
            price: v.price,
            image: getStrapiMedia(v.image?.url) || "/placeholder.jpg",
            title: v.title,
            description: v.description,
            details: v.details,
            bestFor: v.bestFor,
            features: v.features,
            period: dict.services.rental.PerDay,
        }))
        : [
            {
                id: "economy",
                model: "Suzuki S-Presso",
                price: "€25",
                image: "/suzuki-s-presso-.webp",
            },
            {
                id: "compact",
                model: "Suzuki Swift",
                price: "€30",
                image: "/Suzuki-swift.jpg",
            },
            {
                id: "medium",
                model: "Suzuki Fronx",
                price: "€38",
                image: "/Suzuki-fronx.jpg",
            },
            {
                id: "suv",
                model: "Suzuki Vitara",
                price: "€48",
                image: "/Suzuki-Vitara.jpg",
            },
            {
                id: "7seater",
                model: "Suzuki Ertiga",
                price: "€42",
                image: "/Suzuki-Ertiga.webp",
            },
            {
                id: "scooter",
                model: "Suzuki 125cc or Similar",
                price: "€20",
                image: "/suzuki-an125-white-124cc-scooter.jpg",
            },
        ].map((car) => {
            const carData = dict.services.rental.Cars[car.id];
            return {
                ...car,
                title: carData.Title,
                description: carData.Description,
                details: carData.Details,
                bestFor: carData.BestFor,
                features: carData.Features,
                period: dict.services.rental.PerDay,
            };
        });

    return (
        <div className="bg-[url('/sand-background-phone.png')] md:bg-[url('/sand_background.png')] bg-cover bg-fixed bg-center bg-no-repeat min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
                            <Car className="w-5 h-5 text-primary" />
                            <span className="font-medium text-primary">{cmsPage?.badge || dict.services.rental.Badge}</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            {cmsPage?.title || dict.services.rental.Title}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            {cmsPage?.description || dict.services.rental.Description}
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 -mt-10 md:-mt-16 relative z-10">

                {/* Fleet Grid */}
                <div className="grid gap-8 mb-20 max-w-5xl mx-auto">
                    {cars.map((car) => (
                        <Card key={car.id} className="overflow-hidden border-none shadow-lg bg-card">
                            <div className="grid md:grid-cols-2 lg:grid-cols-5 h-full">
                                {/* Image Side */}
                                <div className="relative h-48 sm:h-64 md:h-auto lg:col-span-2 overflow-hidden">
                                    <Image
                                        src={car.image}
                                        alt={car.model}
                                        fill
                                        className="object-contain p-4"
                                    />
                                </div>

                                {/* Content Side */}
                                <div className="p-6 md:p-8 lg:col-span-3 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                            <div>
                                                <Badge variant="outline" className="mb-2 border-primary/20 text-primary bg-primary/5">
                                                    {car.model}
                                                </Badge>
                                                <h2 className="text-2xl font-bold font-serif text-foreground">{car.title}</h2>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-2xl font-bold text-primary">{car.price}</span>
                                                <span className="text-sm text-muted-foreground">{car.period}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <p className="text-muted-foreground leading-relaxed">
                                                {car.description}
                                            </p>
                                            <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/20 p-4 rounded-lg">
                                                {car.details}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {car.features.map((feature: string, i: number) => (
                                                    <div key={i} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-secondary/10 text-secondary-foreground">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                                            <Users className="w-4 h-4 text-primary" />
                                            <span className="font-semibold text-foreground mr-1">{dict.services.rental.BestFor}</span>
                                            {car.bestFor}
                                        </div>
                                    </div>

                                    <CarEnquireButton
                                        carModel={car.model}
                                        label={dict.services.rental.BookNow.replace("{{model}}", car.model)}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Benefits Section */}
                <div className="max-w-4xl mx-auto mb-20 text-center">
                    <h2 className="font-serif text-3xl font-bold mb-10">{dict.services.rental.WhyRent.Title}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Car, title: dict.services.rental.WhyRent.Reason1Title, desc: dict.services.rental.WhyRent.Reason1Desc },
                            { icon: ShieldCheck, title: dict.services.rental.WhyRent.Reason2Title, desc: dict.services.rental.WhyRent.Reason2Desc },
                            { icon: MapPin, title: dict.services.rental.WhyRent.Reason3Title, desc: dict.services.rental.WhyRent.Reason3Desc },
                            { icon: Fuel, title: dict.services.rental.WhyRent.Reason4Title, desc: dict.services.rental.WhyRent.Reason4Desc },
                        ].map((item, index) => (
                            <div key={index} className="p-6 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
