import { useSearchParams } from 'kvantjs/react'
import { string } from 'kvantjs/schema'

function KeyProbe({ id }: { id: string }) {
  const [state, setState] = useSearchParams(id, string())
  // eslint-disable-next-line no-console -- render instrumentation for e2e render-count assertions
  console.log(`render ${id}`)
  return (
    <>
      <button id={`trigger-${id}`} onClick={() => setState('pass')}>
        Trigger
        {' '}
        {id}
      </button>
      <pre id={`state-${id}`}>{state ?? ''}</pre>
    </>
  )
}

export function KeyIsolationPage() {
  return (
    <>
      <KeyProbe id="a" />
      <KeyProbe id="b" />
    </>
  )
}
