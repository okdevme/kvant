import { useLocalStorage } from 'kvant/react'
import { number, string } from 'kvant/schema'

export function LocalStoragePage() {
  const [value, setValue] = useLocalStorage('test', string())
  const [count, setCount] = useLocalStorage('count', number())

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
