import { icons } from '@iconify-json/simple-icons'

interface SimpleIconData {
  body: string
  height?: number
  width?: number
}

function getIcon(slug: string): SimpleIconData | undefined {
  return (icons.icons as Record<string, SimpleIconData>)[slug]
}

export function FrameworkIcon({ icon }: { icon: string }) {
  const data = getIcon(icon)
  if (!data)
    return null

  return (
    <svg
      role="img"
      viewBox={`0 0 ${data.width ?? 24} ${data.height ?? 24}`}
      width="18px"
      height="18px"
      fill="currentColor"
      // Icon data comes from the bundled @iconify-json/simple-icons package (trusted, build-time)
      dangerouslySetInnerHTML={{ __html: data.body }}
    />
  )
}
