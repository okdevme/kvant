import { Inter } from 'next/font/google'
import { Body, Provider } from './layout.client'
import './global.css'

const inter = Inter({
  subsets: ['latin'],
})

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <Body>
        <Provider>{children}</Provider>
      </Body>
    </html>
  )
}
