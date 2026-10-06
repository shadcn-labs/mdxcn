import { mdxExample } from "@/lib/docs/ascii"
import { comarkExample } from "@/lib/docs/comark"
import { knapExample } from "@/lib/docs/knap"
import { toMdxCopy } from "@/lib/docs/mdx"
import type { ComponentDoc, PropRow } from "@/lib/docs/catalog"

export const DESIGN_AND_MOOD = `Design
- Geist Mono. Dashed frame, plus-sign corners, title as [ TITLE ] on the top edge.
- One accent color: CSS variable --graph-accent. Unused rows recede with opacity (~0.4). Drawing graphs accept palette="mono" | "duo" | "multi" (default mono). duo uses --graph-accent-2 for the second series. multi cycles three accents. Do not invent extra hues.
- Glyphs do the drawing: █ ░ - = + ├ └ ✓. Borders are dashes, not SVG strokes. Do not use Recharts, canvas, or SVG.
- Numbers use tabular-nums and sit right-aligned.
- Motion is transform and opacity only, 220ms cubic-bezier(0.215, 0.61, 0.355, 1). Nothing loops or pulses. If prefers-reduced-motion, duration is 0. Timers still tick once a second as text.

Chooser
- a handful of numbers, no axis → GraphSpark
- a series with a y-scale → GraphPlot (columns of characters, not a line chart library)
- one fill from 0 to 1 → GraphMeter
- parts of a whole → GraphStack or GraphWaffle (not a pie)
- ok / slow / down days → GraphUptime
- actual vs target → GraphBullet
- before and after figures → GraphSlope
- a short ranked list → GraphRank (not Bars)
- one number plus a trend → GraphKpi
- two to four numbers, no trend → GraphStat
- elapsed, how long ago, or the time of day → GraphTimer
- time left until a date → GraphCountdown
- walking through a change → GraphFlow, then GraphTimeline
- pick A vs B → GraphCompare
- exact numbers on both axes → GraphMatrix
- a table with section titles → GraphSheet
- a punch list → GraphCheck
- what a PR did → GraphDiff, then GraphSlope
- overlapping work this week → GraphGantt

Host
- Notion, Linear, a README → the framed ASCII from the docs .md tab. Keep the fence so the + corners stay aligned. That is the figure, not the inner list.
- MDX that can register the parent → wrap markdown children in the parent tag. Register the parent once in mdx-components.tsx. No extra child imports. Props still work when the data is already in JavaScript.
- Plain Markdown (README, GitHub, PR comments) → same framed ASCII from /llms.txt ## MDX, or the docs Markdown tab. Swap labels, keep the frame. Do not invent ASCII. Do not paste JSX.
- Comark app (plain .md the app renders) → ::graph-* block from /llms.txt ## Comark, or the docs Comark tab. YAML props match the React API. Do not paste JSX. GitHub still gets fenced ASCII.
- Knap template (data → Markdown) → graph_* filter from /llms.txt ## Knap, or the docs Knap tab. Pipe the React props object. A string param is the title. Pass comark for a ::graph-* block. Wire graphFilters in createEngine; the Knap CLI does not load them.
- Reading an existing file: the figure is characters. Edit labels. Do not replace a graph with SVG.
- No fenced ASCII: GraphFlow, GraphPlot, GraphActivity, GraphHeatmap, GraphCalendar, GraphTimer, GraphCountdown, GraphFrame still copy as a framed box of the labels. They have a Comark block and a Knap filter (YAML) except GraphFrame.

Style
The figures are plain monospace text that sit next to prose, not illustrations. Use at most two graphs per section. Do not restyle the frame or add decoration. Use one accent unless a second series needs palette="duo" or "multi".`

export function installCli(origin: string, registry: string) {
  const host = origin || "<origin>"
  return `pnpm dlx shadcn@latest add ${host}/r/${registry}.json`
}

export function formatProps(props: PropRow[]) {
  return props
    .map((row) => {
      const fallback = row.default ? `, default ${row.default}` : ""
      return `- ${row.name} (${row.type}${fallback}): ${row.description}`
    })
    .join("\n")
}

type AgentPromptInput = {
  origin: string
  registry: string
  doc?: Pick<
    ComponentDoc,
    "title" | "name" | "description" | "dependencies" | "props" | "when" | "not"
  >
  example?: string
}

export function agentPrompt({
  origin,
  registry,
  doc,
  example,
}: AgentPromptInput) {
  const command = installCli(origin, registry)
  const deps = doc?.dependencies?.length
    ? doc.dependencies.map((item) => `\`${item}\``).join(", ")
    : "`motion`"

  if (!doc) {
    return `Register mdxcn so an MDX file can render framed figures.

${command}

These are source files, not an npm package. You need ${deps}. Files land under @/registry/default. Register the parents once in mdx-components.tsx. In the MDX file, wrap markdown children in the tag. In a README, paste the official fence.

${DESIGN_AND_MOOD}`
  }

  const usage = example
    ? `\nWrite\n\nPrefer markdown children. The same list is the figure.\n\n${example.trim()}\n\nWhen the file cannot run MDX (README, GitHub, Linear, a PR), paste this fence. Keep it. Swap labels.\n\n${toMdxCopy(example)}\n`
    : `\nImport\n\nimport { ${doc.name} } from "@/registry/default/${registry}/${registry}"\n\nRegister it once in mdx-components.tsx and wrap markdown children in the tag.\n`

  return `Add ${doc.name} (${doc.title}) so MDX can render it.

${command}

These are source files, not an npm package. You need ${deps}. Files land under @/registry/default. Register the parent once in mdx-components.tsx.

What it is
${doc.description}
${doc.when ? `\nWhen to use\n${doc.when}\n` : ""}${doc.not ? `\nSkip it when\n${doc.not}\n` : ""}${usage}
Props
These still work when the data is already in JavaScript. Prefer the children above.
${formatProps(doc.props)}

${DESIGN_AND_MOOD}`
}

type PageExample = {
  title: string
  description?: string
  code: string
}

export type PageCopy = {
  title: string
  description: string
  kicker?: string
  registry?: string
  doc?: Pick<
    ComponentDoc,
    | "title"
    | "name"
    | "description"
    | "dependencies"
    | "props"
    | "registry"
    | "when"
    | "not"
  >
  examples?: PageExample[]
  extra?: string
}

export function pageMarkdown({
  origin,
  title,
  description,
  kicker,
  registry,
  doc,
  examples,
  extra,
}: PageCopy & { origin: string }) {
  const parts = [`# ${title}`]

  if (kicker) {
    parts.push("", kicker)
  }

  parts.push("", description)

  const name = registry ?? doc?.registry
  if (name) {
    parts.push("", "## Install", "", installCli(origin, name))
    parts.push(
      "",
      "## Agent",
      "",
      agentPrompt({ origin, registry: name, doc, example: examples?.[0]?.code })
    )

    const mdx = mdxExample(name)
    if (mdx) {
      parts.push(
        "",
        "## MDX",
        "",
        "Plain Markdown (README, GitHub, Linear, PR comments). Paste the fence. Do not paste JSX.",
        "",
        mdx.markdown
      )
    }

    const comark = comarkExample(name)
    if (comark) {
      parts.push(
        "",
        "## Comark",
        "",
        "Plain .md that a Comark app will render. YAML props match the React API. GitHub still gets the MDX fence.",
        "",
        comark.markdown
      )
    }

    const knap = knapExample(name)
    if (knap) {
      parts.push(
        "",
        "## Knap",
        "",
        "Pipe the graph props through a Knap filter. Output is the official fence, or ::graph-* when the figure has no ASCII. Wire graphFilters. The Knap CLI does not load them.",
        "",
        knap.template,
        "",
        "```json",
        JSON.stringify(knap.variables, null, 2),
        "```",
        "",
        knap.markdown
      )
    }
  }

  if (examples && examples.length > 0) {
    parts.push("", "## Examples")
    for (const example of examples) {
      parts.push("", `### ${example.title}`)
      if (example.description) {
        parts.push("", example.description)
      }
      parts.push("", toMdxCopy(example.code))
    }
  }

  if (doc?.props.length) {
    parts.push("", "## Props", "")
    parts.push("| Prop | Type | Default | Description |")
    parts.push("| --- | --- | --- | --- |")
    for (const row of doc.props) {
      const fallback = row.default ?? "—"
      parts.push(
        `| ${row.name} | ${row.type} | ${fallback} | ${row.description} |`
      )
    }
  }

  if (extra) {
    parts.push("", extra.trim())
  }

  return parts.join("\n").replaceAll("$ORIGIN", origin || "<origin>")
}
