import type { Metadata } from 'next'
import { Hero } from '@/components/hero'

export const metadata = {
  title: {
    absolute: 'kvant | Universal, type-safe state manager for key-value interfaces',
  },
} satisfies Metadata

export default function HomePage() {
  return <Hero />
}
