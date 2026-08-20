'use client'
import cn from 'cnfast'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { LucideBookOpen, LucideRocket } from 'lucide-react'
import Link from 'next/link'
import { useFramework } from '@/lib/frameworks.client'

export function HeroDynamicLinks() {
  const framework = useFramework()

  return (
    <>
      <Link
        href={`/docs/${framework.id}`}
        className={cn(buttonVariants({ color: 'primary' }), 'gap-2 px-4 rounded-full')}
      >
        <LucideBookOpen className="size-5" />
        Documentation
      </Link>
      <Link
        href={`/docs/${framework.id}/quick-start`}
        className={cn(buttonVariants({ color: 'secondary' }), 'gap-2 px-4 rounded-full')}
      >
        <LucideRocket className="size-5" />
        Quick Start
      </Link>
    </>
  )
}
