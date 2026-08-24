'use client'

import { useSearchParams } from 'kvantjs/next'
import { string } from 'kvantjs/schema'
import { Suspense } from 'react'

const SPECIAL = 'a b+c/d?e&f=g'

function Bench() {
  const [value, setValue] = useSearchParams('test', string())

  return (
    <>
      <button id="set-special" onClick={() => setValue(SPECIAL)}>
        Set special
      </button>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}

export default function SpecialCharsPage() {
  return (
    <Suspense>
      <Bench />
    </Suspense>
  )
}
