'use client'

import { useSearchParams } from 'kvant/next'
import { string } from 'kvant/schema'
import Link from 'next/link'
import { Suspense } from 'react'

function Bench() {
  const [value] = useSearchParams('test', string())

  return (
    <>
      <Link href="/linking?test=link-value">
        <span id="link-with-query">with query</span>
      </Link>
      <Link href="/linking-target?test=cross">
        <span id="link-cross-page">cross page</span>
      </Link>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}

export default function LinkingPage() {
  return (
    <Suspense>
      <Bench />
    </Suspense>
  )
}
