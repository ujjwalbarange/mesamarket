import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { extractIdFromSlug } from '@/lib/utils/slugify'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const id = extractIdFromSlug(slug)

  try {
    const gig = await prisma.gig.findUnique({ where: { id } })
    if (!gig) return { title: 'Gig Not Found | OASIS' }

    return {
      title: gig.title,
      description: gig.description.substring(0, 160),
      alternates: {
        canonical: `/gig/${slug}`,
      },
      openGraph: {
        title: `${gig.title} | OASIS`,
        description: gig.description.substring(0, 160),
        images: gig.thumbnail ? [{ url: gig.thumbnail }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: gig.title,
        description: gig.description.substring(0, 160),
        images: gig.thumbnail ? [gig.thumbnail] : [],
      },
    }
  } catch {
    return { title: 'OASIS | Elite Student Developer Marketplace' }
  }
}

export default function GigLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
