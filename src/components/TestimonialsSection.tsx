import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { Testimonial } from "@/types/strapi";

const fallbackTestimonials = [
  {
    id: 1,
    name: "Sarah L.",
    location: "London, UK",
    rating: 5,
    text: "Allez Moris made our trip unforgettable. We snorkeled in hidden lagoons, rode up mountains for the best views, and even paraglided over the island. The custom itinerary was exactly what we wanted. An absolute dream escape!",
    avatar: "S",
  },
  {
    id: 2,
    name: "Marcus T.",
    location: "Berlin, Germany",
    rating: 5,
    text: "The bucket list feature was a game-changer. I listed everything I wanted to do, and they planned the perfect week. From dolphin watching at sunrise to hiking Le Morne—every day was an adventure.",
    avatar: "M",
  },
  {
    id: 3,
    name: "Emma & James",
    location: "Sydney, Australia",
    rating: 5,
    text: "We came for our honeymoon and Allez Moris exceeded all expectations. The private speedboat tour was the highlight. Crystal clear waters, incredible service, and memories we'll treasure forever.",
    avatar: "E",
  },
];

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
}

const TestimonialsSection = ({ testimonials, title, subtitle, ctaLabel }: TestimonialsSectionProps) => {
  const items = testimonials && testimonials.length > 0
    ? testimonials.map((t) => ({
        id: t.id,
        name: t.customerName,
        location: t.location,
        rating: t.rating,
        text: t.quote,
        avatar: t.customerName?.charAt(0) || "?",
      }))
    : fallbackTestimonials;

  return (
    <section id="about" className="py-16 md:py-24 bg-transparent">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title || "Our Happy Travelers"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {subtitle || "Real stories from travelers who discovered Mauritius with us."}
          </p>
        </div>

        {/* Testimonials Carousel / Grid */}
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full mb-10"
        >
          <CarouselContent className="-ml-4 md:-ml-8">
            {items.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:pl-8 md:basis-1/3">
                <div className="bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-foreground mb-6 leading-relaxed flex-1">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-ocean flex items-center justify-center flex-shrink-0">
                      <span className="text-ocean-foreground font-bold text-lg">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* CTA */}
        <div className="text-center">
          <Button variant="default" size="lg">
            {ctaLabel || "Read More Reviews →"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
