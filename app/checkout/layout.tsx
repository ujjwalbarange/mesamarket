import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Secure Project Checkout & UPI Payments | OASIS',
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
