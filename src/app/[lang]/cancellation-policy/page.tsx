import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";
import CancellationPolicy from "@/components/CancellationPolicy";

// Note: params.lang is needed for the layout to know the language
export async function generateMetadata({ params }: { params: { lang: string } }) {
    await getDictionary(params.lang);
    return {
        title: "Cancellation & Refund Policy | Allez Moris Travel",
        description: "Our cancellation and refund policies for activities, tours, and services.",
        alternates: getAlternates(params.lang, "/cancellation-policy"),
    };
}

export default async function CancellationPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                Cancellation & Refund Policy
            </h1>
            <div className="bg-card border rounded-xl p-6 md:p-10 shadow-sm">
                <CancellationPolicy variant="full" />
            </div>
        </div>
    );
}
