import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join OASIS Powered by MESA | Become a Student Developer or Client',
  alternates: {
    canonical: '/auth/register',
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
