import type { ComponentDoc } from "@/lib/docs/catalog"
import { COMARK_PROPS } from "@/lib/docs/comark-props"
import { toComarkBlock } from "@/lib/docs/yaml"
import { SITE_URL } from "@/lib/site"

export const COMARK_URL = "https://comark.dev"
export const COMARK_DEMO_URL = "https://comark-demo.vercel.app"
export const COMARK_DEMO_REPO = "https://github.com/atinux/comark-demo"

export const COMARK_DESCRIPTION =
  "Write figures as ::graph-* blocks in plain Markdown. Comark parses the file and these graphs draw the frames, with no MDX compile step."

export const COMARK_SKIP_SLUGS = ["graph-frame"] as const

/** Graphs and content blocks. Content carries its data as a Markdown body. */
export function isComarkSlug(slug: string) {
  return (
    !(COMARK_SKIP_SLUGS as readonly string[]).includes(slug) &&
    slug in COMARK_PROPS
  )
}

export function comarkExample(slug: string) {
  if (!isComarkSlug(slug)) return null
  const props = COMARK_PROPS[slug]
  if (!props) return null
  return { markdown: toComarkBlock(slug, props), props }
}

export function catalogNumericProps(type: string) {
  return type === "number" || type === "0 | 1" || type.startsWith("number |")
}

export const COMARK_WIRE = `import { parseMarkdown } from "comark"
import { MarkdownDocument } from "@comark/react"
import { graphComponents } from "@/registry/default/graph-comark/graph-comark"

const doc = await parseMarkdown(source)

<MarkdownDocument components={graphComponents} value={doc.document} />`

export function comarkChooserSection(
  items: Pick<ComponentDoc, "slug" | "name" | "title">[],
  origin = SITE_URL
) {
  const host = origin || SITE_URL
  const blocks = items
    .filter((item) => isComarkSlug(item.slug))
    .map((item) => {
      const example = comarkExample(item.slug)
      if (!example) return ""
      return `### ${item.title} (\`${item.name}\`, \`${item.slug}\`)

${host}/docs/${item.slug}

${example.markdown}`
    })
    .filter(Boolean)
    .join("\n\n")

  return `## Comark

Plain \`.md\` that a Comark app will render. Paste a \`::graph-*\` block. YAML props match the React API. You can also write the block body in the same Markdown grammar MDX children use. Content blocks (\`::callout\`, \`::steps\`, \`::chat\`, …) always take a Markdown body. Do not paste JSX. GitHub and Linear do not run Comark, so they still need the fenced ASCII from ## MDX.

Install the adapter after the graphs:

pnpm dlx shadcn@latest add @mdxcn/graph-comark

Wiring: ${host}/docs/comark
Landing: ${host}/comark
Demo: ${COMARK_DEMO_URL}

${blocks}`
}

export const COMARK_DEMO_SOURCE = `p95 crossed 800ms at 14:02. Rollback at 14:11.

::graph-timeline
---
title: NIGHT
events:
  - { date: "14:02", label: "p95 crossed 800ms" }
  - { date: "14:11", label: "rolled back the cache flag", state: now }
  - { date: "14:40", label: "write the postmortem", state: next }
---
::

Same night. Two days users felt it.

::graph-uptime
---
title: API
from: Aug 14
to: Aug 27
days: [ok, ok, ok, ok, ok, degraded, ok, ok, down, down, ok, ok, ok, ok]
---
::`
