import { useSearchParams } from 'kvant/react'
import { string } from 'kvant/schema'
import { Link } from '../router'

export function LinkingPage() {
  const [value] = useSearchParams('test', string())

  return (
    <>
      <Link to="/linking?test=link-value">
        <span id="link-with-query">with query</span>
      </Link>
      <Link to="/linking-target?test=cross">
        <span id="link-cross-page">cross page</span>
      </Link>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}

export function LinkingTargetPage() {
  const [value] = useSearchParams('test', string())

  return <pre id="state">{value ?? ''}</pre>
}
