import { getTranslation } from "@/i18n";
import Image from "next/image";
import { NavigationButton } from "@/components/NavigationButton";
import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(props: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    return {
        title: dict.metadata?.services?.title,
        description: dict.metadata?.services?.description,
        alternates: getAlternates(params.lang, "/services"),
    };
}

export default async function ServicesPage(props: { params: Promise<{ lang: string }> }) {
    const params = await props.params;
    const { t } = await getTranslation(params.lang);

    const categories = [
        {
            id: "rentals",
            title: t("servicesPage.categories.rentals.title", "Car Rental"),
            description: t("servicesPage.categories.rentals.description", "Explore the island at your own pace with our reliable car rental services."),
            image: "/category-rental.jpg",
            cta: t("categories.items.rental.cta", "View Cars"),
            href: `/${params.lang}/services/rental`,
        },
        {
            id: "accommodation",
            title: t("servicesPage.categories.accommodation.title", "Accommodation"),
            description: t("servicesPage.categories.accommodation.description", "Find the perfect place to stay, from luxury resorts to cozy villas."),
            image: "/category-stay.jpg",
            cta: t("categories.items.stay.cta", "Find Stays"),
            href: `/${params.lang}/services/stay`,
        },
        {
            id: "taxi",
            title: t("servicesPage.categories.taxi.title", "Airport Transfers"),
            description: t("servicesPage.categories.taxi.description", "Reliable and comfortable airport transfers to your destination."),
            image: "/category-land.jpg",
            cta: t("hero.cta", "Book Transfer"),
            href: `/${params.lang}/services/airport-transfer`,
        }
    ];

    return (
        <div className="container mx-auto pt-20 px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-4 font-serif">{t("servicesPage.title", "Our Services")}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">{t("servicesPage.description", "Discover the range of services we offer to make your Mauritius trip unforgettable.")}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                    <div key={category.id} className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col h-full border border-border/50">
                        <div className="relative h-56 w-full">
                            <Image
                                src={category.image}
                                alt={category.title}
                                fill
                                sizes="100vw"
                                className="object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-serif text-xl font-bold mb-3 text-foreground">{category.title}</h3>
                            <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{category.description}</p>
                            <div className="mt-auto">
                                <NavigationButton href={category.href} className="w-full">
                                    {category.cta} →
                                </NavigationButton>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
