import { useSearchParams } from 'kvant/react-router'
import { string } from 'kvant/schema'
import { useNavigate } from 'react-router'

const target = '/linking-target?test=routed'

export default function RoutingPage() {
  const [value] = useSearchParams('test', string())
  const navigate = useNavigate()

  return (
    <>
      <button id="nav-push" onClick={() => navigate(target)}>
        Push
      </button>
      <button id="nav-replace" onClick={() => navigate(target, { replace: true })}>
        Replace
      </button>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}
