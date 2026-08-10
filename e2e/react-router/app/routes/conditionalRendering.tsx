import { useSearchParams } from 'kvant/react-router'
import { string } from 'kvant/schema'
import { useState } from 'react'

function Inner() {
  const [value, setValue] = useSearchParams('test', string())

  return (
    <>
      <button id="inner-set" onClick={() => setValue('inner')}>
        Inner set
      </button>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}

export default function ConditionalRenderingPage() {
  const [mounted, setMounted] = useState(true)

  return (
    <>
      <button id="toggle" onClick={() => setMounted(m => !m)}>
        Toggle
      </button>
      {mounted
        ? (
            <Inner />
          )
        : (
            <pre id="state">unmounted</pre>
          )}
    </>
  )
}
