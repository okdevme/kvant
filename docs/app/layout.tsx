import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Body, Provider } from './layout.client'
import './global.css'

const baseUrl
  = process.env.NODE_ENV === 'development' || !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL('http://localhost:3000')
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)

export const metadata = {
  title: {
    template: '%s | kvant',
    default: 'kvant',
  },
  description: 'Universal, type-safe state manager for key-value interfaces.',
  authors: [
    {
      name: 'Oleg Kapranov',
      url: 'https://github.com/okdevme',
    },
  ],
  metadataBase: baseUrl,
} satisfies Metadata

const inter = Inter({
  subsets: ['latin'],
})

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <Body>
        <Provider>{children}</Provider>
      </Body>
    </html>
  )
}
