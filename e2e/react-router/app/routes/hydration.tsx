import { CookiesOptionsProvider, useCookies } from 'kvantjs/react'
import { useSearchParams } from 'kvantjs/react-router'
import { string } from 'kvantjs/schema'

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
  const [value] = useCookies('test', string())
  const [query] = useSearchParams('test', string())

  return (
    <>
      <pre id="state">{value ?? ''}</pre>
      <pre id="query">{query ?? ''}</pre>
    </>
  )
}
