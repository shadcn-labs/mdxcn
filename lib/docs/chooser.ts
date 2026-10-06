import type { ComponentDoc } from "@/lib/docs/catalog"
import { MDX_SKIP_SLUGS, isMdxSlug, mdxExample } from "@/lib/docs/ascii"
import { comarkChooserSection } from "@/lib/docs/comark"
import { grammarMarkdown } from "@/lib/docs/grammar"
import { knapChooserSection } from "@/lib/docs/knap"
import { recipesMarkdown } from "@/lib/docs/recipes"
import { SITE_URL } from "@/lib/site"

export const CHOOSER: Record<string, { when: string; not: string }> = {
  callout: {
    when: "Good for an aside the reader should not skip, like a caveat, a tip, or a breaking change.",
    not: "A quote is Quote. A list of steps is Steps.",
  },
  quote: {
    when: "Good for one sentence someone else said, with a name under it.",
    not: "Your own caveat is Callout.",
  },
  steps: {
    when: "Good for a procedure (install, migrate, release) with one step marked now.",
    not: "Dated events are Timeline. A punch list with done boxes is Check.",
  },
  terminal: {
    when: "Good for a command and what it printed.",
    not: "Source code is a fenced code block. A file tree is Tree.",
  },
  changelog: {
    when: "Good for one release: what was added, changed, fixed, removed.",
    not: "Bundle or headcount deltas with numbers are Diff.",
  },
  annotate: {
    when: "Good for a code sample where three lines need explaining.",
    not: "A shell session is Terminal. Code with nothing to explain is a plain fence.",
  },
  decision: {
    when: "Good for an ADR or a tradeoff: what you picked, what you didn't, and why.",
    not: "Features across plans are Compare. Ratings are Score.",
  },
  chat: {
    when: "Good for an agent session, a support thread, or an interview excerpt.",
    not: "One line someone said is Quote. Commands and output are Terminal.",
  },
  env: {
    when: "Good for the variables a project needs, which are required, and what they do.",
    not: "Label/value rows that are not variables are Spec.",
  },
  endpoint: {
    when: "Good for one API route: method, path, params, a response.",
    not: "Many routes in one place are Sheet. A shell session is Terminal.",
  },
  keys: {
    when: "Good for keyboard shortcuts, a cheat sheet, or a key combo in a tutorial.",
    not: "Label/value rows are Spec.",
  },
  faq: {
    when: "Good for questions people keep asking, with the answer under each.",
    not: "A procedure is Steps. One caveat is Callout.",
  },
  "graph-table": {
    when: "Good when the numbers belong in a spreadsheet.",
    not: "Grouped sections are Sheet. Label/value rows are Spec.",
  },
  "graph-sheet": {
    when: "Good when a table needs section titles, like an API, an RFC, or a spec with groups.",
    not: "A flat table is Table. Label/value rows are Spec.",
  },
  "graph-flow": {
    when: "Good for a pipeline, a request path, or walking through a change.",
    not: "A dated list is Timeline. A schedule with start and end is Gantt.",
  },
  "graph-bars": {
    when: "Good for a before and after, or any two small histograms.",
    not: "A ranked list is Rank.",
  },
  "graph-rank": {
    when: "Good for traffic, coverage, or anything you'd sort highest first.",
    not: "Two histograms side by side is Bars. A table of numbers is Table.",
  },
  "graph-cells": {
    when: "Good for a small grid of filled and empty cells.",
    not: "A share of a hundred cells is Waffle. A year of days is Activity.",
  },
  "graph-meter": {
    when: "Good for one value between 0 and 1, shown as a fill.",
    not: "Actual versus a target is Bullet. Parts of a whole is Stack.",
  },
  "graph-spark": {
    when: "Good for a handful of numbers when you don't need an axis.",
    not: "If you need a y-scale, use Plot.",
  },
  "graph-kpi": {
    when: "Good when one number is the headline and the rest is context.",
    not: "Several numbers with no trend is Stat.",
  },
  "graph-tree": {
    when: "Good for nested files or an org chart.",
    not: "A timeline or a table.",
  },
  "graph-timeline": {
    when: "Good for steps in order, with one marked as current.",
    not: "A punch list is Check. A schedule with start and end is Gantt.",
  },
  "graph-check": {
    when: "Good for a punch list. Done is [x], the rest stay [ ].",
    not: "Dated steps are Timeline.",
  },
  "graph-stack": {
    when: "Good for parts of a whole on one track.",
    not: "There is no pie chart. Use Waffle if you want a share of cells.",
  },
  "graph-funnel": {
    when: "Good for steps that get narrower as people drop off.",
    not: "A ranked list is Rank. A process diagram is Flow.",
  },
  "graph-gantt": {
    when: "Good for work that overlaps on a shared calendar.",
    not: "A dated log is Timeline.",
  },
  "graph-board": {
    when: "Good for a roadmap or a sprint: now, next, later, or todo, doing, done.",
    not: "One list of done boxes is Check. Dated events are Timeline.",
  },
  "graph-score": {
    when: "Good for a review, an eval, or a vendor pick scored out of five.",
    not: "Actual versus a target is Bullet. A ranked list of numbers is Rank.",
  },
  "graph-plot": {
    when: "Good when the series needs a y-scale.",
    not: "A handful of points with no axis is Spark.",
  },
  "graph-waffle": {
    when: "Good for a share shown as a grid of about a hundred cells.",
    not: "Labeled parts of a whole is Stack.",
  },
  "graph-diff": {
    when: "Good for showing what was added, removed, or kept.",
    not: "A list of numeric before and after is Slope.",
  },
  "graph-invoice": {
    when: "Good for from, bill-to, line items, and totals.",
    not: "A generic table is Table.",
  },
  "graph-compare": {
    when: "Good for putting two options side by side.",
    not: "Exact numbers on both axes are Matrix. Numeric ranks are Rank.",
  },
  "graph-matrix": {
    when: "Good when both axes are labels and the cells are exact numbers.",
    not: "Intensities are Heatmap. Yes/no features are Compare.",
  },
  "graph-stat": {
    when: "Good for two to four large numbers, with no sparkline.",
    not: "One number with a trend is KPI. A live clock is Timer.",
  },
  "graph-spec": {
    when: "Good for aligned label and value rows, like a spec sheet.",
    not: "Large headline numbers are Stat. A table with headers is Table. Grouped sections are Sheet.",
  },
  "graph-activity": {
    when: "Good for daily counts over months, like a contribution grid.",
    not: "One month of marks is Calendar. Up or down days is Uptime.",
  },
  "graph-heatmap": {
    when: "Good for a labeled grid of intensities.",
    not: "Exact numbers on both axes are Matrix. A contribution calendar is Activity.",
  },
  "graph-calendar": {
    when: "Good for one month with a few days marked.",
    not: "A year of activity is Activity.",
  },
  "graph-waterfall": {
    when: "Good for a running total as floating bars.",
    not: "Parts of a whole is Stack.",
  },
  "graph-uptime": {
    when: "Good for a status per day, or the blast radius of an outage.",
    not: "A heatmap or an activity grid.",
  },
  "graph-slope": {
    when: "Good for a before and after number on each row.",
    not: "Two bar groups is Bars. A ranked list is Rank.",
  },
  "graph-bullet": {
    when: "Good when a number has a goal sitting on the same track.",
    not: "A single fill from 0 to 1 is Meter.",
  },
  "graph-timer": {
    when: "Good for uptime, last deploy, or a clock in the corner.",
    not: "Time left until a date is Countdown. A static number is Stat.",
  },
  "graph-countdown": {
    when: "Good for a freeze, a launch, or a window that closes.",
    not: "Elapsed time since a start is Timer.",
  },
  "graph-frame": {
    when: "Good when you're putting together a custom figure.",
    not: "If the chart already exists, install that one instead.",
  },
}

export function chooserMarkdown(
  items: Pick<
    ComponentDoc,
    "slug" | "name" | "title" | "description" | "mdx"
  >[],
  origin = SITE_URL
) {
  const host = origin || SITE_URL
  const rows = items
    .filter((item) => item.slug !== "graph-frame")
    .map((item) => {
      const row = CHOOSER[item.slug]
      const when = row?.when ?? item.description
      const not = row?.not ?? "—"
      const mdx = item.mdx ? `\`${item.mdx}\`` : "props"
      return `| ${item.name} | ${item.slug} | ${when} | ${not} | ${mdx} |`
    })

  const skip = MDX_SKIP_SLUGS.map((slug) => slug.replace("graph-", "")).join(
    ", "
  )

  const asciiBlocks = items
    .filter((item) => isMdxSlug(item.slug))
    .map((item) => {
      const mdx = mdxExample(item.slug)
      if (!mdx) {
        return ""
      }

      return `### ${item.title} (\`${item.name}\`, \`${item.slug}\`)

${host}/docs/${item.slug}

${mdx.markdown}`
    })
    .filter(Boolean)
    .join("\n\n")

  return `# mdxcn

Framed figures for MDX. An agent writes markdown children inside a tag. A README, Linear, or a PR gets the same figure as a fence. The React components are how an MDX page renders the frame. The shadcn CLI copies those files into the app. Do not invent ASCII. Do not draw SVG.
${host}

## When to use

Use mdxcn when an agent is writing or editing a file and a figure would scan faster than a wall of bullets.

Reach for it when the writing is a path or a refactor, an incident or postmortem, a tradeoff, a pull request, overlapping work this week, a migration, or a README / RFC / launch list.

How to call it:

1. MDX: wrap markdown children in the tag. Register the parent once in mdx-components.tsx.
2. README, GitHub, Notion, Linear: paste the fence from ## MDX below. Keep it. Swap labels. Do not paste JSX.
3. Comark app (plain \`.md\`, streaming, DB-backed content): paste a \`::graph-*\` block from ## Comark. Wiring: ${host}/docs/comark.
4. Knap template (data → Markdown): pipe props through a \`graph_*\` filter from ## Knap. Wiring: ${host}/docs/knap.
5. If the MDX app does not have the tags yet: \`pnpm dlx shadcn@latest add ${host}/r/<slug>.json\`.
6. Install the skill from ${host}/skill.md so the chooser runs without fetching this file every time.

Do not use it for a one-sentence note, a pie chart, or a drawing that needs SVG. At most two figures, with prose between them.

${grammarMarkdown(host)}

## Machine-readable

- OpenAPI: ${host}/openapi.json
- JSON catalog: ${host}/api/v1/components
- Skill: ${host}/skill.md
- Registry: ${host}/r/<slug>.json
- Agents: ${host}/agents

## CLI

Install graphs with the official shadcn CLI (not npm):

pnpm dlx shadcn@latest add ${host}/r/<slug>.json

Copy all graphs (includes the Comark adapter and Knap filters):

pnpm dlx shadcn@latest add ${host}/r/all.json

## Host

- Notion, Linear, Google Docs, any rich text editor: copy the framed ASCII from the docs .md tab. Keep the fence.
- MDX that can register the parent: wrap markdown children in the tag. Register once in mdx-components.tsx. No extra child imports. The CLI copies the tags if the app does not have them.
- Plain Markdown that cannot run React (README, GitHub, Slack, PR comments): paste a fenced ASCII from ## MDX. Swap labels, keep the frame. Do not invent ASCII. Do not paste JSX.
- Comark: paste a \`::graph-*\` block from ## Comark. YAML props match the React API. GitHub does not run Comark, so use the fenced ASCII there.
- Knap: pipe the same props through a \`graph_*\` filter from ## Knap. Output is the official fence, or \`::graph-*\` when the figure has no ASCII / the param is \`comark\`. The Knap CLI does not load these filters. Wire them in your app.
- No fenced ASCII (${skip}): Flow, Plot, Activity, Heatmap, Calendar, Timer, Countdown, Frame have no ## MDX block. They still have a Comark block and a Knap filter (YAML) except Frame.

## Rules

- Geist Mono. Dashed frame, + corners, title as [ TITLE ].
- Charts are made of characters (█ ░ - = + ├ └). Borders are dashes. Do not use SVG, Recharts, or canvas.
- One accent: --graph-accent. palette="duo" | "multi" is opt-in.
- Motion is opacity and transform, ~220ms, no loops, no pulsing.
- Copy the markdown children from the example. Paste the official fence when the host cannot render MDX. Props still work when the data is already in JavaScript. Do not invent extra hues or chart libraries.

## Install

pnpm dlx shadcn@latest add ${host}/r/<slug>.json

Files land under @/registry/default.

## Chooser

| Component | Slug | Use for | Not for | MDX children |
| --- | --- | --- | --- | --- |
${rows.join("\n")}

## MDX

Official fenced ASCII blocks. Paste into plain Markdown. Monospace keeps the frame aligned.

${asciiBlocks}

${comarkChooserSection(items, host)}

${knapChooserSection(items, host)}

${recipesMarkdown(host)}
`
}
