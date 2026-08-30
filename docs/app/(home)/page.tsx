import type { Metadata } from 'next'
import { Hero } from '@/components/hero'
import { description, title } from '@/lib/shared'

const openGraph = {
  title: `${title} | ${description}`,
  description: `${description}. Supports React, Next.js, React Router, Vue, Vue Router and Nuxt.`,
  images: '/og/index.png',
} satisfies Metadata['openGraph']

export const metadata = {
  title: {
    absolute: `${title} | ${description}`,
  },
  openGraph,
  twitter: {
    card: 'summary_large_image',
    ...openGraph,
  },
} satisfies Metadata

export default function HomePage() {
  return <Hero />
}
