# mdxcn

Figures drawn with text, for MDX. An agent writes Markdown inside a component tag, and the MDX page renders it in a frame. A README, a PR, or Linear gets the same figure as a fenced drawing. The [shadcn](https://ui.shadcn.com) CLI copies the component source into your app. There is no npm package.

<!-- prettier-ignore -->
```mdx
<GraphTimeline title="NIGHT">

- 14:02: p95 crossed 800ms — paged the on-call
- **14:11: rolled back the cache flag**
- *14:40: write the postmortem*

</GraphTimeline>
```

Every component reads the same Markdown inside its tag. Bold is now, italic is next, `label: value` is a row, `— note` is a side note, and `ok*40` is a run. The rules: [grammar](https://mdxcn.dev/docs/grammar). The same Markdown is a Comark block body and a Knap `body`, and draws the same fence.

[docs](https://mdxcn.dev/docs) · [grammar](https://mdxcn.dev/docs/grammar) · [mdx](https://mdxcn.dev/docs/mdx) · [comark](https://mdxcn.dev/comark) · [knap](https://mdxcn.dev/knap) · [for agents](https://mdxcn.dev/agents) · [examples](https://mdxcn.dev/docs/examples) · [install](https://mdxcn.dev/docs/installation) · [skill](https://mdxcn.dev/docs/skill) · [github](https://github.com/keshav-exe/mdxcn)

## Install

You need [`motion`](https://motion.dev). The CLI copies the source into a project that already has `components.json`.

Add the `@mdxcn` registry once, then install by name:

```bash
pnpm dlx shadcn@latest registry add @mdxcn=https://mdxcn.dev/r/{name}.json
pnpm dlx shadcn@latest add @mdxcn/graph-table
pnpm dlx shadcn@latest add @mdxcn/all
```

Or paste the full URL once:

```bash
pnpm dlx shadcn@latest add https://mdxcn.dev/r/graph-table.json
pnpm dlx shadcn@latest add https://mdxcn.dev/r/all.json
```

`components.json` after `registry add`:

```json
{
  "registries": {
    "@mdxcn": "https://mdxcn.dev/r/{name}.json"
  }
}
```

Files land under `@/registry/default`. Import from there:

```tsx
import { GraphTable } from "@/registry/default/graph-table/graph-table"
```

## Components

| Component | Registry item     | Use for                                    |
| --------- | ----------------- | ------------------------------------------ |
| Callout   | `callout`         | Note, tip, warning, or danger              |
| Quote     | `quote`           | A pull quote with a byline                 |
| Steps     | `steps`           | A numbered procedure, one step current     |
| Terminal  | `terminal`        | A shell session                            |
| Changelog | `changelog`       | One release: added, changed, fixed         |
| Annotate  | `annotate`        | Code with numbered notes                   |
| Decision  | `decision`        | Options, the one chosen, and why           |
| Chat      | `chat`            | A conversation or an agent session         |
| Env       | `env`             | Environment variables from a `.env` fence  |
| Endpoint  | `endpoint`        | One API route: params, request, response   |
| Keys      | `keys`            | Keyboard shortcuts as keycaps              |
| FAQ       | `faq`             | Questions and answers                      |
| Table     | `graph-table`     | Data tables with optional footer totals    |
| Sheet     | `graph-sheet`     | Tables with section titles                 |
| Flow      | `graph-flow`      | Process diagrams on a dashed arrow         |
| Bars      | `graph-bars`      | Two bar groups, side by side               |
| Cells     | `graph-cells`     | Filled / empty grids                       |
| Meter     | `graph-meter`     | Progress as `=` and `-`                    |
| Spark     | `graph-spark`     | Sparkline from block characters            |
| Tree      | `graph-tree`      | File or org trees                          |
| Timeline  | `graph-timeline`  | Dated events, one row current              |
| Check     | `graph-check`     | Punch list, `[x]` / `[ ]`                  |
| Stack     | `graph-stack`     | Parts of a whole, glyphs instead of colors |
| Funnel    | `graph-funnel`    | Steps that get narrower                    |
| Gantt     | `graph-gantt`     | Schedule on a character track              |
| Board     | `graph-board`     | Columns of work: now, next, later          |
| Plot      | `graph-plot`      | Line or area from columns of glyphs        |
| Waffle    | `graph-waffle`    | Share of 100 cells                         |
| Diff      | `graph-diff`      | Add / remove / keep rows                   |
| Invoice   | `graph-invoice`   | From, bill-to, line items, totals          |
| Compare   | `graph-compare`   | Feature matrix (`✓` / `–`)                 |
| Matrix    | `graph-matrix`    | Exact numbers on both axes                 |
| Stat      | `graph-stat`      | Large figures with labels                  |
| Spec      | `graph-spec`      | Label / value sheets                       |
| Activity  | `graph-activity`  | GitHub-style contribution grid             |
| Heatmap   | `graph-heatmap`   | Labeled 2d intensity matrix                |
| Calendar  | `graph-calendar`  | One month, marked days                     |
| Waterfall | `graph-waterfall` | Running total as floating bars             |
| Uptime    | `graph-uptime`    | One glyph per day, percent up              |
| Slope     | `graph-slope`     | Two figures per row, before → after        |
| Bullet    | `graph-bullet`    | Actual versus target on one track          |
| Score     | `graph-score`     | Ratings as dots, out of five or ten        |
| Rank      | `graph-rank`      | A ranked list, one bar per row             |
| KPI       | `graph-kpi`       | One number with a sparkline under it       |
| Timer     | `graph-timer`     | Elapsed time, how long ago, or the clock   |
| Countdown | `graph-countdown` | Time left until a date                     |
| MDX       | `mdx`             | `withMdxcn` for `mdx-components.tsx`       |
| Frame     | `graph-frame`     | Shared dashed frame primitives             |

Wrap your MDX components in `withMdxcn` (registry item `mdx`). Tags your docs framework swaps out (`li`, `table`, `h3`) still parse, and plain Markdown gets a frame: `> [!WARNING]` becomes a Callout, a `— Name` byline a Quote, a `console` fence a Terminal, footnotes a framed list. GitHub still renders the original. See [mdx](https://mdxcn.dev/docs/mdx).

Each docs page has CLI, manual, agent, MDX, Comark, and Knap install tabs. Copy page puts the markdown (install, prompt, examples, props) on the clipboard.

Comark apps render the same figures from `::graph-*` blocks in a plain `.md` file, without MDX. Copy `graph-comark` (already in `all.json`). Full install: `graphComponents` from `graph-comark.tsx`. Subset: `createGraphComponents`. Wiring: [Comark](https://mdxcn.dev/docs/comark). Pitch: [Comark landing](https://mdxcn.dev/comark).

Knap templates pipe the same props through `graph_*` filters and emit the official fence (or a `::graph-*` block). Copy `graph-knap` (already in `all.json`). Spread `graphFilters` into `createEngine`. The Knap CLI does not load them. Wiring: [Knap](https://mdxcn.dev/docs/knap). Pitch: [Knap landing](https://mdxcn.dev/knap).

Composed write-ups (refactor, incident, tradeoff, PR, sprint, migration) live on [Examples](https://mdxcn.dev/docs/examples). [for agents](https://mdxcn.dev/agents) is the write and read story. The [skill](https://mdxcn.dev/docs/skill) tells an agent which graph to put next to the prose, and in what form: Markdown inside the tag in MDX, `::graph-*` in Comark, `graph_*` in Knap, and the code block in GitHub. Agents can also fetch [`/llms.txt`](https://mdxcn.dev/llms.txt) for the chooser, the ASCII blocks, the Comark blocks, and the Knap filters.

## Design

- Geist Mono. Dashed frame, `+` corners (swap with `corner`), title as `[ TITLE ]`.
- One accent: `--graph-accent`. Unused rows recede with opacity. `palette="duo"` / `"multi"` opt into `--graph-accent-2` and `--graph-accent-3`.
- Glyphs do the drawing (`█ ▓ ▒ ░ · - = + | ├ └ ✓`). Tracks that represent a range (meter, stack, bullet, rank) span the frame. Spark, bars, cells, and uptime stay packed at 1ch. Pass `glyphs` (`shade` `ascii` `hash` `bar`, or your own characters). No SVG.
- Numbers use `tabular-nums`. Amounts sit right-aligned.
- Motion is transform and opacity only, 220ms, no loops. `prefers-reduced-motion` sets duration to 0.

## Development

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm registry:build
```

Site: [mdxcn.dev](https://mdxcn.dev). MIT license.
