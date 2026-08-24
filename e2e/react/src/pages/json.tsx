import { useSearchParams } from 'kvantjs/react'
import { any, json } from 'kvantjs/schema'

export function JsonPage() {
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
