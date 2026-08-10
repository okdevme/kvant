import type { ReactNode } from 'react'
import { CookiesOptionsProvider } from 'kvant/react'
import { cookies } from 'next/headers'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()

  return (
    <html lang="en">
      <body>
        <CookiesOptionsProvider defaultOptions={{ fallback: cookieStore.toString() }}>
          {children}
        </CookiesOptionsProvider>
      </body>
    </html>
  )
}
