import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login to OASIS | Student Freelance Marketplace',
  alternates: {
    canonical: '/auth/login',
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
