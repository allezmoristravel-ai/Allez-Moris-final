import SubscriptionForm from "@/components/SubscriptionForm";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { getAlternates } from "@/lib/seo";

export async function generateMetadata(props: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const dict = await getDictionary(params.lang);
    return {
        title: dict.metadata?.subscribe?.title,
        description: dict.metadata?.subscribe?.description,
        alternates: getAlternates(params.lang, "/subscribe"),
    };
}

export default function SubscribePage() {
    return (
        <main>
            <SubscriptionForm />
        </main>
    );
}
