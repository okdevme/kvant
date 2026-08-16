import type { LayoutTab } from 'fumadocs-ui/layouts/shared'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { FrameworkIcon } from '@/components/framework-icon'
import { frameworks } from '@/lib/frameworks'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

const tabs: LayoutTab[] = frameworks.map(framework => ({
  title: framework.title,
  url: framework.url,
  icon: (
    <FrameworkIcon
      id={framework.id}
      className="w-full h-full"
    />
  ),
}))

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()} tabs={tabs}>
      {children}
    </DocsLayout>
  )
}
