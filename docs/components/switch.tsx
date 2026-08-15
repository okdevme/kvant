import type { LoaderConfig, LoaderOutput, Page } from 'fumadocs-core/source'
import type { ReactNode } from 'react'
import type { FrameworkId } from '@/lib/layout.shared'
import { Children, isValidElement } from 'react'
import { frameworks } from '@/lib/layout.shared'

export type CaseProps = {
  [key in FrameworkId]?: boolean
} & {
  children?: ReactNode
}

export function createBoundSwitch<C extends LoaderConfig>(source: LoaderOutput<C>, page: Page | C['page']) {
  function Switch(props: CaseProps) {
    const framework = frameworks.find(f => f.id === page.slugs[0])

    if (!framework)
      return

    const cases = frameworks.some(f => props[f.id])
      ? [<Case key="case" {...props} />]
      // eslint-disable-next-line react/no-children-to-array
      : Children.toArray(props.children)
          .filter(child => isValidElement<CaseProps>(child))

    const caseNode = cases.find(item => framework.id in item.props)
      ?? cases.find(item => framework.family in item.props)

    if (caseNode?.props[framework.id] !== false)
      return caseNode?.props.children
  }

  function Case(props: CaseProps) {
    return props.children
  }

  return { Switch, Case }
}
