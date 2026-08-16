import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { KvantLogo } from '@/components/branding'
import { gitConfig } from './shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <KvantLogo className="h-8" />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  }
}
