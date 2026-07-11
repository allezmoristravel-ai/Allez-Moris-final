// src/lib/chatApi.ts

import { z } from "zod";

export const ChatInputSchema = z.object({
    message: z.string().min(1, { message: "Message cannot be empty." }),
    thread_id: z.string().optional(),
    current_page_url: z.string().optional(),
    // --- AJOUTS ---
    // On utilise z.any() pour 'current_form' pour éviter de recréer tout le schéma TravelForm ici
    // et garder la modification minimale.
    current_form: z.any(),
    current_itinerary: z.any().optional(),
    itinerary_id: z.string().optional(),
    lang: z.string().default("en"),
});

export const ChatResponseSchema = z.object({
    response: z.string(),
    thread_id: z.string(),
    intent: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    subcategory: z.string().nullable().optional(),
    activity_id: z.string().nullable().optional(),
    itinerary: z.any().optional(),
});

export type ChatInputType = z.infer<typeof ChatInputSchema>;
export type ChatResponseType = z.infer<typeof ChatResponseSchema>;

export async function sendChatMessage(chatInput: ChatInputType): Promise<ChatResponseType> {
    console.log("➡️ Chat API Request Payload:", chatInput);

    try {
        const response = await fetch(`/api/proxy/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(chatInput),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            console.error(`❌ Chat API Error (${response.status}):`, errorBody);
            throw new Error(errorBody.detail || `Chat request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (process.env.NODE_ENV !== 'production') {
            console.log(`✅ Chat response received for thread: ${data.thread_id}`);
        }

        return ChatResponseSchema.parse(data);

    } catch (error) {
        console.error("❌ Chat Network/Parsing Error:", error);
        throw error;
    }
}