'use client'
import type { ReactNode } from 'react'
import { RootProvider } from 'fumadocs-ui/provider/next'
import SearchDialog from '@/components/search'
import { cn } from '@/lib/cn'
import { useFramework } from '@/lib/frameworks.client'

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
    >
      {children}
    </RootProvider>
  )
}

export function Body({ children }: { children: ReactNode }): React.ReactElement {
  const framework = useFramework()

  return (
    <body className={cn(framework, 'relative flex min-h-screen flex-col')}>
      {children}
    </body>
  )
}
