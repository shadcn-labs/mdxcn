---
name: mdxcn
description: >-
  Picks mdxcn next to prose. In Notion, Linear, or a README, pastes
  the framed ASCII from the docs .md tab (dashed box, [ TITLE ], glyphs) and
  keeps the fence. In MDX that can register the parent, wraps markdown
  children in the component. In a Comark app, writes a ::graph-* block with
  YAML props. In a Knap template, pipes props through a graph_* filter. Never
  invents SVG, Mermaid, Recharts, canvas, or homemade ASCII. Use when explaining
  a refactor, incident, postmortem, tradeoff, pull request, sprint, or
  migration; when writing a README or markdown doc; when the user mentions
  mdxcn, ASCII diagrams, framed charts, GraphFlow, GraphTimeline,
  Comark, or Knap; or when a write-up would scan faster with a figure.
---

# mdxcn

Glyphs in a dashed frame with `+` corners and a `[ TITLE ]` on the top edge.

Pick the host before you write. What you paste depends on it.

| Host                                              | What to paste        | Where to copy from                                                      |
| ------------------------------------------------- | -------------------- | ----------------------------------------------------------------------- |
| Notion, Linear, Google Docs, any rich text editor | Fenced ASCII drawing | docs **.md** tab (the framed figure, not the inner list)                |
| MDX that can register the parent once             | Markdown children    | docs **.mdx** tab, inside `<GraphTimeline>` / `<Callout>` / …           |
| Comark app (plain `.md` the app renders)          | `::graph-*` + YAML   | https://mdxcn.dev/llms.txt `## Comark`, or the docs page **Comark** tab |
| Knap template (data → Markdown)                   | `graph_*` filter     | https://mdxcn.dev/llms.txt `## Knap`, or the docs page **Knap** tab     |
| README, GitHub, Slack, PR comments                | Fenced ASCII         | docs **.md** tab, or https://mdxcn.dev/llms.txt `## MDX`                |

Do not paste `<GraphTree>` into Notion. Paste the fenced drawing from the .md tab instead. Do not paste `::graph-*` into GitHub or Linear, because they do not run Comark. Do not draw your own ASCII art. Copy the official fence, change the labels, and keep the frame. Knap filters emit that fence (or `::graph-*` when the param is `comark`).

No fenced ASCII: Flow, Plot, Activity, Heatmap, Calendar, Timer, Countdown, Frame. On GitHub, pick a graph that has fenced ASCII, or skip. On Comark, those graphs still work except Frame. On Knap they emit `::graph-*` YAML except Frame.

The shadcn CLI copies the tags into the app. This is not an npm package. Imports land under `@/registry/default`. Unsure what to paste? Fetch https://mdxcn.dev/llms.txt. Prefer markdown children over array props.

If `registry/default/graph-frame` is missing and the host is React, Comark, or Knap:

```bash
pnpm dlx shadcn@latest add https://mdxcn.dev/r/all.json
```

Need `motion`. One component: replace `all` with the slug (`graph-flow`, …). For Comark, the adapter is `graph-comark` (already in `all.json`). For Knap, the filters are `graph-knap` (already in `all.json`). Also `pnpm add knap`.

## Procedure

1. Decide if a figure earns it. One sentence → no graph. A path, a night, a matrix, a diff → yes.
2. Pick **at most two** graphs from the chooser. Prefer a pair in recipes.md. If the host is GitHub / README, drop any pick that has no fenced ASCII.
3. Copy. The docs .mdx tab for MDX (markdown children inside the tag). The docs .md tab for Notion, Linear, README, GitHub. `::graph-*` from llms.txt `## Comark`. `{{ … | graph_* }}` from llms.txt `## Knap`. Swap labels, keep the frame.
4. Write the reply in this shape. Do not lead with the figure.

MDX (register the parent once, paste the markdown inside):

```
1–3 sentences (the claim)

<GraphTimeline title="NIGHT">

- 14:02: p95 crossed 800ms
- **14:11: rolled back the cache flag**
- *14:40: write the postmortem*

</GraphTimeline>

1–3 sentences (what the second figure adds)
```

Notion / Linear / README (fenced ASCII from the docs .md tab):

````
1–3 sentences (the claim)

```
+---------------- [ NIGHT ] ----------------+
|                                           |
| ●  14:02  p95 crossed 800ms               |
| │                                         |
| ●  14:11  rolled back the cache flag      |
| │                                         |
| ○  14:40  write the postmortem            |
|                                           |
+-------------------------------------------+
```

1–3 sentences (what the second figure adds)
````

Comark:

```
1–3 sentences (the claim)

::graph-timeline
---
title: NIGHT
events:
  - { date: "14:02", label: "p95 crossed 800ms" }
---
::

1–3 sentences (what the second figure adds)
```

Knap:

```
1–3 sentences (the claim)

{{ events | graph_timeline:"NIGHT" }}

1–3 sentences (what the second figure adds)
```

Plain Markdown (GitHub, README, Linear):

````
1–3 sentences (the claim)

```
+---- [ TITLE ] ----+
|                   |
|  …official fence   |
|                   |
+-------------------+
```

1–3 sentences (what the second figure adds)
````

5. Check the rules. Then send.

## Chooser

Writing first. Data shape if nothing matches.

| The writing is             | Use                                              | Recipe       |
| -------------------------- | ------------------------------------------------ | ------------ |
| A path or a refactor       | `GraphFlow`, then `GraphTimeline`                | Refactor     |
| An incident / postmortem   | `GraphTimeline`, then `GraphUptime`              | Incident     |
| Pick A vs B                | `GraphCompare`, then `GraphRank` if size matters | Pick one     |
| What a PR changed          | `GraphDiff`, then `GraphSlope`                   | Pull request |
| Overlapping work this week | `GraphGantt`, then `GraphStat`                   | This week    |
| A migration in flight      | `GraphMeter`, then `GraphKpi`                    | Migration    |
| Nested files / org         | `GraphTree`                                      | —            |
| An RFC or a launch list    | `GraphSheet`, then `GraphCheck`                  | —            |
| A decision or an ADR       | `Decision`, then `GraphScore`                    | —            |
| A roadmap or a sprint      | `GraphBoard`, then `GraphCheck`                  | —            |
| A code sample to explain   | `Annotate`                                       | —            |
| An agent session           | `Chat`, then `GraphDiff`                         | —            |
| Setup: env vars, an API    | `Env`, `Endpoint`                                | —            |
| A procedure                | `Steps`                                          | —            |
| A caveat or a warning      | `Callout`                                        | —            |
| Questions people ask       | `Faq`                                            | —            |

| The data is                    | Use              | Not                                |
| ------------------------------ | ---------------- | ---------------------------------- |
| A handful of numbers, no axis  | `GraphSpark`     | Plot                               |
| A series that needs a y-scale  | `GraphPlot`      | Spark, Recharts                    |
| One fill from 0 to 1           | `GraphMeter`     | Bullet                             |
| Actual vs a target             | `GraphBullet`    | Meter                              |
| Parts of a whole               | `GraphStack`     | Pie. Waffle if you want ~100 cells |
| A short ranked list            | `GraphRank`      | Bars                               |
| A small filled / empty grid    | `GraphCells`     | Waffle, Activity                   |
| Two small histograms           | `GraphBars`      | Rank                               |
| One headline + a trend         | `GraphKpi`       | Stat                               |
| Two to four numbers, no trend  | `GraphStat`      | KPI                                |
| Before → after numbers         | `GraphSlope`     | Bars                               |
| Elapsed / how long ago / clock | `GraphTimer`     | Countdown                          |
| Time left until a date         | `GraphCountdown` | Timer                              |
| Status per day                 | `GraphUptime`    | Activity, Heatmap                  |
| Daily counts over months       | `GraphActivity`  | Calendar, Uptime                   |
| One month, a few marks         | `GraphCalendar`  | Activity                           |
| A labeled intensity grid       | `GraphHeatmap`   | Activity, Matrix                   |
| Exact numbers on both axes     | `GraphMatrix`    | Heatmap, Compare                   |
| A running total                | `GraphWaterfall` | Stack                              |
| Steps that drop off            | `GraphFunnel`    | Flow, Rank                         |
| Rows of numbers                | `GraphTable`     | Rank, Spark, Sheet                 |
| Grouped table, section titles  | `GraphSheet`     | Table, Spec                        |
| Punch list `[x]` / `[ ]`       | `GraphCheck`     | Timeline                           |
| From / bill-to / line items    | `GraphInvoice`   | Table                              |
| Label / value sheet            | `GraphSpec`      | Stat, Sheet                        |
| Ratings out of five or ten     | `GraphScore`     | Bullet, Rank                       |
| Keyboard shortcuts             | `Keys`           | Spec                               |
| A shell session                | `Terminal`       | a plain fence                      |
| One release                    | `Changelog`      | Diff                               |

Skip `GraphFrame` unless you are assembling a custom figure. If the chart already exists, install that one.

## Grammar

In MDX, Comark block bodies, and Knap `body` strings, every component reads the same Markdown. Prefer it over array props.

| Write                       | Means                                             |
| --------------------------- | ------------------------------------------------- |
| `**bold**`                  | now, chosen, the total (accent)                   |
| `*italic*`                  | next, rejected, an aside (dimmed)                 |
| `- label: value`            | one row                                           |
| `x — note`                  | a side note, reason, or caption                   |
| `a → b → c`                 | a path (Flow)                                     |
| `- [x]` / `- [ ]`           | a box (Check); a nested list is sub-tasks         |
| indented paragraph          | the item's body (leave blank lines between items) |
| `### heading`               | a section, a column (Board), a question (Faq)     |
| table, last row `**Total**` | data; the bold or `Total` row is the footer       |
| fence + `// (1)`            | a marked line; item 1 of the list after explains  |
| `~~old~~ new`               | a rewrite (Diff)                                  |
| `ok*40`                     | a run of forty; any list of values                |

Full table: https://mdxcn.dev/docs/grammar.

## Import

```tsx
import { GraphFlow } from "@/registry/default/graph-flow/graph-flow"
```

Named export matches the folder: `graph-<name>/graph-<name>`. Do not invent a barrel. Skip this when the host is Comark, Knap, or plain Markdown.

MDX wiring (once per app). `withMdxcn` keeps parsing working when a docs framework swaps `li`, `table`, or `h3`, and upgrades GitHub alerts, bylines, `console` fences, and footnotes into frames:

```tsx
// mdx-components.tsx
import { withMdxcn } from "@/registry/default/mdx/mdx"

export function useMDXComponents(components) {
  return withMdxcn({ ...components, GraphTimeline, Callout })
}
```

In a plain `.md` that a site renders with `withMdxcn`, `> [!WARNING]` is already a Callout, and it still reads fine on GitHub.

Comark wiring (once per app, after `all.json`):

```tsx
import { graphComponents } from "@/registry/default/graph-comark/graph-comark"
```

Pass `graphComponents` to Comark's `components` prop.

Knap wiring (once per app, after `all.json`):

```tsx
import { createEngine, standardFilters } from "knap"
import { graphFilters } from "@/registry/default/graph-knap/graph-knap"

const engine = createEngine({
  filters: { ...standardFilters, ...graphFilters },
})
```

The Knap CLI does not load these filters.

Subset (only some graphs copied):

```tsx
import { createGraphComponents } from "@/registry/default/graph-comark/graph-comark"
import { GraphTable } from "@/registry/default/graph-table/graph-table"

const graphComponents = createGraphComponents({
  "graph-table": GraphTable,
})
```

```ts
import { createGraphFilters } from "@/registry/default/graph-knap/graph-knap"

const graphFilters = createGraphFilters(["graph_table", "graph_timeline"])
```

## Rules

- At most two graphs in a section. Prose between them. Never a gallery.
- Titles: 1–2 words, uppercase, no punctuation. Drawn as `[ TITLE ]`.
- Labels: lowercase, plain (`auth middleware`, not `AuthMiddleware Layer`).
- Copy markdown children, fences, `::graph-*` blocks, and `graph_*` filters from recipes.md, docs, or llms.txt. Props still work when the data is already JavaScript. Do not invent APIs, extra hues, or chart libraries.
- Default palette is one accent (`--graph-accent`). `palette="duo"` / `"multi"` only when a second or third series needs it.
- Unused rows recede (~0.4 opacity). Numbers: `tabular-nums`, right-aligned.
- Motion is already in the components (transform + opacity, ~220ms). Do not add loops, pulses, or CSS animation.

## Do not

- Draw SVG, Mermaid, Recharts, or canvas.
- Invent ASCII art. Copy the official fence from llms.txt / the .md tab.
- Paste JSX into README, GitHub, Linear, or any file that cannot import the components.
- Paste `::graph-*` into GitHub, Linear, or a README. Those hosts get the fenced ASCII.
- Restyle the frame (no extra borders, no rounded cards, no new corner marks).
- Dump every graph you know into one reply.
- Use a pie chart. Stack or Waffle.
- Pass `palette` on Table, Sheet, Invoice, Spec, Stat, Tree, or Frame.

## Example prompts

These are user messages. Match the pair. MDX → copy the .mdx tab (markdown children). Comark → copy the `::graph-*` block from llms.txt `## Comark`. Knap → copy the `graph_*` filter from llms.txt `## Knap`. GitHub / README → copy the fence from llms.txt.

**Refactor** → `GraphFlow`, then `GraphTimeline` (GitHub: Timeline only, because Flow has no fenced ASCII)

```
We're moving session checks out of route handlers into middleware. Write a short plan for the team.

Use mdxcn for the before/after request path and the week-by-week rollout. Prose between the two figures. Don't draw SVG.
```

**Incident** → `GraphTimeline`, then `GraphUptime`

```
Draft a tight postmortem: p95 crossed 800ms at 14:02, we rolled back the cache flag at 14:11, the write-up is still open.

Use mdxcn: a timeline of the night, then the days users felt it. No SVG.
```

**Comark postmortem** → `::graph-timeline`, then `::graph-uptime`

```
Write this postmortem as a Comark Markdown file. p95 crossed 800ms at 14:02, rollback at 14:11.

Use ::graph-* blocks with YAML props. At most two figures. Don't paste JSX. Don't draw SVG.
```

**Knap postmortem** → `{{ events | graph_timeline }}`, then `{{ uptime | graph_uptime }}`

```
Write a Knap template for this postmortem. p95 crossed 800ms at 14:02, rollback at 14:11.

Pipe the graph props through graph_* filters so the output is the official fenced ASCII. At most two figures. Don't paste JSX. Don't draw SVG.
```

**Pull request** → `GraphDiff`, then `GraphSlope`

```
Leave a PR review comment on the auth refactor. Summarize what files moved, then show how coverage changed on main vs this branch.

Use mdxcn from this project. At most two figures. Don't invent APIs or draw SVG.
```

**Pick one** → `GraphCompare`, then `GraphRank` if install size is part of the argument

```
We're choosing a queue: BullMQ vs SQS. Write the tradeoff for the RFC.

Use mdxcn: a feature matrix, and bundle size only if it matters. Don't draw SVG.
```

**README** → fenced ASCIIs, not JSX, not `::graph-*`

```
Add a launch section to the README. It's a .md file, no React, no Comark.

Use mdxcn: a punch list (the GraphCheck fence), plus a grouped table if one helps. Paste the official fenced ASCII from llms.txt. Don't paste JSX.
```
