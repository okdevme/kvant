'use client'

import type { ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/cn'
import { getSection } from '@/lib/navigation'

export function Body({ children }: { children: ReactNode }): React.ReactElement {
  const framework = useFramework()

  return <body className={cn(framework, 'relative flex min-h-screen flex-col')}>{children}</body>
}

function useFramework(): string | undefined {
  const { slug = [] } = useParams()
  if (Array.isArray(slug))
    return getSection(slug[0])
}
