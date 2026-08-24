import { useSearchParams } from 'kvantjs/react'
import { string } from 'kvantjs/schema'

export function SearchParamsPushPage() {
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
