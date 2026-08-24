import { useSearchParams } from 'kvantjs/react-router'
import { string } from 'kvantjs/schema'

export default function HashPreservationPage() {
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
