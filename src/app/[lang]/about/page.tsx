import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Compass, Map, Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";
import { getAboutPage } from "@/lib/api";

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  return {
    title: dict.metadata?.about?.title,
    description: dict.metadata?.about?.description,
    alternates: getAlternates(params.lang, "/about"),
  };
}

export default async function AboutPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  const cms = await getAboutPage(params.lang);

  const about = {
    hero: {
      title: cms?.heroTitle || dict.aboutUs?.hero?.title,
      subtitle: cms?.heroSubtitle || dict.aboutUs?.hero?.subtitle,
    },
    ourName: {
      p1: dict.aboutUs?.ourName?.p1,
      p2: cms?.ourNameP2 || dict.aboutUs?.ourName?.p2,
    },
    whoWeAre: {
      title: cms?.whoWeAreTitle || dict.aboutUs?.whoWeAre?.title,
      p1: cms?.whoWeAreP1 || dict.aboutUs?.whoWeAre?.p1,
      p2: cms?.whoWeAreP2 || dict.aboutUs?.whoWeAre?.p2,
    },
    whatWeDo: {
      title: cms?.whatWeDoTitle || dict.aboutUs?.whatWeDo?.title,
      subtitle: cms?.whatWeDoSubtitle || dict.aboutUs?.whatWeDo?.subtitle,
      items: cms?.whatWeDoItems?.length ? cms.whatWeDoItems : dict.aboutUs?.whatWeDo?.items,
    },
    ourApproach: {
      title: cms?.ourApproachTitle || dict.aboutUs?.ourApproach?.title,
      subtitle: cms?.ourApproachSubtitle || dict.aboutUs?.ourApproach?.subtitle,
      items: cms?.ourApproachItems?.length ? cms.ourApproachItems : dict.aboutUs?.ourApproach?.items,
    },
    whyChooseUs: {
      title: cms?.whyChooseUsTitle || dict.aboutUs?.whyChooseUs?.title,
      subtitle: cms?.whyChooseUsSubtitle || dict.aboutUs?.whyChooseUs?.subtitle,
      p1: cms?.whyChooseUsP1 || dict.aboutUs?.whyChooseUs?.p1,
      p2: cms?.whyChooseUsP2 || dict.aboutUs?.whyChooseUs?.p2,
    },
    outro: {
      title: cms?.outroTitle || dict.aboutUs?.outro?.title,
      subtitle: cms?.outroSubtitle || dict.aboutUs?.outro?.subtitle,
      footer: cms?.outroFooter || dict.aboutUs?.outro?.footer,
    },
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-mauritius.jpg"
            alt="Mauritius Background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center mt-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-md">
              {about?.hero?.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed drop-shadow">
              {about?.hero?.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Our Name Section (Stylized Quote Block) */}
      <section className="py-20 md:py-32 bg-background relative -mt-8 rounded-t-[3rem] z-20 shadow-[-10px_-10px_30px_rgba(0,0,0,0.05)] border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              {about?.ourName?.p1.split('<1>')[0]}<span className="text-primary">{about?.ourName?.p1.split('<1>')[1].split('</1>')[0]}</span>{about?.ourName?.p1.split('</1>')[1]}
            </h2>
            <div className="w-24 h-1 bg-primary/30 mx-auto rounded-full" />
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-serif italic">
              &ldquo;{about?.ourName?.p2}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are & What We Do Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">

            {/* Who We Are Card */}
            <div className="bg-card p-10 md:p-14 rounded-3xl shadow-xl border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <Compass className="w-32 h-32" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8 relative z-10">{about?.whoWeAre?.title}</h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed relative z-10">
                <p>{about?.whoWeAre?.p1}</p>
                <p>{about?.whoWeAre?.p2}</p>
              </div>
            </div>

            {/* What We Do List */}
            <div className="lg:pl-8 flex flex-col justify-center h-full">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">{about?.whatWeDo?.title}</h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                {about?.whatWeDo?.subtitle}
              </p>
              <ul className="space-y-6">
                {about?.whatWeDo?.items?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-card hover:shadow-md transition-all border border-transparent hover:border-border/50">
                    <div className="bg-primary/10 p-2 rounded-full shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-foreground text-lg font-medium pt-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Our Approach (Icon Grid) */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-6">{about?.ourApproach?.title}</h2>
            <p className="text-xl text-muted-foreground">
              {about?.ourApproach?.subtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {about?.ourApproach?.items?.map((item: string, index: number) => {
              const icons = [Map, Heart, Star]; // Dynamic array of elegant icons
              const Icon = icons[index % icons.length];
              return (
                <div key={index} className="bg-card p-10 rounded-2xl shadow-lg border border-border/40 hover:-translate-y-2 transition-transform duration-300 group flex flex-col items-center text-center">
                  <div className="bg-primary/5 p-4 rounded-full mb-6 group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-serif text-xl font-medium text-foreground">{item}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us & Outro */}
      <section className="py-24 bg-card border-y border-border/50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge variant="outline" className="mb-6 px-4 py-1 text-sm bg-background">
            {about?.whyChooseUs?.title}
          </Badge>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
            {about?.whyChooseUs?.subtitle}
          </h2>

          <div className="space-y-6 text-muted-foreground text-lg md:text-xl leading-relaxed mb-16 px-4 md:px-12">
            <p>{about?.whyChooseUs?.p1}</p>
            <p>{about?.whyChooseUs?.p2}</p>
          </div>

          {/* Outro CTA Block */}
          <div className="bg-primary/5 px-8 py-12 md:p-16 rounded-3xl border border-primary/20 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 bg-primary/10 w-64 h-64 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 bg-primary/10 w-64 h-64 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                {about?.outro?.title}
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {about?.outro?.subtitle}
              </p>
              <div className="inline-block bg-background px-8 py-4 rounded-full shadow-sm border border-border text-lg font-bold text-primary">
                {about?.outro?.footer}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
