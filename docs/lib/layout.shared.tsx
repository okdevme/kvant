import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { appName, gitConfig } from './shared'

export type FrameworkFamily = 'react' | 'vue'
export type FrameworkId = 'react' | 'next' | 'next-pages' | 'react-router' | 'vue' | 'vue-router' | 'nuxt'

export interface Framework {
  id: FrameworkId
  family: FrameworkFamily
  title: string
  url: string
}

export const frameworks: Framework[] = [
  {
    id: 'react',
    family: 'react',
    title: 'React',
    url: '/docs/react',
  },
  {
    id: 'next',
    family: 'react',
    title: 'Next.js (app router)',
    url: '/docs/next',
  },
  {
    id: 'next-pages',
    family: 'react',
    title: 'Next.js (pages router)',
    url: '/docs/next-pages',
  },
  {
    id: 'react-router',
    family: 'react',
    title: 'React Router',
    url: '/docs/react-router',
  },
  {
    id: 'vue',
    family: 'vue',
    title: 'Vue',
    url: '/docs/vue',
  },
  {
    id: 'vue-router',
    family: 'vue',
    title: 'Vue Router',
    url: '/docs/vue-router',
  },
  {
    id: 'nuxt',
    family: 'vue',
    title: 'Nuxt',
    url: '/docs/nuxt',
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
