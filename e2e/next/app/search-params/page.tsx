'use client'

import { useSearchParams } from 'kvant/next'
import { number, string } from 'kvant/schema'
import { Suspense } from 'react'

function Bench() {
  const [value, setValue] = useSearchParams('test', string())
  const [count, setCount] = useSearchParams('count', number())

  return (
    <>
      <button id="set-pass" onClick={() => setValue('pass')}>
        Set
      </button>
      <button id="clear" onClick={() => setValue(undefined)}>
        Clear
      </button>
      <button id="increment" onClick={() => setCount(c => (c ?? 0) + 1)}>
        Increment
      </button>
      <pre id="state">{value ?? ''}</pre>
      <pre id="count">{count ?? ''}</pre>
    </>
  )
}

export default function SearchParamsPage() {
  return (
    <Suspense>
      <Bench />
    </Suspense>
  )
}
