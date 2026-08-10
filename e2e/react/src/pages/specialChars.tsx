import { useSearchParams } from 'kvant/react'
import { string } from 'kvant/schema'

const SPECIAL = 'a b+c/d?e&f=g'

export function SpecialCharsPage() {
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
