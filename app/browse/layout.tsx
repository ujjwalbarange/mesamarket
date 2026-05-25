import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Student Developers & Tech Services',
  description: 'Explore verified student freelancers, projects, and services across web development, AI/ML, and design.',
  alternates: {
    canonical: '/browse',
  },
}

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
