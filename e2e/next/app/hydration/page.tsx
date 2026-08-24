'use client'

import { useSearchParams } from 'kvantjs/next'
import { CookiesOptionsProvider, useCookies } from 'kvantjs/react'
import { string } from 'kvantjs/schema'
import { Suspense } from 'react'

// Force an SSR snapshot that intentionally mismatches the client cookie
// ('server' here vs the 'client' cookie set by the spec). Hydration must
// render the SSR value, then swap to the client value without mismatch.
export default function HydrationPage() {
  return (
    <CookiesOptionsProvider defaultOptions={{ fallback: 'test=server' }}>
      <Bench />
    </CookiesOptionsProvider>
  )
}

function Bench() {
  return (
    <>
      <CookieSection />
      <Suspense>
        <SearchSection />
      </Suspense>
    </>
  )
}

function CookieSection() {
  const [value] = useCookies('test', string())
  return <pre id="state">{value ?? ''}</pre>
}

function SearchSection() {
  const [value] = useSearchParams('test', string())
  return <pre id="query">{value ?? ''}</pre>
}
