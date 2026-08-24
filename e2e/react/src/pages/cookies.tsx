import { useCookies } from 'kvantjs/react'
import { number, string } from 'kvantjs/schema'

export function CookiesPage() {
  const [value, setValue] = useCookies('test', string())
  const [count, setCount] = useCookies('count', number())

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
