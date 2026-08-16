import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata = {
  title: {
    absolute: 'kvant | Universal, type-safe state manager for key-value interfaces',
  },
} satisfies Metadata

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-4">Hello World</h1>
      <p>
        You can open
        {' '}
        <Link href="/docs" className="font-medium underline">
          /docs
        </Link>
        {' '}
        and see the documentation.
      </p>
    </div>
  )
}
