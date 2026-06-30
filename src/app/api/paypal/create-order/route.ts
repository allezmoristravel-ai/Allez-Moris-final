import { NextRequest, NextResponse } from "next/server";

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
        const { amount, currency = "EUR", description = "Activity Booking" } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const accessToken = await getAccessToken();

        const orderPayload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    description,
                    amount: {
                        currency_code: currency,
                        value: amount.toFixed(2),
                    },
                },
            ],
        };

        const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderPayload),
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                { error: `PayPal order creation failed: ${text}` },
                { status: 500 }
            );
        }

        const order = await res.json();
        return NextResponse.json({ id: order.id });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
