'use client'

import { useSearchParams } from 'kvantjs/next'
import { string } from 'kvantjs/schema'
import { Suspense, useState } from 'react'

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

function Bench() {
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

export default function ConditionalRenderingPage() {
  return (
    <Suspense>
      <Bench />
    </Suspense>
  )
}
