import { getTranslation } from "@/i18n";
import Image from "next/image";
import { NavigationButton } from "@/components/NavigationButton";
import { getCategories } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  return {
    title: dict.metadata?.activities?.title,
    description: dict.metadata?.activities?.description,
    alternates: getAlternates(params.lang, "/activities"),
  };
}

export default async function ActivitiesPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const { t } = await getTranslation(params.lang);

  const backendCategories = await getCategories(params.lang);
  const supportedSlugs = ["sea", "land", "air"];
  const categories = supportedSlugs.map((slug) => {
    const backendCategory = backendCategories.find((category) => category.slug === slug);
    return {
      id: slug,
      title: backendCategory?.name || t(`categories.items.${slug}.title`),
      description: t(`categories.items.${slug}.description`),
      image: `/category-${slug}.jpg`,
      cta: t(`categories.items.${slug}.cta`),
    };
  });

  return (
    <div className="container mx-auto pt-20 px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 font-serif">{t("nav.activities")}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t("categories.description")}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col h-full border border-border/50">
            <div className="relative h-56 w-full">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-serif text-xl font-bold mb-3 text-foreground">{category.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{category.description}</p>
              <div className="mt-auto">
                <NavigationButton href={`/${params.lang}/activities/${category.id}`} className="w-full">
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
