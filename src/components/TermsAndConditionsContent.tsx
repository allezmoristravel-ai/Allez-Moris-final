// Consolidated Terms & Conditions text shown in the booking form's scrollable
// terms box. Combines the fallback copy from the six standalone policy pages
// (cancellation, booking & payment, delivery terms of suppliers, privacy,
// additional policies, customer complaint resolution) into a single document.
// Keep this in sync with those pages if their content changes.
export default function TermsAndConditionsContent() {
    return (
        <div className="space-y-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
                <strong className="text-foreground">Allez (Moris) Travel Ltd</strong><br />
                Unit 1 Jaufeerally Complex<br />
                Mont Choisy, Mauritius<br />
                Email: roxanne@allezmoristravel.com<br />
                Tel: +230 5 721 8070
            </p>
            <p>
                By submitting a booking request, you agree to the following terms, which govern how bookings, payments,
                supplier services, and your personal data are handled by Allez (Moris) Travel Ltd.
            </p>

            {/* A. Cancellation & Refund Policy */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">A. Cancellation &amp; Refund Policy</h4>
                <p className="mb-2">
                    Allez (Moris) Travel Ltd works with multiple independent service providers. Cancellation terms may
                    vary depending on the activity, supplier, or special booking conditions. The exact policy will
                    always be confirmed at the time of booking.
                </p>
                <p className="font-medium text-foreground/90">A.1 Time-Sensitive Refunds</p>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                    <li>Cancellations made 48 hours or more before the scheduled activity may be eligible for a 50% cancellation fee, depending on the supplier&apos;s policy.</li>
                    <li>Cancellations made within 24 hours of the activity are generally non-refundable.</li>
                    <li>Bookings cancelled between 72–48 hours prior are eligible for a free cancellation, depending on the service provider.</li>
                </ul>
                <p className="font-medium text-foreground/90">A.2 No-Show &amp; Late Arrival Policy</p>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                    <li>If a client does not arrive at the agreed meeting point on time, the service may depart without them.</li>
                    <li>No-shows, missed departures, or late arrivals are non-refundable.</li>
                </ul>
                <p className="font-medium text-foreground/90">A.3 Non-Refundable Items</p>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                    <li>National park or attraction entrance tickets</li>
                    <li>Permits and government fees</li>
                    <li>Special event bookings</li>
                    <li>Custom or private arrangements made specifically for the client</li>
                </ul>
                <p className="font-medium text-foreground/90">A.4 Weather &amp; Operator Cancellations</p>
                <p className="mb-1">
                    If an activity is cancelled due to bad weather, unsafe sea/road conditions, technical or safety
                    issues, government restrictions, or force majeure, clients may be offered a rescheduled date or a
                    refund, subject to the supplier&apos;s policy. Allez (Moris) Travel Ltd is not liable for additional
                    costs such as flights, accommodation, or personal expenses related to such cancellations.
                </p>
                <p className="font-medium text-foreground/90">A.5 Method of Cancellation</p>
                <p className="mb-1">
                    Cancellations must be submitted in writing via email, or through the official communication channel
                    provided at the time of booking. The cancellation time is calculated based on when the written
                    request is received.
                </p>
                <p className="font-medium text-foreground/90">A.6 Refund Processing</p>
                <p>
                    Refunds are processed via the original payment method, may take several business days depending on
                    banks and payment providers, and may be subject to transaction or bank processing fees.
                </p>
            </div>

            {/* B. Booking & Payment Policy */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">B. Booking &amp; Payment Policy</h4>
                <p className="mb-1">
                    All bookings are subject to availability and confirmation. Once payment has been successfully
                    processed, you will receive a booking confirmation email with the booking reference, activity
                    details, date/time, and meeting point information.
                </p>
                <p className="mb-1">
                    Payment terms may vary by activity or supplier; in most cases full payment is required at the time
                    of booking to confirm the reservation. Payments are accepted through secure online payment gateways;
                    Allez (Moris) Travel Ltd does not store customer credit card information.
                </p>
                <p className="mb-1">
                    By completing a booking, you confirm you are the authorised cardholder (or have permission to use
                    the selected payment method) and authorise Allez (Moris) Travel Ltd to charge the total booking
                    amount accordingly.
                </p>
                <p>
                    Booking modification requests must be submitted in writing via email and are subject to availability
                    and supplier approval. This Booking &amp; Payment Policy is governed by the laws of the Republic of
                    Mauritius.
                </p>
            </div>

            {/* C. Delivery Terms of Suppliers */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">C. Delivery Terms of Suppliers</h4>
                <p className="mb-1">
                    Allez (Moris) Travel Ltd operates as a tour operator and booking coordinator. Activities and services
                    are delivered either directly by the company or by approved third-party suppliers (excursion
                    operators, transport providers, guides, marine operators), who are responsible for the operational
                    delivery of the service, safety procedures, and regulatory compliance.
                </p>
                <p className="mb-1">
                    Operational details such as departure times, routes, vessels, vehicles, or guides may occasionally
                    change due to operational requirements, weather, safety considerations, or supplier logistics.
                </p>
                <p>
                    If a supplier is unable to deliver a booked activity, you may be offered an alternative activity,
                    rescheduling, or a refund subject to the supplier&apos;s cancellation policy. This policy is governed
                    by the laws of the Republic of Mauritius.
                </p>
            </div>

            {/* D. Privacy Policy */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">D. Privacy Policy</h4>
                <p className="mb-1">
                    We collect information you provide (name, email, phone/WhatsApp, nationality, travel dates, party
                    size, special requests, and payment details processed via secure third-party providers) to process
                    bookings, communicate booking details, coordinate with third-party service providers, and provide
                    customer support. We do not sell your personal data.
                </p>
                <p className="mb-1">
                    To deliver your booked services, we may share necessary information with activity operators,
                    transport providers, accommodation partners, guides, and payment processors — only what is required
                    to perform the booked services.
                </p>
                <p>
                    We take reasonable technical and organisational measures to protect your data. You may request
                    access to, correction of, or deletion of your personal data where legally permitted.
                </p>
            </div>

            {/* E. Additional Policies & Information */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">E. Additional Policies &amp; Information</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Details such as prices, itineraries, availability, and timings may change without notice; images are illustrative.</li>
                    <li>Clients must be physically and medically fit to participate in booked activities; those with medical conditions should consult a doctor before booking.</li>
                    <li>Children must be supervised by a responsible adult at all times; some activities may have age or height restrictions.</li>
                    <li>Disruptive, unsafe, or intoxicated behaviour may result in refusal of service without refund if safety is compromised.</li>
                    <li>Photos or videos may be taken during activities for promotional use; clients who prefer not to appear should inform us in advance.</li>
                    <li>Clients are responsible for having valid passports, visas, and required travel documents.</li>
                </ul>
            </div>

            {/* F. Customer Complaint Resolution */}
            <div>
                <h4 className="font-semibold text-foreground mb-1.5">F. Customer Complaint Resolution</h4>
                <p className="mb-1">
                    If you are dissatisfied with any aspect of your booking or service, please contact us at
                    roxanne@allezmoristravel.com or +230 5 721 8070 with your name, booking reference, and a description
                    of the issue. We will acknowledge, review, and respond with a proposed resolution within a reasonable
                    timeframe.
                </p>
                <p>
                    We encourage you to contact us directly to resolve any concerns before initiating a payment dispute
                    with your bank. This policy, and any disputes arising from these terms, is governed by the laws of
                    the Republic of Mauritius.
                </p>
            </div>
        </div>
    );
}
