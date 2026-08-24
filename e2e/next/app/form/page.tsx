'use client'

import type { FormEvent } from 'react'
import { useSearchParams } from 'kvantjs/next'
import { string } from 'kvantjs/schema'
import { Suspense } from 'react'

function Bench() {
  const [value, setValue] = useSearchParams('test', string())

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setValue(String(data.get('test') ?? ''))
  }

  return (
    <>
      <form id="form" onSubmit={onSubmit}>
        <input id="input" name="test" defaultValue={value ?? ''} />
        <button id="submit" type="submit">
          Submit
        </button>
      </form>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}

export default function FormPage() {
  return (
    <Suspense>
      <Bench />
    </Suspense>
  )
}
