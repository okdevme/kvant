import type { LayoutTab } from 'fumadocs-ui/layouts/shared'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { FrameworkIcon } from '@/components/framework-icon'
import { frameworks } from '@/lib/frameworks'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

function getPageAlts(page: (typeof source)['$inferPage']) {
  return [page.slugs.at(-1)!, ...(page.data.alt?.split(',') ?? [])]
}

export default async function Layout({ children, params }: LayoutProps<'/docs/[...slug]'>) {
  const { slug: slugs = [] } = await params

  const currentPage = source.getPage(slugs)
  const currentPageAlts = currentPage ? getPageAlts(currentPage) : []

  const pages = source.getPages()

  const tabs: LayoutTab[] = frameworks.map(framework => ({
    title: framework.title,
    url: pages.find(
      page => page.data.framework === framework.id
        && page.slugs.length === slugs.length
        && page.slugs.every((slug, i) => {
          if (i === 0)
            return true
          if (i === slugs.length - 1)
            return getPageAlts(page).some(slug => currentPageAlts.includes(slug))
          return slug === slugs[i]
        }),
    )?.url ?? source.getPage([framework.id])!.url,
    icon: (
      <FrameworkIcon
        id={framework.id}
        className="w-full h-full layout-tab-icon"
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
