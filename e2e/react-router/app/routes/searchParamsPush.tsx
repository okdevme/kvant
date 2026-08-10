import { useSearchParams } from 'kvant/react-router'
import { string } from 'kvant/schema'

export default function SearchParamsPushPage() {
  const [value, setValue] = useSearchParams('test', string(), { history: 'push' })

  return (
    <>
      <button id="set-pass" onClick={() => setValue('pass')}>
        Set
      </button>
      <pre id="state">{value ?? ''}</pre>
    </>
  )
}
