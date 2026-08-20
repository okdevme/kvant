import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { CookiesOptionsProvider } from 'kvant/react'
import { cookies } from 'next/headers'
import { baseOptions } from '@/lib/layout.shared'

export default async function Layout({ children }: LayoutProps<'/'>) {
  const cookieStore = await cookies()
  return (
    <HomeLayout {...baseOptions()}>
      <CookiesOptionsProvider defaultOptions={{ fallback: cookieStore.toString() }}>
        {children}
      </CookiesOptionsProvider>
    </HomeLayout>
  )
}
