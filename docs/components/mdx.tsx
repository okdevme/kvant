import type { MDXComponents } from 'mdx/types'
import * as Twoslash from 'fumadocs-twoslash/ui'
import { createGenerator } from 'fumadocs-typescript'
import { AutoTypeTable } from 'fumadocs-typescript/ui'
import defaultMdxComponents from 'fumadocs-ui/mdx'

const generator = createGenerator()

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    AutoTypeTable: (props: Omit<React.ComponentProps<typeof AutoTypeTable>, 'generator'>) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    ...Twoslash,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
