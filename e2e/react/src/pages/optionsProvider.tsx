import { SearchParamsOptionsProvider, useSearchParams } from 'kvantjs/react'
import { string } from 'kvantjs/schema'

function Inner() {
  // inherits history: 'push' from the provider
  const [value, setValue] = useSearchParams('test', string())
  // per-hook override wins over the provider
  const [override, setOverride] = useSearchParams('override', string(), { history: 'replace' })

  return (
    <>
      <button id="set-pass" onClick={() => setValue('pass')}>
        Set
      </button>
      <button id="set-override" onClick={() => setOverride('yes')}>
        Set override
      </button>
      <pre id="state">{value ?? ''}</pre>
      <pre id="override">{override ?? ''}</pre>
    </>
  )
}

export function OptionsProviderPage() {
  return (
    <SearchParamsOptionsProvider defaultOptions={{ history: 'push' }}>
      <Inner />
    </SearchParamsOptionsProvider>
  )
}
