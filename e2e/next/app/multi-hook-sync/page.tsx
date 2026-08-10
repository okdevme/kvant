'use client'

import { useSearchParams } from 'kvant/next'
import { string } from 'kvant/schema'
import { Suspense } from 'react'

function Bench() {
  const [a, setA] = useSearchParams('test', string())
  const [states, setStates] = useSearchParams({ test: string() })

  return (
    <>
      <button id="set-a" onClick={() => setA('from-a')}>
        Set A
      </button>
      <button id="set-b" onClick={() => setStates({ test: 'from-b' })}>
        Set B
      </button>
      <pre id="state-a">{a ?? ''}</pre>
      <pre id="state-b">{states.test ?? ''}</pre>
    </>
  )
}

export default function MultiHookSyncPage() {
  return (
    <Suspense>
      <Bench />
    </Suspense>
  )
}
