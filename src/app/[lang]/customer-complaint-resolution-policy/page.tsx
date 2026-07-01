import { getAlternates } from "@/lib/seo";
import { getLegalPageBySlug } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return {
        title: "Customer Complaint Resolution | Allez Moris Travel",
        description: "Customer Complaint Resolution Policy of Allez Moris Travel.",
        alternates: getAlternates(lang, "/customer-complaint-resolution-policy"),
    };
}

export default async function CustomerComplaintResolutionPage(props: { params: Promise<{ lang: string }> }) {
    const { lang } = await props.params;
    const cms = await getLegalPageBySlug("customer-complaint-resolution-policy", lang);

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                {cms?.title || "Customer Complaint Resolution Policy"}
            </h1>
            {cms?.body ? (
                <div className="bg-card border rounded-xl p-6 md:p-10 shadow-sm text-foreground space-y-6 whitespace-pre-line">
                    {cms.body}
                </div>
            ) : (
            <div className="bg-card border rounded-xl p-6 md:p-10 shadow-sm text-foreground space-y-6">
                <p>
                    <strong>Allez (Moris) Travel Ltd</strong><br />
                    Unit 1 Jaufeerally Complex<br />
                    Mont Choisy, Mauritius<br />
                    Email: roxanne@allezmoristravel.com<br />
                    Tel: +230 5 721 8070
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Commitment to Customer Satisfaction</h2>
                <p>Allez (Moris) Travel Ltd is committed to providing high-quality tourism services and ensuring a positive experience for all customers. If a customer is dissatisfied with any aspect of their booking or service, they are encouraged to contact us directly so that the issue can be investigated and resolved promptly.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">2. How to Submit a Complaint</h2>
                <p>Customers may submit complaints through the following channels:</p>
                <ul className="list-none space-y-1">
                    <li>Email: roxanne@allezmoristravel.com</li>
                    <li>Telephone: +230 5 721 8070</li>
                </ul>
                <p>Complaints should include the customer name, booking reference number, description of the issue, and any supporting information where available.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">3. Complaint Review Process</h2>
                <p>Once a complaint is received, Allez (Moris) Travel Ltd will acknowledge the complaint within a reasonable timeframe, review the booking details, communicate with the relevant supplier if applicable, and provide a response or proposed resolution.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">4. Resolution Options</h2>
                <p>Depending on the circumstances of the complaint, resolutions may include clarification of booking terms, partial refunds where appropriate, rescheduling of activities, or coordination with the supplier to address the issue.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">5. Chargeback Prevention</h2>
                <p>Customers are encouraged to contact Allez (Moris) Travel Ltd directly to resolve any concerns before initiating a payment dispute with their bank. Most issues can be resolved quickly through direct communication.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">6. Record Keeping</h2>
                <p>Allez (Moris) Travel Ltd maintains records of customer complaints and their resolutions to support transparency, service improvement, and proper dispute handling.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">7. Governing Law</h2>
                <p>This Customer Complaint Resolution Policy shall be governed by the laws of the Republic of Mauritius, and any disputes shall be subject to the jurisdiction of Mauritian courts.</p>
            </div>
            )}
        </div>
    );
}
