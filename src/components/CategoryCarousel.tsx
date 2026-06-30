"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTranslation } from "react-i18next";
import { NavigationButton } from "@/components/NavigationButton";

import { Category } from "@/types/strapi";

interface CategoryCarouselProps {
  categories: Category[];
}

const CategoryCarousel = ({ categories }: CategoryCarouselProps) => {
  const { t } = useTranslation();

  // Helper to get static image based on slug
  const getCategoryImage = (slug: string) => {
    const images: Record<string, string> = {
      sea: "/category-sea.jpg",
      land: "/category-land.jpg",
      air: "/category-air.jpg",
      rental: "/category-rental.jpg",
      stay: "/category-stay.jpg",
    };
    return images[slug.toLowerCase()] || "/category-land.jpg";
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section id="categories" className="pt-8 pb-16 md:pt-12 md:pb-24 bg-transparent">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("categories.title")}
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 bg-border" />
            <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
              {t("categories.subtitle")}
            </span>
            <span className="h-px w-12 bg-border" />
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("categories.description")}
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {categories.map((category) => (
              <CarouselItem
                key={category.id}
                className="basis-1/2 md:basis-1/3 lg:basis-1/5"
              >
                <div className="h-full block">
                  <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden shrink-0">
                      <Image
                        src={getCategoryImage(category.slug)}
                        alt={category.name}
                        fill
                        sizes="100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className={`font-serif text-xl font-bold mb-2 text-center ${{
                        sea: "text-blue-600",
                        land: "text-green-600",
                        air: "text-sky-500",
                        rental: "text-yellow-500",
                        stay: "text-rose-600",
                      }[category.slug.toLowerCase()] || "text-foreground"
                        }`}>
                        {t(`categories.items.${category.slug}.title`)}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {t(`categories.items.${category.slug}.description`, "Discover amazing activities")}
                      </p>
                      <NavigationButton
                        href={["rental", "stay"].includes(category.slug.toLowerCase()) ? `/services/${category.slug.toLowerCase()}` : `/activities/${category.slug}`}
                        variant="outline"
                        className="w-full mt-auto"
                      >
                        {t('common.explore', 'Explore')} →
                      </NavigationButton>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
