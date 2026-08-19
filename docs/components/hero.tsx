'use client'

import type { Framework, FrameworkId } from '@/lib/frameworks'
import { useElementBounding } from '@reactuses/core'
import { animate, createTimeline, stagger, waapi } from 'animejs'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover'
import { useTheme } from 'fumadocs-ui/provider/base'
import { Check, ChevronsUpDown, LucideArrowRight, LucideBookOpen, LucideRocket } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { defaultFramework, frameworks } from '@/lib/frameworks'
import { KvantIcon, KvantTitle } from './branding'
import { FrameworkIcon } from './framework-icon'
import WaveArcs from './wave-arcs'

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

interface Snippet {
  label: string
  lang: string
  code: string
}

const reactLocalStorage: Snippet = {
  label: 'Local Storage',
  lang: 'tsx',
  code: `import { useLocalStorage } from 'kvant/react'
import * as kv from 'kvant/schema'

const [theme, setTheme] = useLocalStorage(
  'theme',
  kv.enum(['light', 'dark']).default('light'),
)

// persists across reloads, syncs across tabs
setTheme('dark')`,
}

const reactCookies: Snippet = {
  label: 'Cookies',
  lang: 'tsx',
  code: `import { useCookies } from 'kvant/react'
import * as kv from 'kvant/schema'

const [consent, setConsent] = useCookies(
  'consent',
  kv.stringbool().default(false),
  { maxAge: 60 * 60 * 24 * 365 },
)

// readable by the server — respects Set-Cookie attributes
setConsent(true)`,
}

const vueLocalStorage: Snippet = {
  label: 'Local Storage',
  lang: 'ts',
  code: `import { useLocalStorage } from 'kvant/vue'
import * as kv from 'kvant/schema'

const theme = useLocalStorage(
  'theme',
  kv.enum(['light', 'dark']).default('light'),
)

// persists across reloads, syncs across tabs
theme.value = 'dark'`,
}

const vueCookies: Snippet = {
  label: 'Cookies',
  lang: 'ts',
  code: `import { useCookies } from 'kvant/vue'
import * as kv from 'kvant/schema'

const consent = useCookies('consent', kv.stringbool().default(false), {
  maxAge: 60 * 60 * 24 * 365,
})

// readable by the server — respects Set-Cookie attributes
consent.value = true`,
}

const snippets: Record<FrameworkId, Snippet[]> = {
  'react': [
    {
      label: 'Search Params',
      lang: 'tsx',
      code: `import { useSearchParams } from 'kvant/react'
import * as kv from 'kvant/schema'

export function SearchBar() {
  const [query, setQuery] = useSearchParams('q', kv.string().default(''))

  // /products?q=shoes → query === 'shoes'
  return <input value={query} onChange={e => setQuery(e.target.value)} />
}`,
    },
    reactLocalStorage,
    reactCookies,
  ],
  'next': [
    {
      label: 'Search Params',
      lang: 'tsx',
      code: `import { useSearchParams } from 'kvant/next'
import * as kv from 'kvant/schema'

export function SearchBar() {
  const [query, setQuery] = useSearchParams('q', kv.string().default(''), {
    shallow: false, // re-run server components on change
  })

  return <input value={query} onChange={e => setQuery(e.target.value)} />
}`,
    },
    reactLocalStorage,
    reactCookies,
  ],
  'next-pages': [
    {
      label: 'Router Query',
      lang: 'tsx',
      code: `import { useRouterQuery } from 'kvant/next/pages'
import * as kv from 'kvant/schema'

export function SearchBar() {
  const [query, setQuery] = useRouterQuery('q', kv.string().default(''), {
    shallow: false, // re-run getServerSideProps on change
  })

  return <input value={query} onChange={e => setQuery(e.target.value)} />
}`,
    },
    reactLocalStorage,
    reactCookies,
  ],
  'react-router': [
    {
      label: 'Search Params',
      lang: 'tsx',
      code: `import { useSearchParams } from 'kvant/react-router'
import * as kv from 'kvant/schema'

export function SearchBar() {
  const [query, setQuery] = useSearchParams('q', kv.string().default(''))

  // ?q=shoes → query === 'shoes'
  return <input value={query} onChange={e => setQuery(e.target.value)} />
}`,
    },
    reactLocalStorage,
    reactCookies,
  ],
  'vue': [
    {
      label: 'Search Params',
      lang: 'ts',
      code: `import { useSearchParams } from 'kvant/vue'
import * as kv from 'kvant/schema'

const query = useSearchParams('q', kv.string().default(''))

// ?q=shoes → query.value === 'shoes'
query.value = 'boots' // writes back to the URL`,
    },
    vueLocalStorage,
    vueCookies,
  ],
  'vue-router': [
    {
      label: 'Route Query',
      lang: 'ts',
      code: `import { useRouteQuery } from 'kvant/vue-router'
import * as kv from 'kvant/schema'

const query = useRouteQuery('q', kv.string().default(''))

// ?q=shoes → query.value === 'shoes'
query.value = 'boots' // writes back to the URL`,
    },
    {
      label: 'Route Params',
      lang: 'ts',
      code: `import { useRouteParams } from 'kvant/vue-router'
import * as kv from 'kvant/schema'

// /users/42 → id.value === 42
const id = useRouteParams('id', kv.number().int().min(1))`,
    },
    vueLocalStorage,
    vueCookies,
  ],
  'nuxt': [
    {
      label: 'Route Query',
      lang: 'ts',
      code: `import { useRouteQuery } from 'kvant/nuxt'
import * as kv from 'kvant/schema'

const query = useRouteQuery('q', kv.string().default(''))

// ?q=shoes → query.value === 'shoes'
query.value = 'boots' // writes back to the URL`,
    },
    {
      label: 'Route Params',
      lang: 'ts',
      code: `import { useRouteParams } from 'kvant/nuxt'
import * as kv from 'kvant/schema'

// /users/42 → id.value === 42
const id = useRouteParams('id', kv.number().int().min(1))`,
    },
    vueLocalStorage,
    {
      label: 'Cookies',
      lang: 'ts',
      code: `import { useCookies } from 'kvant/nuxt'
import * as kv from 'kvant/schema'

// SSR-ready out of the box (built on Nuxt's useCookie)
const locale = useCookies('locale', kv.string().default('en'))`,
    },
  ],
}

function FrameworkSelect({
  className,
  value,
  onChange,
}: {
  className?: string
  value: Framework
  onChange: (framework: Framework) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          'flex w-full items-center gap-2 rounded-xl p-2 border bg-fd-secondary/50 text-start text-fd-secondary-foreground transition-colors',
          'hover:bg-fd-accent data-[popup-open]:bg-fd-accent data-[popup-open]:text-fd-accent-foreground',
          className,
        )}
      >
        <div className="size-5 shrink-0 flex items-center justify-center">
          <FrameworkIcon id={value.id} className="size-full" />
        </div>
        <p className="text-sm font-medium">{value.title}</p>
        <ChevronsUpDown className="shrink-0 ms-auto size-4 text-fd-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-1 w-(--anchor-width) p-1 fd-scroll-container">
        {frameworks.map((framework) => {
          const isActive = framework.id === value.id
          return (
            <button
              key={framework.id}
              type="button"
              onClick={() => {
                onChange(framework)
                setOpen(false)
              }}
              className="flex items-center gap-2 rounded-lg p-1.5 text-start hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <div className="shrink-0 size-5 md:mb-auto flex items-center justify-center">
                <FrameworkIcon id={framework.id} className="size-full" />
              </div>
              <p className="text-sm font-medium leading-none">{framework.title}</p>
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

export function Hero() {
  const [framework, setFramework] = useState<Framework>(defaultFramework)
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== 'light'
  const list = snippets[framework.id]

  const containerRef = useRef<HTMLDivElement>(null)
  const containerPos = useElementBounding(containerRef)
  const iconRef = useRef<HTMLDivElement>(null)
  const iconPos = useElementBounding(iconRef)

  const lineCount = 50
  const lineLengthsRef = useRef<{ value: number }[] | null>(null)
  useEffect(() => {
    lineLengthsRef.current = Array.from({ length: lineCount }, () => ({ value: 0 }))

    const tl = createTimeline()
      .sync(animate(lineLengthsRef.current!, {
        value: 1,
        duration: 1000,
        ease: 'inOutSine',
        delay: stagger(50, { reversed: true }),
      }), 0)
      .sync(waapi.animate('.anim-icon', {
        scale: [1.3, 1],
        opacity: [0, 1],
        duration: 900,
        ease: 'outBack(3)',
      }), 400)
      .sync(waapi.animate('.anim-supporter', {
        opacity: { from: 0, to: 1, ease: 'outExpo' },
        y: { from: stagger([-3, -10]) },
        duration: 700,
        ease: 'outExpo',
        delay: stagger(100),
      }), '<-=200')

    return () => void tl.cancel()
  }, [])

  return (
    <section className="relative flex min-h-[calc(100dvh-14rem)] flex-1 flex-col items-center justify-center px-6 py-20 isolate">
      <div className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <div ref={containerRef} className="pointer-events-none absolute -z-10 -top-14 left-0 w-full h-[calc(100%+var(--spacing)*14)]">
          <WaveArcs
            alpha
            backgroundColor="transparent"
            lineColor={dark ? '#dce0df' : '#231f20'}
            lineLength={i => lineLengthsRef.current?.[i]?.value ?? 1}
            offset={{ y: iconPos.y + iconPos.height / 2 - containerPos.y }}
          />
        </div>

        <div ref={iconRef} className="relative z-10 isolate contain-layout opacity-0 anim-icon">
          <div className="absolute -z-1 top-1/2 left-1/2 -translate-1/2 size-128 pointer-events-none bg-radial-[at_50%_50%] from-fd-background from-15% to-transparent to-40%" />
          <KvantIcon className="relative size-32" />
        </div>

        <KvantTitle className="text-6xl opacity-0 anim-supporter" />

        <p className="max-w-md text-fd-muted-foreground text-md opacity-0 anim-supporter">
          Universal, type-safe state manager
          for&nbsp;
          <span className="font-semibold text-fd-primary">key&#8209;value&nbsp;interfaces</span>
        </p>

        <div className="w-full flex flex-wrap items-stretch justify-center gap-3 flex-col xs:flex-row xs:items-center opacity-0 anim-supporter">
          <Link href="/docs" className={cn(buttonVariants({ color: 'primary' }), 'gap-2 px-4 rounded-full')}>
            <LucideBookOpen className="size-5" />
            Documentation
          </Link>
          <Link
            href="/docs/next/quick-start"
            className={cn(buttonVariants({ color: 'secondary' }), 'gap-2 px-4 rounded-full')}
          >
            <LucideRocket className="size-5" />
            Quick Start
          </Link>
          <a
            href="https://github.com/okdevme/kvant"
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ color: 'outline' }), 'gap-2 rounded-full')}
          >
            <GithubIcon className="size-4" />
            <span className="xs:hidden">GitHub</span>
          </a>
        </div>

        <div className="mt-4 flex w-full flex-col items-center gap-2 text-start h-75">
          <FrameworkSelect
            className="opacity-0 anim-supporter"
            value={framework}
            onChange={setFramework}
          />
          <Tabs
            key={framework.id}
            items={list.map(s => s.label)}
            className="rounded-xl border bg-fd-card my-0 w-full shrink-0 opacity-0 anim-supporter"
          >
            {list.map(snippet => (
              <Tab key={snippet.label} value={snippet.label}>
                <DynamicCodeBlock
                  lang={snippet.lang}
                  code={snippet.code}
                  codeblock={{ className: 'border-0 rounded-none shadow-none' }}
                />
              </Tab>
            ))}
          </Tabs>
          <Link
            href="/docs/next/quick-start"
            className={cn(buttonVariants({ color: 'ghost' }), 'gap-2 px-4 rounded-full opacity-0 anim-supporter')}
          >
            More on
            {' '}
            {'{{interface}}'}
            <LucideArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
