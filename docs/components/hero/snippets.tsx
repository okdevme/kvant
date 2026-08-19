'use client'
import type { ReactNode } from 'react'
import type { FrameworkId } from '@/lib/frameworks'
import cn from 'cnfast'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover'
import { Check, ChevronsUpDown, LucideArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { defaultFramework, frameworks, getFramework } from '@/lib/frameworks'
import { FrameworkIcon } from '../framework-icon'

export interface Snippet {
  label: string
  children: ReactNode
}

export type SnippetMap = Record<FrameworkId, Snippet[]>

export interface HeroSnippetsProps {
  map: SnippetMap
}

function FrameworkSelect({
  className,
  value,
  onChange,
}: {
  className?: string
  value: FrameworkId
  onChange: (framework: FrameworkId) => void
}) {
  const [open, setOpen] = useState(false)
  const framework = getFramework(value) ?? defaultFramework

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          'flex w-full items-center gap-2 rounded-xl p-2 border bg-fd-secondary/50 text-start text-fd-secondary-foreground transition-colors',
          'hover:bg-fd-accent data-popup-open:bg-fd-accent data-popup-open:text-fd-accent-foreground',
          className,
        )}
      >
        <div className="size-5 shrink-0 flex items-center justify-center">
          <FrameworkIcon id={framework.id} className="size-full" />
        </div>
        <p className="text-sm font-medium">{framework.title}</p>
        <ChevronsUpDown className="shrink-0 ms-auto size-4 text-fd-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-1 w-(--anchor-width) p-1 fd-scroll-container">
        {frameworks.map((item) => {
          const isActive = item.id === framework.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onChange(item.id)
                setOpen(false)
              }}
              className="flex items-center gap-2 rounded-lg p-1.5 text-start hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <div className="shrink-0 size-5 md:mb-auto flex items-center justify-center">
                <FrameworkIcon id={item.id} className="size-full" />
              </div>
              <p className="text-sm font-medium leading-none">{item.title}</p>
              <Check
                className={cn(
                  'shrink-0 ms-auto size-3.5 text-fd-primary',
                  !isActive && 'invisible',
                )}
              />
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

export function HeroSnippets({ map }: HeroSnippetsProps) {
  const [frameworkId, setFrameworkId] = useState<FrameworkId>(defaultFramework.id)
  const framework = getFramework(frameworkId) ?? defaultFramework
  const list = map[framework.id]

  return (
    <div className="mt-4 flex w-full flex-col items-center gap-2 text-start h-90">
      <FrameworkSelect
        className="opacity-0 anim-supporter"
        value={frameworkId}
        onChange={setFrameworkId}
      />
      <div className="w-full shrink-0 opacity-0 anim-supporter">
        <Tabs
          key={framework.id}
          items={list.map(s => s.label)}
          className="rounded-xl border bg-fd-card my-0 w-full shrink-0 overflow-visible"
        >
          {list.map(snippet => (
            <Tab
              key={snippet.label}
              value={snippet.label}
              className="relative p-0 border-none"
            >
              {snippet.children}
              <Link
                href="/docs/next/quick-start"
                className={cn(
                  buttonVariants({ color: 'ghost' }),
                  'gap-2 px-4 rounded-full absolute top-[calc(100%+var(--spacing)*2)] left-1/2 -translate-x-1/2',
                )}
              >
                More on
                {' '}
                {snippet.label}
                <LucideArrowRight className="size-4" />
              </Link>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
