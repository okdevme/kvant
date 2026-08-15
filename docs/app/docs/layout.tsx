import type { LayoutTab } from 'fumadocs-ui/layouts/shared'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { FrameworkAccent } from '@/components/framework-accent'
import { FrameworkIcon } from '@/components/framework-icon'
import { baseOptions, frameworks } from '@/lib/layout.shared'
import { source } from '@/lib/source'

const tabs: LayoutTab[] = frameworks.map(framework => ({
  title: framework.title,
  url: framework.url,
  icon: <FrameworkIcon icon={framework.icon} />,
}))

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()} tabs={tabs}>
      <FrameworkAccent />
      {children}
    </DocsLayout>
  )
}
