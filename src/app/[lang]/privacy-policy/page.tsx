import { getAlternates } from "@/lib/seo";
import { getLegalPageBySlug } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return {
        title: "Privacy Policy | Allez Moris Travel",
        description: "Privacy Policy of Allez Moris Travel.",
        alternates: getAlternates(lang, "/privacy-policy"),
    };
}

export default async function PrivacyPolicyPage(props: { params: Promise<{ lang: string }> }) {
    const { lang } = await props.params;
    const cms = await getLegalPageBySlug("privacy-policy", lang);

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                {cms?.title || "Privacy Policy"}
            </h1>
            {cms?.body ? (
                <div className="bg-card border rounded-xl p-6 md:p-10 shadow-sm text-foreground space-y-6 whitespace-pre-line">
                    {cms.body}
                </div>
            ) : (
            <div className="bg-card border rounded-xl p-6 md:p-10 shadow-sm text-foreground space-y-6">
                <p><strong>Effective Date:</strong> 12 January 2026</p>
                <p>At Allez (Moris) Travel Ltd, your privacy matters to us. This policy explains how we collect, use, store, and protect personal information when you use our website or book services with us.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">1. Who We Are</h2>
                <p>Allez (Moris) Travel Ltd is an online tour operator based in Mauritius, providing tours, activities, transfers, and travel-related services.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold mt-6 mb-2">2.1 Information you provide</h3>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Phone/WhatsApp number</li>
                    <li>Nationality</li>
                    <li>Travel dates and booking details</li>
                    <li>Number of participants</li>
                    <li>Special requests or relevant medical information (where necessary for safety)</li>
                    <li>Payment details (processed via secure third-party providers)</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-2">2.2 Automatically collected information</h3>
                <p>When you visit our website, we may collect information such as IP address, device type, browser type, pages visited, and time spent on the website to improve performance and user experience.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Process bookings and reservations</li>
                    <li>Communicate booking details, updates, confirmations, and invoices</li>
                    <li>Coordinate with third-party service providers to deliver your services</li>
                    <li>Provide customer support</li>
                    <li>Improve our website and services</li>
                </ul>
                <p>We do not sell your personal data.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">4. Sharing of Information</h2>
                <p>To deliver your booked services, we may share necessary information with activity operators, transport providers, hotels/accommodation partners, guides/instructors, and payment processing providers. We only share information required to perform the booked services.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">5. Payment Security</h2>
                <p>Payments are processed through secure, third-party payment platforms. Allez (Moris) Travel Ltd does not store full credit card details.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">6. Data Storage & Protection</h2>
                <p>We take reasonable technical and organisational measures to protect personal data from unauthorised access, loss, or misuse. However, no internet transmission is completely secure.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">7. Cookies</h2>
                <p>Our website may use cookies to improve user experience, track website performance, and understand visitor behaviour. You can disable cookies in your browser settings.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">8. Your Rights</h2>
                <p>You have the right to request access to your personal data, request correction of inaccurate information, and request deletion of your data where legally permitted.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">9. Data Retention</h2>
                <p>We retain booking and transaction records as required for legal, accounting, and operational purposes.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">10. Third-Party Websites</h2>
                <p>Our website may contain links to third-party websites. We are not responsible for their privacy practices.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">11. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. The latest version will always be available on our website.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">12. Contact Us</h2>
                <p>
                    Allez (Moris) Travel Ltd<br />
                    Email: info@allezmoristravel.com<br />
                    Phone/WhatsApp: +230 5721 8070<br />
                    Website: www.allezmoristravel.com
                </p>
            </div>
            )}
        </div>
    );
}
