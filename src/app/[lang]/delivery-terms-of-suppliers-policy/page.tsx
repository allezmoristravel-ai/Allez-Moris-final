import { getAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return {
        title: "Delivery Terms of Suppliers | Allez Moris Travel",
        description: "Delivery Terms of Suppliers Policy of Allez Moris Travel.",
        alternates: getAlternates(lang, "/delivery-terms-of-suppliers-policy"),
    };
}

export default async function DeliveryTermsSuppliersPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                Delivery Terms of Suppliers Policy
            </h1>
            <div className="bg-card border rounded-xl p-6 md:p-10 shadow-sm text-foreground space-y-6">
                <p>
                    <strong>Allez (Moris) Travel Ltd</strong><br />
                    Unit 1 Jaufeerally Complex<br />
                    Mont Choisy, Mauritius<br />
                    Email: roxanne@allezmoristravel.com<br />
                    Tel: +230 5 721 8070
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Role of Allez (Moris) Travel Ltd</h2>
                <p>Allez (Moris) Travel Ltd operates as a tour operator and booking coordinator. The company arranges tourism services and experiences delivered by independent third party suppliers operating in Mauritius, including excursion operators, transport providers, activity guides, and marine operators.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">2. Supplier Service Delivery</h2>
                <p>All activities and services booked through Allez (Moris) Travel Ltd are delivered either directly by the company or by approved third-party suppliers. These suppliers are responsible for the operational delivery of the service, including activity management, equipment provision, safety procedures, and compliance with applicable tourism regulations.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">3. Supplier Licensing and Compliance</h2>
                <p>Where required by Mauritian law, suppliers must hold the appropriate licences and permits issued by relevant authorities such as the Tourism Authority or other regulatory bodies. Allez (Moris) Travel Ltd works with reputable and reliable suppliers to ensure that tourism services are delivered safely and professionally.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">4. Booking Confirmation and Supplier Coordination</h2>
                <p>Once a booking has been confirmed and payment successfully processed, Allez (Moris) Travel Ltd will coordinate with the relevant supplier to ensure the activity is delivered at the scheduled date and time. Customers will receive booking confirmation details including meeting point information, activity details, and instructions necessary to participate in the booked experience.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">5. Supplier Operational Changes</h2>
                <p>Operational details such as departure times, routes, vessels, vehicles, or guides may occasionally change due to operational requirements, weather conditions, safety considerations, or supplier logistics. In such circumstances the supplier will make reasonable efforts to deliver the activity as described or provide a suitable alternative where possible.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">6. Service Delivery Issues</h2>
                <p>If a supplier is unable to deliver a booked activity due to weather conditions, safety concerns, technical issues, or other operational circumstances, customers may be offered:</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>an alternative activity</li>
                    <li>rescheduling to another date</li>
                    <li>a refund subject to the supplier&apos;s cancellation policy</li>
                </ul>
                <p>Allez (Moris) Travel Ltd will assist in coordinating solutions between customers and suppliers.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">7. Governing Law</h2>
                <p>This Delivery Terms of Suppliers Policy shall be governed by the laws of the Republic of Mauritius. Any disputes relating to supplier service delivery shall be subject to the jurisdiction of Mauritian courts.</p>
            </div>
        </div>
    );
}
