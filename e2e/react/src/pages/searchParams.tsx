import { useSearchParams } from 'kvantjs/react'
import { number, string } from 'kvantjs/schema'

export function SearchParamsPage() {
  const [value, setValue] = useSearchParams('test', string())
  const [count, setCount] = useSearchParams('count', number())
  const [states, setStates] = useSearchParams({
    a: string(),
    b: number(),
  })

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
      <button id="set-multi" onClick={() => setStates({ a: 'x', b: 2 })}>
        Set multi
      </button>
      <pre id="state">{value ?? ''}</pre>
      <pre id="count">{count ?? ''}</pre>
      <pre id="multi">{JSON.stringify(states)}</pre>
    </>
  )
}
