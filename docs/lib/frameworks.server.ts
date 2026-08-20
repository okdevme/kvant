import { cookies } from 'next/headers'
import { frameworkCookieName, frameworkCookieSchema } from './frameworks'

export async function getServerCookieFrameworkId() {
  return frameworkCookieSchema.parse((await cookies()).get(frameworkCookieName)?.value)
}
