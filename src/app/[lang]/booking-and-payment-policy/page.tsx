import { getAlternates } from "@/lib/seo";
import { getLegalPageBySlug } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return {
        title: "Booking & Payment Policy | Allez Moris Travel",
        description: "Booking and Payment Policy of Allez Moris Travel.",
        alternates: getAlternates(lang, "/booking-and-payment-policy"),
    };
}

export default async function BookingPaymentPolicyPage(props: { params: Promise<{ lang: string }> }) {
    const { lang } = await props.params;
    const cms = await getLegalPageBySlug("booking-and-payment-policy", lang);

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                {cms?.title || "Booking & Payment Policy"}
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

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Booking Confirmation</h2>
                <p>All bookings made through the Allez (Moris) Travel Ltd website, authorised booking partners, or direct communication channels are subject to availability and confirmation. Once payment has been successfully processed, customers will receive a booking confirmation email containing the booking reference number, activity details, date and time of the activity, meeting point information, and contact details for assistance. Customers are responsible for reviewing the booking confirmation and notifying Allez (Moris) Travel Ltd of any errors as soon as possible.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">2. Payment Requirements</h2>
                <p>Payment terms may vary depending on the activity, supplier, or special booking conditions. In most cases full payment is required at the time of booking in order to confirm the reservation. Certain private or customised experiences may require advance deposits or staged payments depending on the supplier.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">3. Payment Methods</h2>
                <p>Allez (Moris) Travel Ltd accepts payments through secure online payment gateways and authorised payment processors. Accepted payment methods may include credit cards, debit cards, or other electronic payment methods available at checkout. Allez (Moris) Travel Ltd does not store customer credit card information.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">4. Payment Authorisation</h2>
                <p>By completing a booking, the customer confirms that they are the authorised cardholder or have permission from the authorised cardholder to use the selected payment method. Customers authorise Allez (Moris) Travel Ltd to charge the total booking amount to the selected payment method. Completion of the booking process and receipt of a booking confirmation constitutes valid authorisation of the transaction.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">5. Secure Payment Processing</h2>
                <p>All payments made through the website are processed through secure encrypted payment gateways using industry standard security protocols. For security purposes, payment transactions may be subject to verification checks and suspicious transactions may be temporarily held or declined.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">6. Pricing & Currency</h2>
                <p>Prices displayed on the website may vary depending on seasonal demand, supplier pricing adjustments, promotions, or customised arrangements. Once a booking has been confirmed and payment has been processed, the price paid is considered final for that reservation.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">7. Booking Modifications</h2>
                <p>Requests to modify bookings must be submitted in writing via email and are subject to availability and supplier approval. Certain activities may not allow modifications once the booking has been confirmed.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">8. Failed or Declined Payments</h2>
                <p>If a payment transaction is declined or fails to process, the booking will not be confirmed. Customers may attempt payment again using a valid payment method.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">9. Fraud Prevention</h2>
                <p>All payments are processed through PCI-compliant payment systems and may require additional verification such as 3D Secure authentication. Allez (Moris) Travel Ltd reserves the right to cancel bookings or request further verification where fraudulent activity is suspected.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">10. Payment Disputes & Chargebacks</h2>
                <p>Customers who believe a transaction has been processed incorrectly are encouraged to contact Allez (Moris) Travel Ltd directly before initiating a payment dispute with their bank. The company will investigate disputes and attempt to resolve payment issues promptly.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">11. Taxes & Fees</h2>
                <p>Where applicable, prices displayed may include local taxes or government charges. Certain activities may require additional fees payable locally such as national park fees, permits, or entrance tickets.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">12. Governing Law</h2>
                <p>This Booking & Payment Policy is governed by the laws of the Republic of Mauritius and any disputes shall be subject to the jurisdiction of Mauritian courts.</p>
            </div>
            )}
        </div>
    );
}
