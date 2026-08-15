import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { appName, gitConfig } from './shared'

export type FrameworkFamily = 'react' | 'vue'
export type FrameworkId = 'react' | 'next' | 'next-pages' | 'react-router' | 'vue' | 'vue-router' | 'nuxt'

export interface Framework {
  id: FrameworkId
  family: FrameworkFamily
  title: string
  url: string
  /** Simple Icons slug */
  icon: string
  /** Official brand color, used as docs accent */
  color: string
}

export const frameworks: Framework[] = [
  {
    id: 'react',
    family: 'react',
    title: 'React',
    url: '/docs/react',
    icon: 'react',
    color: '#61DAFB',
  },
  {
    id: 'next',
    family: 'react',
    title: 'Next.js',
    url: '/docs/next',
    icon: 'nextdotjs',
    color: '#000000',
  },
  {
    id: 'next-pages',
    family: 'react',
    title: 'Next.js (pages router)',
    url: '/docs/next-pages',
    icon: 'nextdotjs',
    color: '#000000',
  },
  {
    id: 'react-router',
    family: 'react',
    title: 'React Router',
    url: '/docs/react-router',
    icon: 'reactrouter',
    color: '#F44250',
  },
  {
    id: 'vue',
    family: 'vue',
    title: 'Vue',
    url: '/docs/vue',
    icon: 'vuedotjs',
    color: '#42B883',
  },
  {
    id: 'vue-router',
    family: 'vue',
    title: 'Vue Router',
    url: '/docs/vue-router',
    icon: 'vuedotjs',
    color: '#4FC08D',
  },
  {
    id: 'nuxt',
    family: 'vue',
    title: 'Nuxt',
    url: '/docs/nuxt',
    icon: 'nuxt',
    color: '#00DC82',
  },
]

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  }
}
