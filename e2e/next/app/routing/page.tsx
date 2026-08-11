'use client'

import { useSearchParams } from 'kvant/next'
import { string } from 'kvant/schema'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'

const target = '/linking-target?test=routed'

function Bench() {
  const [value] = useSearchParams('test', string())
  const router = useRouter()

  return (
    <>
      <button id="nav-push" onClick={() => router.push(target)}>
        Push
      </button>
      <button id="nav-replace" onClick={() => router.replace(target)}>
        Replace
      </button>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}

export default function RoutingPage() {
  return (
    <Suspense>
      <Bench />
    </Suspense>
  )
}
