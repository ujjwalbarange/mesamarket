import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { generateGigSlug } from '@/lib/utils/slugify'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://oasis.mesapos.in'

  // Static routes
  const routes = [
    '',
    '/browse',
    '/auth/login',
    '/auth/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    // Dynamic gig routes
    const gigs = await prisma.gig.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, updatedAt: true },
    })

    const gigRoutes = gigs.map((gig) => ({
      url: `${baseUrl}/gig/${generateGigSlug(gig.title, gig.id)}`,
      lastModified: gig.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    return [...routes, ...gigRoutes]
  } catch (error) {
    // Fallback if DB is unavailable
    return routes
  }
}
