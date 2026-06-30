import { getAlternates } from "@/lib/seo";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return {
        title: "Terms and Conditions | Allez Moris Travel",
        description: "Terms and Conditions of Allez Moris Travel.",
        alternates: getAlternates(lang, "/terms-and-conditions"),
    };
}

export default async function TermsAndConditionsPage(props: { params: Promise<{ lang: string }> }) {
    const { lang } = await props.params;

    const policies = [
        {
            title: "Cancellation & Refund Policy",
            href: `/${lang}/cancellation-policy`,
            description: "Read about our cancellation timelines and refund eligibility.",
        },
        {
            title: "Booking & Payment Policy",
            href: `/${lang}/booking-and-payment-policy`,
            description: "Information regarding payment methods, secure processing, and booking confirmation.",
        },
        {
            title: "Delivery Terms of Suppliers",
            href: `/${lang}/delivery-terms-of-suppliers-policy`,
            description: "Learn about how our third-party suppliers deliver the tourism services.",
        },
        {
            title: "Privacy Policy",
            href: `/${lang}/privacy-policy`,
            description: "Details on how we collect, store, and protect your personal data.",
        },
        {
            title: "Additional Policies & Information",
            href: `/${lang}/additional-policies`,
            description: "Information concerning children, medical fitness, conduct, and other important aspects.",
        },
        {
            title: "Customer Complaint Resolution",
            href: `/${lang}/customer-complaint-resolution-policy`,
            description: "Our process for handling and resolving any issues you experience during your booked services.",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Terms and Conditions
            </h1>
            <p className="text-muted-foreground mb-10 text-lg">
                Please review our terms and conditions below. These policies outline the rules, guidelines, and expectations when booking and participating in our services.
            </p>
            <div className="grid gap-4 md:gap-6">
                {policies.map((policy) => (
                    <Link
                        key={policy.href}
                        href={policy.href}
                        className="group flex items-center justify-between bg-card border rounded-xl p-5 hover:border-primary hover:shadow-md transition-all"
                    >
                        <div>
                            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                {policy.title}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                {policy.description}
                            </p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors ml-4 shrink-0">
                            <ChevronRight className="w-5 h-5 text-primary" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
