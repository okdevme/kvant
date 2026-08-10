import type { ComponentType, MouseEvent, ReactNode } from 'react'
import { useSyncExternalStore } from 'react'

// Minimal client-side router: history API + popstate.

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

function usePath() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => '/',
  )
}

export function Link({ to, children }: { to: string, children: ReactNode }) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.history.pushState(null, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  return <a href={to} onClick={onClick}>{children}</a>
}

export function Route({ path, component: Component }: { path: string, component: ComponentType }) {
  const current = usePath()
  if (current !== path)
    return null
  return <Component />
}

export function Switch({ children }: { children: ReactNode }) {
  return <>{children}</>
}
