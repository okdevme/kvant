import type { LayoutTab } from 'fumadocs-ui/layouts/shared'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { FrameworkIcon } from '@/components/framework-icon'
import { frameworks } from '@/lib/frameworks'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export default async function Layout({ children, params }: LayoutProps<'/docs/[[...slug]]'>) {
  const { slug = [] } = await params

  const tabs: LayoutTab[] = frameworks.map(framework => ({
    title: framework.title,
    url: source.getPage([framework.id, ...slug.slice(1)])?.url
      ?? source.getPage([framework.id])!.url,
    icon: (
      <FrameworkIcon
        id={framework.id}
        className="w-full h-full"
      />
    ),
  }))

  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      tabs={tabs}
    >
      {children}
    </DocsLayout>
  )
}
