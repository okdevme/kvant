import type { Nodes, Parents, Root } from 'mdast'
import type { MdxJsxAttribute, MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { frameworks, getFramework } from './frameworks'

/**
 * Remark plugin that resolves `<Switch>`/`<Case>` at build time.
 *
 * Mirrors the runtime React components (`components/switch.tsx`): the current
 * framework comes from the page's `framework` frontmatter (schema extended in
 * `lib/source.ts`), cases match by framework id first, then by family.
 * A case carrying the current framework id set to `false` renders nothing.
 *
 * Runs after fumadocs-mdx `remarkInclude`, so `<Switch>` blocks inside
 * included partials (`content/docs/_shared`) resolve with the including
 * page's frontmatter. Pages without a resolvable `framework` frontmatter
 * are left untouched — the runtime React components stay in charge there.
 */

type JsxElement = MdxJsxFlowElement | MdxJsxTextElement

function isJsxElement(node: Nodes): node is JsxElement {
  return (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement')
    && typeof (node as JsxElement).name === 'string'
}

function readProps(node: JsxElement): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  for (const attr of node.attributes as (MdxJsxAttribute | null)[]) {
    if (!attr || attr.type !== 'mdxJsxAttribute')
      continue
    if (attr.value == null)
      props[attr.name] = true
    else if (typeof attr.value === 'string')
      props[attr.name] = attr.value
    else
      props[attr.name] = attr.value.value !== 'false'
  }
  return props
}

export const remarkSwitch: Plugin<[], Root> = () => {
  return (tree, file) => {
    const { framework: id } = (file.data.frontmatter ?? {}) as Record<string, unknown>
    const framework = getFramework(typeof id === 'string' ? id : undefined)
    if (!framework)
      return

    const resolve = (node: JsxElement): Nodes[] => {
      const props = readProps(node)

      // `<Switch react>…</Switch>` — the Switch itself acts as a single Case
      const cases = frameworks.some(f => f.id in props)
        ? [{ props, children: node.children }]
        : node.children
            .filter(isJsxElement)
            .map(child => ({ props: readProps(child), children: child.children }))

      const match = cases.find(item => framework.id in item.props)
        ?? cases.find(item => framework.family in item.props)

      if (!match || match.props[framework.id] === false)
        return []
      return match.children
    }

    visit(tree as Parents, (node, index, parent) => {
      if (!parent || typeof index !== 'number' || !isJsxElement(node) || node.name !== 'Switch')
        return
      parent.children.splice(index, 1, ...resolve(node) as Parents['children'])
      return index
    })
  }
}
