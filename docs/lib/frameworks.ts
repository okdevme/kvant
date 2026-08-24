import * as kv from 'kvantjs/schema'

export type FrameworkFamily = 'react' | 'vue'
export type FrameworkId = 'react' | 'next' | 'next-pages' | 'react-router' | 'vue' | 'vue-router' | 'nuxt'

export interface Framework {
  id: FrameworkId
  family: FrameworkFamily
  title: string
}

export const frameworks: Framework[] = [
  {
    id: 'react',
    family: 'react',
    title: 'React',
  },
  {
    id: 'next',
    family: 'react',
    title: 'Next.js (app router)',
  },
  {
    id: 'next-pages',
    family: 'react',
    title: 'Next.js (pages router)',
  },
  {
    id: 'react-router',
    family: 'react',
    title: 'React Router',
  },
  {
    id: 'vue',
    family: 'vue',
    title: 'Vue',
  },
  {
    id: 'vue-router',
    family: 'vue',
    title: 'Vue Router',
  },
  {
    id: 'nuxt',
    family: 'vue',
    title: 'Nuxt',
  },
]

export const defaultFramework = frameworks.find(f => f.id === 'next')!

export const frameworkIds = frameworks.map(f => f.id)

export const frameworkCookieName = 'kvant.framework'
export const frameworkCookieSchema = kv.enum(frameworkIds).default(defaultFramework.id)

export function getFramework(id: string | undefined): Framework | undefined {
  return frameworks.find(f => f.id === id)
}
