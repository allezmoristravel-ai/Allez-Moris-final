import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BACKEND_SECRET_TOKEN = process.env.NEXT_PUBLIC_BACKEND_SECRET_TOKEN;

export async function POST(request: Request) {
    if (!API_BASE_URL) {
        return NextResponse.json(
            { error: "Chat API Base URL is not configured." },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        if (BACKEND_SECRET_TOKEN) {
            headers["Authorization"] = `Bearer ${BACKEND_SECRET_TOKEN}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("[Proxy Chat] Error:", error);
        return NextResponse.json(
            { error: "Failed to proxy chat request" },
            { status: 500 }
        );
    }
}
