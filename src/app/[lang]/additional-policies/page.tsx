import { getAlternates } from "@/lib/seo";
import { getLegalPageBySlug } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return {
        title: "Additional Policies | Allez Moris Travel",
        description: "Additional Policies and Information of Allez Moris Travel.",
        alternates: getAlternates(lang, "/additional-policies"),
    };
}

export default async function AdditionalPoliciesPage(props: { params: Promise<{ lang: string }> }) {
    const { lang } = await props.params;
    const cms = await getLegalPageBySlug("additional-policies", lang);

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                {cms?.title || "Additional Policies & Information"}
            </h1>
            {cms?.body ? (
                <div className="bg-card border rounded-xl p-6 md:p-10 shadow-sm text-foreground space-y-6 whitespace-pre-line">
                    {cms.body}
                </div>
            ) : (
            <div className="bg-card border rounded-xl p-6 md:p-10 shadow-sm text-foreground space-y-6">

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Website Disclaimer</h2>
                <p>Information on our website is provided for general guidance only. Details such as prices, itineraries, availability, timings, and activity conditions may change without notice. Images are for illustrative purposes and actual experiences may vary.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">2. Medical & Fitness Disclaimer</h2>
                <p>Clients must ensure they are physically and medically fit to participate in booked activities. Pregnant travellers and individuals with medical conditions should consult a doctor before booking. Some activities may not be suitable for people with heart conditions, mobility limitations, or other health concerns.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">3. Children Policy</h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Children must be supervised by a responsible adult at all times.</li>
                    <li>Certain activities may have age or height restrictions.</li>
                    <li>Parents/guardians are responsible for child safety during tours and transfers.</li>
                </ul>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">4. Code of Conduct</h2>
                <p>We expect respectful and responsible behaviour from all clients. Disruptive, unsafe, or intoxicated behaviour may result in refusal of service without refund if safety is compromised.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">5. Responsible Tourism & Sustainability</h2>
                <p>Allez (Moris) Travel Ltd supports responsible tourism practices, including respect for local communities, environmental protection, and working with local suppliers.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">6. Photography & Media Consent</h2>
                <p>Photos or videos may be taken during activities for promotional use. Clients who prefer not to appear in media content should inform us in advance.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">7. Complaints Procedure</h2>
                <p>Any issues should be raised during the activity when possible. Formal complaints should be submitted in writing within a reasonable timeframe. We aim to respond promptly and fairly.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">8. Travel Documents Responsibility</h2>
                <p>Clients are responsible for having valid passports, visas, and required travel documents. Allez (Moris) Travel Ltd is not liable for denied boarding or entry due to missing documentation.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">9. Pricing Accuracy</h2>
                <p>While we strive for accuracy, prices shown on our website may be corrected in case of technical or human error before booking confirmation.</p>
            </div>
            )}
        </div>
    );
}
