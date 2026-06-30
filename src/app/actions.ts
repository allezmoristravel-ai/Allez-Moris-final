'use server'

import { getActivities, getActivitiesByCategory } from "@/lib/api";
import { Activity, StrapiResponse } from "@/types/strapi";

export async function fetchTopTours(locale: string = 'en'): Promise<Activity[]> {
    try {
        const response = await getActivities(locale, 1, 10);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch top tours via server action:", error);
        return [];
    }
}

export async function loadMoreCategoryActivities(category: string, locale: string, page: number, subcategory?: string): Promise<StrapiResponse<Activity>> {
    try {
        const response = await getActivitiesByCategory(category, locale, page, 20, subcategory);
        return response;
    } catch (error) {
        console.error(`Failed to fetch more activities for category ${category}:`, error);
        return { data: [], meta: { pagination: { page, pageSize: 20, pageCount: 0, total: 0 } } };
    }
}
