'use client'

import { useSearchParams } from 'kvant/next'
import { any, json } from 'kvant/schema'
import { Suspense } from 'react'

function Bench() {
  const [value, setValue] = useSearchParams('test', json(any()))

  return (
    <>
      <button id="set-json" onClick={() => setValue({ a: 1, b: [true, 'x'] })}>
        Set json
      </button>
      <pre id="state">{value === undefined ? '' : JSON.stringify(value)}</pre>
    </>
  )
}

export default function JsonPage() {
  return (
    <Suspense>
      <Bench />
    </Suspense>
  )
}
