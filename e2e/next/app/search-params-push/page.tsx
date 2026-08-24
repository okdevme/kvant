'use client'

import { useSearchParams } from 'kvantjs/next'
import { string } from 'kvantjs/schema'
import { Suspense } from 'react'

function Bench() {
  const [value, setValue] = useSearchParams('test', string(), { history: 'push' })

  return (
    <>
      <button id="set-pass" onClick={() => setValue('pass')}>
        Set
      </button>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}

export default function SearchParamsPushPage() {
  return (
    <Suspense>
      <Bench />
    </Suspense>
  )
}
