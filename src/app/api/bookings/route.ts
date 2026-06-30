import { NextRequest, NextResponse } from "next/server";

function getStrapiBaseUrl() {
    let url = process.env.NEXT_PUBLIC_STRAPI_URL || "https://phenomenal-growth-682e298e29.strapiapp.com";
    if (!url.startsWith("http")) url = `https://${url}`;
    if (url.endsWith("/")) url = url.slice(0, -1);
    return url;
}

const STRAPI_URL = getStrapiBaseUrl();
const READ_TOKEN = process.env.STRAPI_TOKEN;
const WRITE_TOKEN = process.env.STRAPI_TOKEN;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findOrCreateClient(clientData: Record<string, any>) {
    if (!READ_TOKEN) throw new Error("Missing STRAPI_TOKEN");

    // 1. Search for existing client by email
    const searchRes = await fetch(
        `${STRAPI_URL}/api/clients?filters[email][$eq]=${encodeURIComponent(clientData.email)}`,
        { headers: { Authorization: `Bearer ${READ_TOKEN}` } }
    );
    const searchJson = await searchRes.json();

    if (searchJson.data && searchJson.data.length > 0) {
        return searchJson.data[0].documentId;
    }

    if (!WRITE_TOKEN) throw new Error("Missing STRAPI_TOKEN");

    // 2. Create new client
    const createRes = await fetch(`${STRAPI_URL}/api/clients`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${WRITE_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: clientData }),
    });
    const createJson = await createRes.json();
    if (!createJson.data) {
        throw new Error(`Failed to create client: ${JSON.stringify(createJson)}`);
    }
    return createJson.data.documentId;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { client, booking } = body;

        if (!client || !booking) {
            return NextResponse.json({ error: "Missing client or booking data" }, { status: 400 });
        }

        // 1. Find or create client
        const clientDocumentId = await findOrCreateClient(client);

        // 2. Create booking
        if (!WRITE_TOKEN) throw new Error("Missing STRAPI_TOKEN");

        const createBookingRes = await fetch(`${STRAPI_URL}/api/bookings`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${WRITE_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: {
                    ...booking,
                    client: clientDocumentId,
                },
            }),
        });

        const bookingJson = await createBookingRes.json();
        if (!bookingJson.data) {
            throw new Error(`Failed to create booking: ${JSON.stringify(bookingJson)}`);
        }

        return NextResponse.json({ bookingDocumentId: bookingJson.data.documentId });
    } catch (err) {
        console.error("Error creating booking:", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { bookingDocumentId, updateData } = body;

        if (!bookingDocumentId || !updateData) {
            return NextResponse.json({ error: "Missing bookingDocumentId or updateData" }, { status: 400 });
        }

        if (!WRITE_TOKEN) throw new Error("Missing STRAPI_TOKEN");

        const updateRes = await fetch(`${STRAPI_URL}/api/bookings/${bookingDocumentId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${WRITE_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: updateData }),
        });

        const updateJson = await updateRes.json();
        if (!updateJson.data) {
            throw new Error(`Failed to update booking: ${JSON.stringify(updateJson)}`);
        }

        return NextResponse.json({ success: true, booking: updateJson.data });
    } catch (err) {
        console.error("Error updating booking:", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
