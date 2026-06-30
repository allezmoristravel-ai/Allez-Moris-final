"use client";



import { Activity } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, Check, ChevronLeft, ChevronRight, Clock, Users, X, Map, Youtube } from "lucide-react";
import { useState } from "react";
import { BookingPopup } from "@/components/BookingPopup";
import { useTranslation } from "react-i18next";
import EnquireFormDialog from "@/components/EnquireFormDialog";

export default function ActivityDetailClient({ activity, lang, resolvedMapQuery }: { activity: Activity, lang: string, resolvedMapQuery: string | null }) {
  const { t } = useTranslation();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = activity.coverImage
    ? activity.coverImage.map(img => getStrapiMedia(img.url)).filter(Boolean) as string[]
    : ["/category-sea.jpg"];
  const categoryName = activity.category?.name || 'Tour';

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
  const prevImage = () => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));

  // Build embed URL from server-resolved coordinates
  const mapEmbedUrl = resolvedMapQuery
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(resolvedMapQuery)}&language=${lang}`
    : null;

  // Map rich text strings (markdown) to arrays if valid, otherwise empty array
  // Assuming simple line breaks for now based on previous implementation
  const highlightsList = activity.highlights ? activity.highlights.split('\n').filter(s => s.trim()) : [];
  const inclusionsList = activity.inclusions ? activity.inclusions.split('\n').filter(s => s.trim()) : [];
  const exclusionsList = activity.exclusions ? activity.exclusions.split('\n').filter(s => s.trim()) : [];

  const price = activity.publicPrice;
  const currency = "€";
  const groupSize = activity.maxPersons ? `Up to ${activity.maxPersons}` : 'Small Group';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Lightbox */}
      <section className="relative pt-0">
        <div className="relative">
          <Link href={`/${lang}/activities`} className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-white hover:text-white/80 transition-colors z-20 bg-foreground/30 backdrop-blur-sm rounded-full px-4 py-2">
            <ChevronLeft className="w-5 h-5" />
            <span>{t('activity.back')}</span>
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
                  alt={activity.coverImage?.[0]?.alternativeText || activity.title}
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
                    alt={`${activity.title} - ${i + 2}`}
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
                alt={activity.coverImage?.[0]?.alternativeText || activity.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent p-6 md:p-12 pointer-events-none">
            <div className="container mx-auto pointer-events-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Highlights badge removed as it's not in Strapi type directly */}
                <Badge variant="secondary" className="capitalize">{categoryName}</Badge>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-accent mb-4">{activity.title}</h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-accent/90">
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5" /> <span>{activity.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" /> <span>{groupSize}</span>
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
              alt={`${activity.title} - ${lightboxIndex + 1}`}
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
              {activity.overview && (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{t('activity.overview')}</h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {activity.overview}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {highlightsList.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{t('activity.highlights')}</h2>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {highlightsList.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3 bg-secondary/10 rounded-lg p-3">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Inclusions / Exclusions */}
              {((inclusionsList.length > 0) || (exclusionsList.length > 0)) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {inclusionsList.length > 0 && (
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{t('activity.included')}</h2>
                      <ul className="space-y-2">
                        {inclusionsList.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {exclusionsList.length > 0 && (
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{t('activity.notIncluded')}</h2>
                      <ul className="space-y-2">
                        {exclusionsList.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Timeline (Itinerary) */}
              {activity.itinerary && activity.itinerary.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">{t('activity.timeline')}</h2>
                  <div className="relative">
                    <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-6">
                      {activity.itinerary.map((item, index) => (
                        <div key={index} className="flex gap-4 relative">
                          <div className="w-14 flex-shrink-0 flex items-start justify-center pt-1">
                            <div className="w-4 h-4 rounded-full bg-primary border-4 border-background relative z-10" />
                          </div>
                          <div className="flex-1 bg-card rounded-lg p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-primary">{item.time}</span>
                            </div>
                            <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* YouTube Video */}
              {activity.youtubeLink && (() => {
                const ytMatch = activity.youtubeLink!.match(
                  /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
                );
                const videoId = ytMatch?.[1];
                if (!videoId) return null;
                return (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Youtube className="w-6 h-6 text-primary" />
                      {t('activity.videoPreview')}
                    </h2>
                    <div className="rounded-xl overflow-hidden border border-border/50 shadow-md aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={activity.title}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Map Section */}
              {mapEmbedUrl && (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Map className="w-6 h-6 text-primary" />
                    {t('activity.location') || "Location"}
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

              {/* FAQs */}
              {activity.faqs && activity.faqs.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{t('activity.faq')}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {activity.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left text-foreground hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl shadow-lg p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">{currency}{price}</span>
                    {!activity.isGroupPrice && <span className="text-muted-foreground">{t('tours.perPerson')}</span>}
                  </div>
                </div>
                <div className="space-y-3">
                  {activity.isBookable ? (
                    <Button
                      size="lg"
                      className="w-full h-14 text-lg"
                      onClick={() => setIsBookingOpen(true)}
                    >
                      <Calendar className="w-5 h-5 mr-2" /> {t('activity.checkAvailability')}
                    </Button>
                  ) : (
                    <EnquireFormDialog
                      itemName={activity.title}
                      type="activity"
                      trigger={
                        <Button
                          size="lg"
                          className="w-full h-14 text-lg"
                        >
                          <Calendar className="w-5 h-5 mr-2" /> {t('activity.enquireNow', { fallback: "Enquire Now" })}
                        </Button>
                      }
                    />
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">{t('activity.freeCancellation')}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <BookingPopup
        isOpen={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        activity={activity}
      />
    </div>
  );
}
