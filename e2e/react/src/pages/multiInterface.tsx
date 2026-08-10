import { useCookies, useLocalStorage, useSearchParams } from 'kvant/react'
import { string } from 'kvant/schema'

export function MultiInterfacePage() {
  const [query, setQuery] = useSearchParams('test', string())
  const [cookie, setCookie] = useCookies('test', string())
  const [stored, setStored] = useLocalStorage('test', string())

  return (
    <>
      <button id="set-query" onClick={() => setQuery('from-query')}>
        Set query
      </button>
      <button id="set-cookie" onClick={() => setCookie('from-cookie')}>
        Set cookie
      </button>
      <button id="set-storage" onClick={() => setStored('from-storage')}>
        Set storage
      </button>
      <button
        id="set-all"
        onClick={() => {
          setQuery('q')
          setCookie('c')
          setStored('s')
        }}
      >
        Set all
      </button>
      <pre id="query">{query ?? ''}</pre>
      <pre id="cookie">{cookie ?? ''}</pre>
      <pre id="storage">{stored ?? ''}</pre>
    </>
  )
}
