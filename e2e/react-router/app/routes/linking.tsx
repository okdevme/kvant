import { useSearchParams } from 'kvantjs/react-router'
import { string } from 'kvantjs/schema'
import { Link } from 'react-router'

export default function LinkingPage() {
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
