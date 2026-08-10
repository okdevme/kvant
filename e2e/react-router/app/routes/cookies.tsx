import type { Route } from './+types/cookies'
import { CookiesOptionsProvider, useCookies } from 'kvant/react'
import { number, string } from 'kvant/schema'

export function loader({ request }: Route.LoaderArgs) {
  return {
    cookie: request.headers.get('cookie') ?? undefined,
  }
}

export default function CookiesPage({ loaderData }: Route.ComponentProps) {
  return (
    <CookiesOptionsProvider defaultOptions={{ fallback: loaderData.cookie }}>
      <Bench />
    </CookiesOptionsProvider>
  )
}

function Bench() {
  const [value, setValue] = useCookies('test', string())
  const [count, setCount] = useCookies('count', number())

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
