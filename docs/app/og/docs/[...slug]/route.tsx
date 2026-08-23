import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { KvantLogo } from '@/components/branding'
import { FrameworkIcon } from '@/components/framework-icon'
import { getFramework } from '@/lib/frameworks'
import { generate as DefaultImage } from '@/lib/og'
import { getPageImageUrl, source } from '@/lib/source'

export const revalidate = false

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page)
    notFound()

  const framework = getFramework(page.data.framework)!

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      icon={<KvantLogo height="64px" />}
      primaryColor="#dce0df"
      primaryTextColor="#dce0df"
      before={(
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <FrameworkIcon
            id={framework.id}
            height="48px"
            width="48px"
            style={{ flexShrink: 0 }}
          />
          <span>{framework.title}</span>
        </div>
      )}
    />,
    {
      width: 1200,
      height: 630,
    },
  )
}

export function generateStaticParams() {
  return source.getPages().map(page => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }))
}
