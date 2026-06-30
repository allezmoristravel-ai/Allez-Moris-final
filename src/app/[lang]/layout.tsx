import type { Metadata } from "next";
import Image from "next/image";
import { Montserrat, Open_Sans, Source_Code_Pro } from "next/font/google"; // Optimize fonts
import "../globals.css";
import Providers from "@/components/providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import I18nProvider from "@/components/i18n-provider";
import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";
import { getContactDetails } from "@/lib/api";
import Chatbot from "@/components/Chatbot";

const sans = Open_Sans({ subsets: ["latin"], variable: "--font-sans" });
const serif = Montserrat({ subsets: ["latin"], variable: "--font-serif" });
const mono = Source_Code_Pro({ subsets: ["latin"], variable: "--font-mono" });

export async function generateMetadata(props: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    return {
        title: {
            default: dict.metadata?.home?.title ?? "Allez Moris Travel",
            template: "%s | Allez Moris Travel",
        },
        description: dict.metadata?.home?.description ?? "Discover Mauritius your way",
        alternates: getAlternates(params.lang, ""),
    };
}

import { ENABLED_LOCALES } from "@/config/i18n.config";

export async function generateStaticParams() {
    return ENABLED_LOCALES.map((lang) => ({ lang }));
}

export default async function RootLayout(props: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const params = await props.params;
    const children = props.children;
    // 1. Load the translations for the requested language on the SERVER
    const dictionary = await getDictionary(params.lang);
    const contactDetails = await getContactDetails(params.lang);

    return (
        <html lang={params.lang}>
            <body className={`${sans.variable} ${serif.variable} ${mono.variable} antialiased`} style={{ backgroundColor: 'transparent' }}>
                <div className="fixed inset-0 -z-50 pointer-events-none">
                    <Image
                        src="/sand_background.webp"
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover hidden sm:block"
                        quality={100}
                        priority
                    />
                    <Image
                        src="/sand-background-phone.webp"
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover sm:hidden"
                        quality={100}
                        priority
                    />
                </div>
                {/* 2. Pass translations to Client Provider */}
                <I18nProvider locale={params.lang} resources={dictionary}>
                    <Providers>
                        {/* Header now needs to know the current Lang to build links properly */}
                        <Header lang={params.lang} contactDetails={contactDetails} />
                        <main className="min-h-screen pt-16 md:pt-20">
                            {children}
                        </main>
                        <Footer contactDetails={contactDetails} />
                    </Providers>
                    <Chatbot />
                </I18nProvider>
            </body>
        </html>
    );
}
