import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://oasis.mesapos.in'),
  title: {
    template: '%s | OASIS',
    default: 'OASIS by MESA | Elite Student Developer Marketplace',
  },
  description: 'Hire verified student developers for MERN, AI, Python, Java, UI/UX, Android and college software projects. Premium freelance marketplace powered by MESA.',
  keywords: [
    'student developers',
    'college project developers',
    'hire student programmers',
    'MERN stack freelancers',
    'AI ML project developers',
    'Next.js developers',
    'React developers',
    'college software projects',
    'student freelance marketplace',
    'university developer platform',
    'final year project developers',
    'frontend developers',
    'backend developers',
    'TypeScript developers',
    'UI UX student designers'
  ],
  openGraph: {
    title: 'OASIS by MESA | Elite Student Developer Marketplace',
    description: 'Hire verified student developers for MERN, AI, Python, Java, UI/UX, Android and college software projects.',
    url: 'https://oasis.mesapos.in',
    siteName: 'OASIS',
    images: [{ url: '/logo.jpg', width: 800, height: 800, alt: 'OASIS Logo' }],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OASIS by MESA | Elite Student Developer Marketplace',
    description: 'Hire verified student developers for college software projects.',
    images: ['/logo.jpg'],
  },
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && systemDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else if (theme === 'light') {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.remove('dark', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
