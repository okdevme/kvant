import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { authors, baseUrl, description, title } from '@/lib/shared'
import { Body, Provider } from './layout.client'
import './global.css'

export const metadata = {
  title: {
    template: `%s | ${title}`,
    default: title,
  },
  description,
  authors,
  metadataBase: baseUrl,
} satisfies Metadata

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
