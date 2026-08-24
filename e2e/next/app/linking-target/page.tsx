'use client'

import { useSearchParams } from 'kvantjs/next'
import { string } from 'kvantjs/schema'
import { Suspense } from 'react'

function Bench() {
  const [value] = useSearchParams('test', string())

  return <pre id="state">{value ?? ''}</pre>
}

export default function LinkingTargetPage() {
  return (
    <Suspense>
      <Bench />
    </Suspense>
  )
}
