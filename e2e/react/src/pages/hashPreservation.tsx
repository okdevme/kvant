import { useSearchParams } from 'kvantjs/react'
import { string } from 'kvantjs/schema'

export function HashPreservationPage() {
  const [value, setValue] = useSearchParams('test', string())

  return (
    <>
      <button id="set-pass" onClick={() => setValue('pass')}>
        Set
      </button>
      <button id="clear" onClick={() => setValue(undefined)}>
        Clear
      </button>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}
