import { getActivities } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    try {
        // Log for debugging visibility
        console.log(`[Proxy] Fetching top tours for locale: ${locale}`);

        const response = await getActivities(locale, 1, 10);

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("[Proxy] Error fetching top tours:", error);
        return NextResponse.json([]);
    }
}
