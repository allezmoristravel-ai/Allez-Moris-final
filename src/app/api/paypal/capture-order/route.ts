import { NextRequest, NextResponse } from "next/server";
import { createBokunBooking } from "@/lib/bokun";
import { Resend } from "resend";

const PAYPAL_API_BASE =
    process.env.PAYPAL_ENV === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("PayPal credentials are not configured.");
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to get PayPal access token: ${text}`);
    }

    const data = await res.json();
    return data.access_token as string;
}

export async function POST(req: NextRequest) {
    try {
        const { orderID, bookingDetails } = await req.json();

        if (!orderID) {
            return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
        }

        const accessToken = await getAccessToken();

        const res = await fetch(
            `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                { error: `PayPal capture failed: ${text}` },
                { status: 500 }
            );
        }

        const captureData = await res.json();

        let bokunResult = null;
        let bokunError = null;

        if (captureData.status === "COMPLETED") {
            // Send success notification to admin for every successful payment
            try {
                if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
                    const resend = new Resend(process.env.RESEND_API_KEY);
                    await resend.emails.send({
                        from: "Allez Moris <onboarding@resend.dev>",
                        to: [process.env.ADMIN_EMAIL],
                        subject: "New Successful Payment Received",
                        html: `
                            <h1>New Payment Successfully Processed!</h1>
                            <p>You have received a new payment on the site.</p>
                            <h2>Booking Details:</h2>
                            <ul>
                                <li><strong>Order ID:</strong> ${orderID}</li>
                                <li><strong>Activity:</strong> ${bookingDetails?.title || "N/A"}</li>
                                <li><strong>Name:</strong> ${bookingDetails?.firstName || ""} ${bookingDetails?.lastName || ""}</li>
                                <li><strong>Email:</strong> ${bookingDetails?.email || "N/A"}</li>
                                <li><strong>Phone:</strong> ${bookingDetails?.phone || "N/A"}</li>
                                <li><strong>Date:</strong> ${bookingDetails?.date ? new Date(bookingDetails.date).toLocaleDateString() : "N/A"}</li>
                                <li><strong>Adults:</strong> ${bookingDetails?.adults || 0}</li>
                                <li><strong>Children:</strong> ${bookingDetails?.children || 0}</li>
                            </ul>
                        `
                    });
                }
            } catch (emailErr) {
                console.error("Failed to send payment success admin email:", emailErr);
            }

            if (bookingDetails && bookingDetails.bokunId) {
                try {
                    bokunResult = await createBokunBooking({
                        ...bookingDetails,
                        reference: orderID
                    });
                    console.log("Bokun booking successful:", bokunResult);
                } catch (err) {
                    console.error("Failed to create Bokun booking:", err);
                    bokunError = err instanceof Error ? err.message : "Bokun booking failed";

                    // Send automated error notification
                    try {
                        if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
                            const resend = new Resend(process.env.RESEND_API_KEY);
                            await resend.emails.send({
                                from: "Allez Moris <onboarding@resend.dev>",
                                to: [process.env.ADMIN_EMAIL],
                                subject: "URGENT: Bokun Integration Failure",
                                html: `
                                    <h1>Bokun Booking Failed</h1>
                                    <p>A user successfully submitted a payment via PayPal, but the booking failed to push to Bokun.</p>
                                    <h2>Payment Details:</h2>
                                    <ul>
                                        <li>Order ID: ${orderID}</li>
                                        <li>Activity Name: ${bookingDetails.title || "N/A"}</li>
                                        <li>Bokun Experience ID: ${bookingDetails.bokunId}</li>
                                    </ul>
                                    <h2>Error details:</h2>
                                    <p style="color: red;">${bokunError}</p>
                                    <p>Please manually create the booking in Bokun for the customer to prevent any issues.</p>
                                `
                            });
                        }
                    } catch (emailErr) {
                        console.error("Failed to send Bokun error email:", emailErr);
                    }
                }
            }
        }

        return NextResponse.json({ ...captureData, bokunResult, bokunError });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
