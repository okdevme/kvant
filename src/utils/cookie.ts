// Based on https://github.com/jshttp/cookie (MIT)
// Copyright (c) 2012-2014 Roman Shtylman <shtylman@gmail.com>
// Copyright (c) 2015 Douglas Christopher Wilson <doug@somethingdoug.com>
// Last sync: v2.0.1 (51c4854)

/**
 * RegExp to match RFC 6265 cookie-octet values (without % to preserve roundtrip) that need no URL encoding.
 */
const cookieOctetRegExp = /^[!#$&'()*+\-./\w:<=>?@[\]^`{|}~]*$/

/**
 * Parse options.
 */
export interface ParseOptions {
  /**
   * Specifies a function that will be used to decode a [cookie-value](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1).
   * Since the value of a cookie has a limited character set (and must be a simple string), this function can be used to decode
   * a previously-encoded cookie value into a JavaScript string.
   *
   * The default function is the global `decodeURIComponent`, wrapped in a `try..catch`. If an error
   * is thrown it will return the cookie's original value. If you provide your own encode/decode
   * scheme you must ensure errors are appropriately handled. Custom decode functions can return `undefined`,
   * which will skip the cookie during `parse` and try again with a future cookie of the same name.
   *
   * @default decode
   */
  decode?: (str: string) => string | undefined
}

/**
 * Cookies object.
 */
export type Cookies = Record<string, string | undefined>

/**
 * Parse a `Cookie` header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 */
export function parseCookie(str: string, options?: ParseOptions): Cookies {
  const obj: Cookies = {}
  const len = str.length
  // RFC 6265 sec 4.1.1, RFC 2616 2.2 defines a cookie name consists of one char minimum, plus '='.
  if (len < 2)
    return obj

  const dec = options?.decode || decodeCookieValue
  let index = 0

  do {
    const eqIdx = eqIndex(str, index, len)
    if (eqIdx === len)
      break // No more cookie pairs.

    const endIdx = endIndex(str, index, len)

    if (eqIdx > endIdx) {
      // backtrack on prior semicolon
      index = str.lastIndexOf(';', eqIdx - 1) + 1
      continue
    }

    const key = valueSlice(str, index, eqIdx)

    // only assign once
    if (obj[key] === undefined) {
      obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx))
    }

    index = endIdx + 1
  } while (index < len)

  return obj
}

export interface StringifyOptions {
  /**
   * Specifies a function that will be used to encode a [cookie-value](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1).
   * Since value of a cookie has a limited character set (and must be a simple string), this function can be used to encode
   * a value into a string suited for a cookie's value, and should mirror `decode` when parsing.
   * The default function preserves roundtrip-safe cookie-octet values and uses `encodeURIComponent` otherwise.
   */
  encode?: (str: string) => string
}

/**
 * Set-Cookie object.
 */
export interface SetCookie {
  /**
   * Specifies the name of the cookie.
   */
  name: string
  /**
   * Specifies the string to be the value for the cookie.
   */
  value: string | undefined
  /**
   * Specifies the `number` (in seconds) to be the value for the [`Max-Age` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.2).
   *
   * The [cookie storage model specification](https://tools.ietf.org/html/rfc6265#section-5.3) states that if both `expires` and
   * `maxAge` are set, then `maxAge` takes precedence, but it is possible not all clients by obey this,
   * so if both are set, they should point to the same date and time.
   */
  maxAge?: number
  /**
   * Specifies the `Date` object to be the value for the [`Expires` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.1).
   * When no expiration is set, clients consider this a "non-persistent cookie" and delete it when the current session is over.
   *
   * The [cookie storage model specification](https://tools.ietf.org/html/rfc6265#section-5.3) states that if both `expires` and
   * `maxAge` are set, then `maxAge` takes precedence, but it is possible not all clients by obey this,
   * so if both are set, they should point to the same date and time.
   */
  expires?: Date
  /**
   * Specifies the value for the [`Domain` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.3).
   * When no domain is set, clients consider the cookie to apply to the current domain only.
   */
  domain?: string
  /**
   * Specifies the value for the [`Path` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.4).
   * When no path is set, the path is considered the ["default path"](https://tools.ietf.org/html/rfc6265#section-5.1.4).
   */
  path?: string
  /**
   * Enables the [`HttpOnly` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.6).
   * When enabled, clients will not allow client-side JavaScript to see the cookie in `document.cookie`.
   */
  httpOnly?: boolean
  /**
   * Enables the [`Secure` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.5).
   * When enabled, clients will only send the cookie back if the browser has an HTTPS connection.
   */
  secure?: boolean
  /**
   * Enables the [`Partitioned` `Set-Cookie` attribute](https://tools.ietf.org/html/draft-cutler-httpbis-partitioned-cookies/).
   * When enabled, clients will only send the cookie back when the current domain _and_ top-level domain matches.
   *
   * This is an attribute that has not yet been fully standardized, and may change in the future.
   * This also means clients may ignore this attribute until they understand it. More information
   * about can be found in [the proposal](https://github.com/privacycg/CHIPS).
   */
  partitioned?: boolean
  /**
   * Specifies the value for the [`Priority` `Set-Cookie` attribute](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1).
   *
   * - `'low'` will set the `Priority` attribute to `Low`.
   * - `'medium'` will set the `Priority` attribute to `Medium`, the default priority when not set.
   * - `'high'` will set the `Priority` attribute to `High`.
   *
   * More information about priority levels can be found in [the specification](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1).
   */
  priority?: 'low' | 'medium' | 'high'
  /**
   * Specifies the value for the [`SameSite` `Set-Cookie` attribute](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7).
   *
   * - `true` will set the `SameSite` attribute to `Strict` for strict same site enforcement.
   * - `'lax'` will set the `SameSite` attribute to `Lax` for lax same site enforcement.
   * - `'none'` will set the `SameSite` attribute to `None` for an explicit cross-site cookie.
   * - `'strict'` will set the `SameSite` attribute to `Strict` for strict same site enforcement.
   *
   * More information about enforcement levels can be found in [the specification](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7).
   */
  sameSite?: boolean | 'lax' | 'strict' | 'none'
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize a name value pair into a cookie string suitable for
 * http headers. An optional options object specifies cookie parameters.
 *
 * stringifySetCookie({ name: 'foo', value: 'bar', httpOnly: true })
 *   => "foo=bar; HttpOnly"
 */
export function stringifySetCookie(
  cookie: SetCookie,
  options?: StringifyOptions,
): string {
  const enc = options?.encode || encodeCookieValue

  const value = cookie.value == null ? '' : enc(cookie.value)

  let str = `${cookie.name}=${value}`

  if (cookie.maxAge !== undefined) {
    str += `; Max-Age=${cookie.maxAge}`
  }

  if (cookie.domain) {
    str += `; Domain=${cookie.domain}`
  }

  if (cookie.path) {
    str += `; Path=${cookie.path}`
  }

  if (cookie.expires) {
    str += `; Expires=${cookie.expires.toUTCString()}`
  }

  if (cookie.httpOnly) {
    str += '; HttpOnly'
  }

  if (cookie.secure) {
    str += '; Secure'
  }

  if (cookie.partitioned) {
    str += '; Partitioned'
  }

  if (cookie.priority) {
    switch (cookie.priority) {
      case 'low':
        str += '; Priority=Low'
        break
      case 'medium':
        str += '; Priority=Medium'
        break
      case 'high':
        str += '; Priority=High'
        break
    }
  }

  if (cookie.sameSite) {
    switch (cookie.sameSite) {
      case true:
      case 'strict':
        str += '; SameSite=Strict'
        break
      case 'lax':
        str += '; SameSite=Lax'
        break
      case 'none':
        str += '; SameSite=None'
        break
    }
  }

  return str
}

/**
 * Find the next `;` character, or return `len`.
 */
function endIndex(str: string, min: number, len: number): number {
  const index = str.indexOf(';', min)
  return index === -1 ? len : index
}

/**
 * Find the next `=` character, or return `len`.
 */
function eqIndex(str: string, min: number, len: number): number {
  const index = str.indexOf('=', min)
  return index === -1 ? len : index
}

/**
 * Slice out a value between startPod to max.
 */
function valueSlice(str: string, min: number, max: number): string {
  if (min === max)
    return ''
  let start = min
  let end = max

  do {
    const code = str.charCodeAt(start)
    if (code !== 32 /*   */ && code !== 9 /* \t */)
      break
  } while (++start < end)

  while (end > start) {
    const code = str.charCodeAt(end - 1)
    if (code !== 32 /*   */ && code !== 9 /* \t */)
      break
    end--
  }

  return str.slice(start, end)
}

/**
 * URL-decode string value. Optimized to skip native call when no %.
 */
export function decodeCookieValue(str: string): string {
  if (!str.includes('%'))
    return str

  try {
    return decodeURIComponent(str)
  }
  catch {
    return str
  }
}

/**
 * URL-encode string value. Optimized to skip native call for roundtrip-safe cookie-octet values.
 */
export function encodeCookieValue(str: string): string {
  return cookieOctetRegExp.test(str) ? str : encodeURIComponent(str)
}
