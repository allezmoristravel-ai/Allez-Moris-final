// src/lib/itineraryApi.ts

import { z } from "zod";
import { differenceInCalendarDays, format } from "date-fns";


const BACKEND_SECRET_TOKEN = process.env.NEXT_PUBLIC_BACKEND_SECRET_TOKEN;

if (process.env.NODE_ENV !== 'production') {
    if (!BACKEND_SECRET_TOKEN) {
        console.warn("⚠️ [API Config]: NEXT_PUBLIC_BACKEND_SECRET_TOKEN is missing from env variable");
    }
}

// Define the Zod schema for the form (re-exported for use in page.tsx)
export const formSchema = z.object({
    user_context: z.object({
        name: z.string().min(1, { message: "Name is required." }),
        travel_style: z.enum(["adventure", "relaxation", "cultural", "family", "romantic", "luxury", "budget", "balanced"]),
        budget_level: z.enum(["luxury", "mid_range", "budget"]),
        language: z.string().optional(),
    }),
    trip_details: z.object({
        destination: z.array(z.string()).min(1, { message: "At least one region is required." }),
        start_date: z.date({ error: "Start date is required." }),
        end_date: z.date({ error: "End date is required." }),
        adults: z.number()
            .int("Number of adults must be an integer.")
            .positive("At least one adult is required."),
        children: z.array(z.number().int().min(0).max(17)),
    }),
    logistics: z.object({
        transport_preference: z.enum(["any", "rental_car", "taxi", "public_transport", "private_chauffeur"]).optional(),
        accommodation_type: z.enum(["any", "hotel", "villa", "guesthouse", "boutique_hotel"]).optional(),
        flight_booked: z.boolean().optional(),
    }),
    preferences: z.object({
        interests: z.array(z.string()).optional(),
        rhythm: z.enum(["relaxed", "balanced", "fast_paced", "adventure"]).optional(),
    }),
    metadata: z.object({
        source: z.string().optional(),
        thread_id: z.string().optional(),
    }).optional(),
});

// Define the expected backend response structure
export const ItineraryResponseSchema = z.object({
    itinerary: z.object({
        itinerary_id: z.string(),
        title: z.string(),
        summary: z.string(),
        days: z.array(z.object({
            day: z.number(),
            area: z.string(),
            activities: z.array(z.object({
                activity_id: z.string(),
                title: z.string().nullable().optional(),
                narrative_text: z.string(),
                activity_ref_name: z.string().nullable().optional(),
                duration: z.string().nullable().optional(),
                price: z.number().nullable().optional(),
            })),
        })),
    }),
    pdf_content: z.string().optional(),
});

export type ItineraryFormInput = z.infer<typeof formSchema>;
export type ItineraryAPIResponse = z.infer<typeof ItineraryResponseSchema>;

export async function generateItinerary(formData: ItineraryFormInput): Promise<ItineraryAPIResponse> {


    const durationDays = differenceInCalendarDays(formData.trip_details.end_date, formData.trip_details.start_date) + 1;

    const formattedData = {
        ...formData,
        trip_details: {
            ...formData.trip_details,
            duration_days: durationDays,
            start_date: format(formData.trip_details.start_date, 'yyyy-MM-dd'),
            end_date: format(formData.trip_details.end_date, 'yyyy-MM-dd'),
        }
    };

    // 5. Configuration des headers
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    try {
        const response = await fetch(`/api/itinerary/generate`, {
            method: 'POST',
            headers,
            body: JSON.stringify(formattedData),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            console.error(" API Error Detail:", errorBody);
            throw new Error(errorBody.detail || `Server error: ${response.status}`);
        }
        const data = await response.json();
        return ItineraryResponseSchema.parse(data);
    } catch (error) {
        console.error(" Request Failed:", error);
        throw error;
    }
}