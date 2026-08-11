import { useSearchParams } from 'kvant/react'
import { string } from 'kvant/schema'

function navigate(mode: 'push' | 'replace', to: string) {
  window.history[`${mode}State`](null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function RoutingPage() {
  const [value] = useSearchParams('test', string())

  return (
    <>
      <button id="nav-push" onClick={() => navigate('push', '/linking-target?test=routed')}>
        Push
      </button>
      <button id="nav-replace" onClick={() => navigate('replace', '/linking-target?test=routed')}>
        Replace
      </button>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}
