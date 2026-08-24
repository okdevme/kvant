import { useSessionStorage } from 'kvantjs/react'
import { number, string } from 'kvantjs/schema'

export function SessionStoragePage() {
  const [value, setValue] = useSessionStorage('test', string())
  const [count, setCount] = useSessionStorage('count', number())

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
