import { useSearchParams } from 'kvantjs/react-router'
import { string } from 'kvantjs/schema'

const SPECIAL = 'a b+c/d?e&f=g'

export default function SpecialCharsPage() {
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
