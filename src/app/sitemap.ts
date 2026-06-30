import { MetadataRoute } from 'next'
import { getActivities, getAccommodations } from '@/lib/api'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.allezmoristravel.com'
const languages = ['en', 'fr', 'de']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes — high-priority pages first
  const routes = [
    { path: '', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/activities', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/services', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/itinerary-builder', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/subscribe', changeFrequency: 'monthly' as const, priority: 0.5 },
    // Service sub-pages
    { path: '/services/rental', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/services/stay', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/services/airport-transfer', changeFrequency: 'monthly' as const, priority: 0.7 },
    // Category pages
    { path: '/activities/sea', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/activities/land', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/activities/air', changeFrequency: 'weekly' as const, priority: 0.7 },
  ]

  const staticEntries = routes.flatMap((route) =>
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  )

  // Dynamic activity entries
  let activityEntries: MetadataRoute.Sitemap = []

  try {
    const response = await getActivities('en', 1, 100)
    const activities = response.data

    activityEntries = activities.flatMap((activity) =>
      languages.map((lang) => ({
        url: `${baseUrl}/${lang}/activity/${activity.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    )
  } catch (error) {
    console.error('Failed to fetch activities for sitemap:', error)
  }

  // Dynamic accommodation entries
  let accommodationEntries: MetadataRoute.Sitemap = []

  try {
    const response = await getAccommodations('en')
    accommodationEntries = response.data.flatMap((acc) =>
      languages.map((lang) => ({
        url: `${baseUrl}/${lang}/services/stay/${acc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    )
  } catch (error) {
    console.error('Failed to fetch accommodations for sitemap:', error)
  }

  return [...staticEntries, ...activityEntries, ...accommodationEntries]
}
