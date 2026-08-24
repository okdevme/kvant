'use client'

import { useCookies } from 'kvantjs/react'
import { string } from 'kvantjs/schema'

export default function CookieAttributesPage() {
  const [value, setValue] = useCookies('test', string())
  const [expiring, setExpiring] = useCookies('expiring', string(), { maxAge: 3600 })
  const [scoped, setScoped] = useCookies('scoped', string(), { path: '/cookie-attributes' })
  const [samesite, setSamesite] = useCookies('samesite', string(), { sameSite: 'strict' })

  return (
    <>
      <button id="set-pass" onClick={() => setValue('pass')}>
        Set
      </button>
      <button id="set-expiring" onClick={() => setExpiring('alive')}>
        Set expiring
      </button>
      <button id="set-scoped" onClick={() => setScoped('scoped-value')}>
        Set scoped
      </button>
      <button id="set-samesite" onClick={() => setSamesite('strict-value')}>
        Set samesite
      </button>
      <pre id="state">{value ?? ''}</pre>
      <pre id="expiring">{expiring ?? ''}</pre>
      <pre id="scoped">{scoped ?? ''}</pre>
      <pre id="samesite">{samesite ?? ''}</pre>
    </>
  )
}
