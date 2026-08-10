'use client'

import { useSearchParams } from 'kvant/next'
import { string } from 'kvant/schema'
import { Suspense } from 'react'

function Bench() {
  const [value, setValue] = useSearchParams('test', string())

  return (
    <>
      <button id="set-pass" onClick={() => setValue('pass')}>
        Set
      </button>
      <button id="clear" onClick={() => setValue(undefined)}>
        Clear
      </button>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}

export default function HashPreservationPage() {
  return (
    <Suspense>
      <Bench />
    </Suspense>
  )
}
