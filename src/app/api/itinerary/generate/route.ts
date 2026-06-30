
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const BACKEND_SECRET_TOKEN = process.env.NEXT_PUBLIC_BACKEND_SECRET_TOKEN;

    if (!API_BASE_URL) {
        return NextResponse.json({ error: 'API_BASE_URL not configured' }, { status: 500 });
    }

    try {
        const body = await req.json();

        const response = await fetch(`${API_BASE_URL}/api/itinerary/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(BACKEND_SECRET_TOKEN ? { 'Authorization': `Bearer ${BACKEND_SECRET_TOKEN}` } : {})
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in itinerary proxy:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
