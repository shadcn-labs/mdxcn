export const MDX_DESCRIPTION =
  "Wrap your MDX components in withMdxcn. Tags you swap still parse, GitHub alerts become Callouts, a byline makes a Quote, console fences become Terminals, and footnotes get a frame."

export const MDX_WIRE = `// mdx-components.tsx
import type { MDXComponents } from "mdx/types"
import { withMdxcn } from "@/registry/default/mdx/mdx"
import { GraphTimeline } from "@/registry/default/graph-timeline/graph-timeline"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return withMdxcn({ ...components, GraphTimeline })
}`

export const MDX_OPTIONS = `withMdxcn(components, {
  alerts: true, // > [!WARNING] → Callout
  quotes: true, // > … — Name → Quote
  terminals: true, // \`\`\`console → Terminal
  footnotes: true, // [^1] → Footnotes
})`

export const MDX_OVERRIDE = `// Fumadocs, Nextra, or your own map
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return withMdxcn({
    ...defaultMdxComponents, // swaps table, pre, h1–h6
    li: ListItem,
    ...components,
    GraphTimeline,
  })
}`

export const MDX_BEFORE = `> [!WARNING]
> The CLI copies files. Edit the source.

> Less, but better.
> — Dieter Rams

\`\`\`console
$ pnpm dlx shadcn@latest add @mdxcn/mdx
✓ 7 files written
\`\`\`

Glyphs, not SVG.[^1]

[^1]: SVG does not survive a README.`

export const MDX_WHY = `Docs frameworks swap tags for their own components (li: ListItem, table: Table, h3: Heading). A graph reads its children by tag, so a swapped li looks like an unknown component and the list renders empty. withMdxcn marks each swap so the graphs still see the tag. It works under React Server Components too: the mark rides on a data-graph-host prop.`
