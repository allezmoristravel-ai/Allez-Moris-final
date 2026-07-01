import { getContactDetails, getCategories, getTestimonials, getAccommodations, getHomePage } from "@/lib/api";
import HeroSection from "@/components/HeroSection";
import CategoryCarousel from "@/components/CategoryCarousel";
import TopToursCarousel from "@/components/TopToursCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import HotelSpecialsCarousel from "@/components/HotelSpecialsCarousel";
import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  return {
    title: dict.metadata?.home?.title,
    description: dict.metadata?.home?.description,
    alternates: getAlternates(params.lang, ""),
  };
}

export default async function Home(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  const contactDetails = await getContactDetails(params.lang);
  const homePage = await getHomePage(params.lang);

  // getCategories() only returns Strapi Activity categories (sea/land/air).
  // "rental" and "stay" are service pages, not Strapi categories, so they're
  // always appended rather than sourced from the CMS.
  const strapiCategories = await getCategories(params.lang);
  const categories = [
    ...(strapiCategories.length > 0
      ? strapiCategories
      : [
        { id: 1, documentId: "sea", slug: "sea", name: "Sea" },
        { id: 2, documentId: "land", slug: "land", name: "Land" },
        { id: 3, documentId: "air", slug: "air", name: "Air" },
      ]),
    { id: 4, documentId: "rental", slug: "rental", name: "Rental" },
    { id: 5, documentId: "stay", slug: "stay", name: "Stay" },
  ];

  const [testimonials, accommodations] = await Promise.all([
    getTestimonials(params.lang),
    getAccommodations(params.lang),
  ]);
  const accommodationDeals = accommodations.data.filter((a) => a.isDeal);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Allez Moris Travel',
    url: 'https://www.allezmoristravel.com',
    logo: 'https://www.allezmoristravel.com/allez-moris-logo-light-bg.png',
    description: dict.metadata?.home?.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: contactDetails?.address || 'Port Louis',
      addressCountry: 'MU'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contactDetails?.phoneNumber ? contactDetails.phoneNumber.replace(/\s+/g, '') : '+230-123-4567',
      contactType: 'customer service',
      email: contactDetails?.email || 'hello@allezmoris.com'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection images={homePage?.heroImages} />
      <CategoryCarousel
        categories={categories}
        title={homePage?.categorySectionTitle}
        subtitle={homePage?.categorySectionSubtitle}
      />
      <HotelSpecialsCarousel
        deals={accommodationDeals}
        title={homePage?.holidayPackagesTitle}
        subtitle={homePage?.holidayPackagesSubtitle}
      />
      <TopToursCarousel />
      <TestimonialsSection
        testimonials={testimonials}
        title={homePage?.testimonialsSectionTitle}
        subtitle={homePage?.testimonialsSectionSubtitle}
        ctaLabel={homePage?.testimonialsCtaLabel}
      />
    </>
  );
}