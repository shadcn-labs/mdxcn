import { CHOOSER } from "@/lib/docs/chooser"

export type NavLink = {
  href: string
  label: string
  isNew?: boolean
}

export type PropRow = {
  name: string
  type: string
  default?: string
  description: string
}

export type Category =
  "content" | "diagrams" | "data" | "charts" | "time" | "primitives"

export const CATEGORIES: { id: Category; label: string; blurb: string }[] = [
  {
    id: "content",
    label: "content",
    blurb:
      "Markdown you'd write anyway, framed: callouts, steps, shell sessions, release notes, code notes, decisions, chats, env files, API routes, shortcuts and FAQs.",
  },
  {
    id: "diagrams",
    label: "diagrams",
    blurb:
      "Paths, trees, timelines, schedules and boards, written as lists inside the tag.",
  },
  {
    id: "data",
    label: "data",
    blurb: "Numbers with labels: stats, specs, tables and diffs.",
  },
  {
    id: "charts",
    label: "charts",
    blurb: "Glyphs on a track: rankings, meters, sparklines and grids.",
  },
  {
    id: "time",
    label: "time",
    blurb:
      "Days and clocks: uptime, a month view, elapsed time and countdowns.",
  },
  {
    id: "primitives",
    label: "primitives",
    blurb: "The frame every component is drawn in.",
  },
]

export type ComponentDoc = {
  slug: string
  title: string
  name: string
  description: string
  registry: string
  dependencies: string[]
  props: PropRow[]
  category: Category
  /** The MDX child the component reads, if any. Shown in docs and llms.txt. */
  mdx?: string
  when?: string
  not?: string
}

export const getStarted: NavLink[] = [
  { href: "/docs", label: "introduction" },
  { href: "/docs/installation", label: "installation" },
  { href: "/docs/examples", label: "examples" },
  { href: "/docs/grammar", label: "grammar", isNew: true },
  { href: "/docs/mdx", label: "mdx", isNew: true },
  { href: "/docs/comark", label: "comark" },
  { href: "/docs/knap", label: "knap" },
  { href: "/agents", label: "for agents" },
  { href: "/docs/skill", label: "skill" },
]

type CatalogEntry = Omit<ComponentDoc, "category">

const corner: PropRow = {
  name: "corner",
  type: "string",
  default: '"+"',
  description: "Character at each corner of the frame.",
}

const frameProp: PropRow = {
  name: "frame",
  type: '"box" | "corners" | "rule" | "none"',
  default: '"box"',
  description:
    "box draws the dashed border. corners keeps only the corner marks. rule draws dashed lines above and below. none drops the border and padding, and puts the title above the content.",
}

const className: PropRow = {
  name: "className",
  type: "string",
  description: "Passed to the outer frame.",
}

const markdownChildren = (what: string): PropRow => ({
  name: "children",
  type: "ReactNode",
  description: `Markdown. ${what}`,
})

const content: CatalogEntry[] = [
  {
    slug: "callout",
    title: "callout",
    name: "Callout",
    description:
      "An aside between paragraphs: a caveat, a tip or a warning. The body is regular Markdown. For something another person said, use Quote.",
    registry: "callout",
    dependencies: ["motion"],
    props: [
      {
        name: "type",
        type: '"note" | "tip" | "warning" | "danger"',
        default: '"note"',
        description: "Sets the frame title and the glyph in the margin.",
      },
      {
        name: "title",
        type: "string",
        description: "Overrides the frame title. Defaults to the type.",
      },
      markdownChildren("Paragraphs, lists, inline code, links."),
      corner,
      className,
    ],
  },
  {
    slug: "quote",
    title: "quote",
    name: "Quote",
    description:
      "A sentence someone else said, with their name underneath. For your own caveat, use Callout.",
    registry: "quote",
    dependencies: ["motion"],
    props: [
      {
        name: "by",
        type: "string",
        description: "Who said it. Drawn after an em dash.",
      },
      {
        name: "source",
        type: "string",
        description: "Where. Muted, after the name.",
      },
      {
        name: "title",
        type: "string",
        description: "Optional frame title. Off by default.",
      },
      markdownChildren("The quote itself."),
      corner,
      className,
    ],
  },
  {
    slug: "steps",
    title: "steps",
    name: "Steps",
    description:
      "A numbered procedure. Write an ordered list, bold the current step and italicize the next one. For dated events use Timeline, and for a to-do list use Check.",
    registry: "steps",
    dependencies: ["motion"],
    mdx: "1. **Register it**\n\n   Export it from mdx-components.",
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "children",
        type: "<Step />",
        description:
          "Markdown ordered list. Bold is now, italic is next. Nested paragraphs are the body.",
      },
      corner,
      className,
    ],
  },
  {
    slug: "terminal",
    title: "terminal",
    name: "Terminal",
    description:
      "A shell session. Lines starting with `$` are commands, `#` marks a comment and `✓` a passing check. Source code stays in a normal code block, and a file tree is Tree.",
    registry: "terminal",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        default: '"shell"',
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "prompt",
        type: "string",
        default: '"$"',
        description: "The glyph that marks a command line.",
      },
      {
        name: "children",
        type: "string | fenced code",
        description:
          "Plain lines or a fenced code block. Whitespace is kept. Leading and trailing blank lines are dropped.",
      },
      corner,
      className,
    ],
  },
  {
    slug: "changelog",
    title: "changelog",
    name: "Changelog",
    description:
      "One release, written as a Markdown list of `added:`, `changed:`, `fixed:` and `removed:` items. For numeric before-and-after changes, use Diff.",
    registry: "changelog",
    dependencies: ["motion"],
    mdx: "- added: Callout, Steps, Terminal",
    props: [
      {
        name: "version",
        type: "string",
        description: "Drawn as the frame title unless title is set.",
      },
      {
        name: "date",
        type: "string",
        description: "Muted, on the first row.",
      },
      {
        name: "title",
        type: "string",
        description:
          "Overrides the frame title; the version moves into the body.",
      },
      {
        name: "children",
        type: "<Change />",
        description:
          "Change takes type (add | change | fix | remove) and Markdown children.",
      },
      corner,
      className,
    ],
  },
  {
    slug: "annotate",
    title: "annotate",
    name: "Annotate",
    description:
      "Code with numbered notes. End a line in the code block with `// (1)`, then explain it in an ordered list underneath. Marked lines stay bright and the rest fade. For a shell session, use Terminal.",
    registry: "annotate",
    dependencies: ["motion"],
    mdx: "```tsx\nconst x = 1 // (1)\n```\n\n1. Why x is 1.",
    props: [
      {
        name: "title",
        type: "string",
        description: "Defaults to the fence language, or code.",
      },
      {
        name: "children",
        type: "Markdown",
        description:
          "A fenced block with `// (1)`, `# (1)`, or `<!-- (1) -->` markers, then an ordered list. Item 1 explains (1).",
      },
      {
        name: "code",
        type: "string",
        description: "Data form of the fence.",
      },
      {
        name: "notes",
        type: "ReactNode[]",
        description: "Data form of the list.",
      },
      corner,
      className,
    ],
  },
  {
    slug: "decision",
    title: "decision",
    name: "Decision",
    description:
      "One decision with the options that were on the table. Bold the chosen option, italicize the rejected ones, and add `— why` after each. Paragraphs after the list describe what happens next. For a feature grid, use Compare.",
    registry: "decision",
    dependencies: ["motion"],
    mdx: "- **Postgres** — we already run it\n- *Mongo* — no joins we trust",
    props: [
      {
        name: "title",
        type: "string",
        default: '"decision"',
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "status",
        type: "string",
        description: "proposed, accepted, superseded. First row, left.",
      },
      {
        name: "date",
        type: "string",
        description: "Muted, first row, right.",
      },
      {
        name: "children",
        type: "Markdown",
        description:
          "A list of options, then paragraphs. Bold is chosen, italic is rejected.",
      },
      {
        name: "options",
        type: "{ label, reason?, state? }[]",
        description: "Data form. state is chosen, open, or rejected.",
      },
      corner,
      className,
    ],
  },
  {
    slug: "chat",
    title: "chat",
    name: "Chat",
    description:
      "A conversation. Write `- you: …` and `- agent: …` lines. Your turns get a prompt glyph, italic turns are asides, and back-to-back lines from one speaker share a label. For a single remark, use Quote.",
    registry: "chat",
    dependencies: ["motion"],
    mdx: "- you: which graph shows a rollback?\n- agent: Timeline.",
    props: [
      {
        name: "title",
        type: "string",
        default: '"chat"',
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "you",
        type: "string",
        description: "The person asking. Defaults to the first speaker.",
      },
      {
        name: "prompt",
        type: "string",
        default: '">"',
        description: "The glyph on your turns.",
      },
      {
        name: "children",
        type: "Markdown",
        description:
          "A list of `speaker: message` items. Loose items can hold paragraphs and code.",
      },
      {
        name: "turns",
        type: "{ by, children?, aside? }[]",
        description: "Data form.",
      },
      corner,
      className,
    ],
  },
  {
    slug: "env",
    title: "env",
    name: "Env",
    description:
      "Environment variables. Paste a `.env` code block: a comment above a key describes it, and a comment that says required marks it as required. For label and value rows that aren't variables, use Spec.",
    registry: "env",
    dependencies: ["motion"],
    mdx: "```bash\n# Postgres URL. Required.\nDATABASE_URL=postgres://…\n```",
    props: [
      {
        name: "title",
        type: "string",
        default: '".env"',
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "children",
        type: "Markdown",
        description:
          "A fenced .env, or a list: `- **KEY**: value — note` (bold is required).",
      },
      {
        name: "vars",
        type: "{ name, value?, note?, required? }[]",
        description: "Data form.",
      },
      corner,
      className,
    ],
  },
  {
    slug: "endpoint",
    title: "endpoint",
    name: "Endpoint",
    description:
      "One API route. Start with a line like `POST /v1/graphs`, then a sentence, a parameter table (a bold name means required), and request and response code blocks. To list many routes in one table, use Sheet.",
    registry: "endpoint",
    dependencies: ["motion"],
    mdx: "POST /v1/graphs\n\n| Field | Type | |\n| --- | --- | --- |\n| **slug** | string | the graph |",
    props: [
      {
        name: "title",
        type: "string",
        default: '"endpoint"',
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "children",
        type: "Markdown",
        description:
          "Method and path, paragraphs, a table of name / type / description, fenced blocks.",
      },
      {
        name: "method",
        type: "string",
        description: "Or the first line of the children.",
      },
      {
        name: "path",
        type: "string",
        description: "Or the first line of the children.",
      },
      {
        name: "params",
        type: "{ name, type?, description?, required? }[]",
        description: "Data form of the table.",
      },
      {
        name: "blocks",
        type: "{ label?, code }[]",
        description: "Data form of the fences.",
      },
      corner,
      className,
    ],
  },
  {
    slug: "keys",
    title: "keys",
    name: "Keys",
    description:
      "Keyboard shortcuts drawn as keycaps. Write `- ⌘K: search`, `- Ctrl+Shift+P: palette` or `- g then d: docs`. Bold the one worth learning first.",
    registry: "keys",
    dependencies: ["motion"],
    mdx: "- ⌘K: search the docs",
    props: [
      {
        name: "title",
        type: "string",
        default: '"keys"',
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "children",
        type: "Markdown",
        description:
          "A list of `keys: action`. `+` or a space joins a chord; `then` starts the next.",
      },
      {
        name: "bindings",
        type: "{ keys, action, accent? }[]",
        description: "Data form.",
      },
      corner,
      className,
    ],
  },
  {
    slug: "faq",
    title: "faq",
    name: "Faq",
    description:
      "Questions and answers. Each `### heading` is a question and the Markdown under it is the answer. Bold the question people should read first. For a procedure, use Steps.",
    registry: "faq",
    dependencies: ["motion"],
    mdx: "### Is this an npm package?\n\nNo. The CLI copies the source.",
    props: [
      {
        name: "title",
        type: "string",
        default: '"faq"',
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "children",
        type: "Markdown",
        description: "Headings and the paragraphs, lists, or code under them.",
      },
      {
        name: "entries",
        type: "{ question, answer?, accent? }[]",
        description: "Data form.",
      },
      corner,
      className,
    ],
  },
]

const catalog: CatalogEntry[] = [
  ...content,
  {
    slug: "graph-table",
    title: "table",
    name: "GraphTable",
    description:
      "A framed table. Write a regular Markdown table inside the tag. For grouped sections use Sheet, and for label and value rows use Spec.",
    registry: "graph-table",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "headers",
        type: "string[]",
        description: "Column headings. Sentence case.",
      },
      {
        name: "rows",
        type: "ReactNode[][]",
        description: "Body cells, one array per row.",
      },
      {
        name: "footer",
        type: "ReactNode[]",
        description: "Optional totals row under a rule.",
      },
      {
        name: "align",
        type: '("left" | "right")[]',
        default: "left, then right",
        description:
          "Per-column alignment. Defaults to left on the first column.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-sheet",
    title: "sheet",
    name: "GraphSheet",
    description:
      "A table split into titled sections, like an API reference or an RFC. Write `### Scope` followed by a Markdown table. For a flat table, use Table.",
    registry: "graph-sheet",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "headers",
        type: "string[]",
        description: "Column headings. Sentence case.",
      },
      {
        name: "sections",
        type: "SheetSection[]",
        description: "Each section has a title and rows of cells.",
      },
      {
        name: "footer",
        type: "ReactNode[]",
        description: "Optional totals row under a rule.",
      },
      {
        name: "align",
        type: '("left" | "right")[]',
        default: "left, then right",
        description:
          "Per-column alignment. Defaults to left on the first column.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-flow",
    title: "flow",
    name: "GraphFlow",
    description:
      "A process drawn along dashed arrows. Write one line per path with the steps separated by →, and bold the step you're on. For a dated list use Timeline, and for a schedule use Gantt.",
    registry: "graph-flow",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "rows",
        type: "FlowRow[]",
        description: "Each row is a sequence of nodes.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-bars",
    title: "bars",
    name: "GraphBars",
    description:
      "Two small histograms, before and after. Write `- before: 2 4 3 5 2`. For labels ranked by value, use Rank.",
    registry: "graph-bars",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "from",
        type: "BarSeries",
        description: "Left series. values is an array of relative heights.",
      },
      {
        name: "to",
        type: "BarSeries",
        description: "Right series. Set size to lg for the larger group.",
      },
      {
        name: "processor",
        type: "string",
        description: "Optional label between the two groups.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-rank",
    title: "rank",
    name: "GraphRank",
    description:
      "Labels ranked by a number. Write `- 12,400 /docs`. To compare two histograms side by side, use Bars.",
    registry: "graph-rank",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "items",
        type: "RankItem[]",
        description:
          "Each row is a label, a number, and an optional display string for the right column.",
      },
      {
        name: "max",
        type: "number",
        description: "Scale for the bars. Defaults to the largest value.",
      },
      {
        name: "ticks",
        type: "number",
        default: "20",
        description: "How many character slots each bar uses.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-cells",
    title: "cells",
    name: "GraphCells",
    description:
      "A small grid of filled and empty cells. Write `- fragments: 1 0 1 0 0 / 0 1 0 1 0`. To show a share out of 100, use Waffle.",
    registry: "graph-cells",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "items",
        type: "CellGrid[]",
        description: "Each item is a labeled 0/1 matrix.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-meter",
    title: "meter",
    name: "GraphMeter",
    description:
      "A progress bar drawn with `=` characters, with dashes for the empty part. Write `67% — of the disk` inside the tag.",
    registry: "graph-meter",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "value",
        type: "number",
        description: "0 to 1.",
      },
      {
        name: "ticks",
        type: "number",
        default: "14",
        description: "Number of character slots.",
      },
      {
        name: "caption",
        type: "string",
        description: "Muted line under the meter.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-spark",
    title: "spark",
    name: "GraphSpark",
    description:
      "A sparkline made of block characters, scaled to the highest value. Write `2 3 5 8 — caption` inside the tag.",
    registry: "graph-spark",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "data",
        type: "number[]",
        description: "Relative values. Scaled to the max.",
      },
      {
        name: "caption",
        type: "string",
        description: "Muted line under the sparkline.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: "▁▂▃▄▅▆▇█",
        description:
          "Defaults to spark bars. Pass shade, ascii, hash, bar, or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-tree",
    title: "tree",
    name: "GraphTree",
    description:
      "A nested list drawn with branch lines, good for file structures or an org chart. Bold a node to highlight it.",
    registry: "graph-tree",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "nodes",
        type: "TreeNode[]",
        description:
          "Nested nodes. Each may have label, meta, accent, and children.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-timeline",
    title: "timeline",
    name: "GraphTimeline",
    description:
      "A dated list. Write `- Mar 18: Docs`, bold the current row and italicize the next. A `— note` or an indented paragraph appears under its row. For a to-do list use Check, and for work with start and end dates use Gantt.",
    registry: "graph-timeline",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "events",
        type: "TimelineEvent[]",
        description: "date, label, and optional state: done, now, or next.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-check",
    title: "check",
    name: "GraphCheck",
    description:
      "A to-do list. Write `- [x] freeze tokens`. Text after an em dash becomes a note under the item, and a nested list becomes sub-tasks. For dated steps use Timeline, and for columns of work use Board.",
    registry: "graph-check",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "items",
        type: "CheckItem[]",
        description: "label, optional done, optional note under the label.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-stack",
    title: "stack",
    name: "GraphStack",
    description:
      "Parts of a whole on one bar. Write `- marketing: 48 js, 22 css, 30 images`. For a share shown as cells, use Waffle.",
    registry: "graph-stack",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "rows",
        type: "StackRow[]",
        description: "Each row has a label and labeled numeric segments.",
      },
      {
        name: "accent",
        type: "string",
        description:
          "Segment label to paint with the accent. Defaults to the first.",
      },
      {
        name: "ticks",
        type: "number",
        default: "24",
        description: "Bar width in characters.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        description:
          "One character per segment, or a preset. Defaults to █▓▒░#=+ -.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-funnel",
    title: "funnel",
    name: "GraphFunnel",
    description:
      "Steps that narrow as people drop off. Write `- 12,400 docs`. For a plain ranking use Rank, and for a process use Flow.",
    registry: "graph-funnel",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "steps",
        type: "FunnelStep[]",
        description: "label, value, and optional display string for the count.",
      },
      {
        name: "ticks",
        type: "number",
        default: "20",
        description: "Width of the first bar, in characters.",
      },
      {
        name: "stage",
        type: "string",
        description: "Step label to focus. Other rows recede.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-gantt",
    title: "gantt",
    name: "GraphGantt",
    description:
      "Overlapping work on a shared calendar. Write `- build: 0.2 0.75 0.55` for start, end and progress. For a dated log, use Timeline.",
    registry: "graph-gantt",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "items",
        type: "GanttItem[]",
        description:
          "label, start, end, optional complete (0–1 fill inside the bar).",
      },
      {
        name: "ticks",
        type: "string[]",
        description: "Labels under the track, spaced at the ends.",
      },
      {
        name: "columns",
        type: "number",
        default: "24",
        description: "Track width in characters.",
      },
      {
        name: "stage",
        type: "string",
        description: "Row label to focus. Other rows recede.",
      },
      {
        name: "progress",
        type: "number",
        description: "0–1 playhead. Draws ▾ on the track.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-plot",
    title: "plot",
    name: "GraphPlot",
    description:
      "A line or area chart built from columns of block characters. Write a list of numbers, or `- Mon: 4` rows to keep the labels.",
    registry: "graph-plot",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "data",
        type: "number[]",
        description: "One value per column, left to right.",
      },
      {
        name: "labels",
        type: "string[]",
        description: "First and last labels under the axis.",
      },
      {
        name: "height",
        type: "number",
        default: "7",
        description: "Rows in the plot.",
      },
      {
        name: "variant",
        type: '"line" | "area"',
        default: '"area"',
        description: "Area fills down from the cap with ░.",
      },
      {
        name: "progress",
        type: "number",
        default: "1",
        description: "0–1. How many columns are revealed.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-waffle",
    title: "waffle",
    name: "GraphWaffle",
    description:
      "A grid of 100 cells, filled to the value. Write `73% — tests green` inside the tag.",
    registry: "graph-waffle",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "value",
        type: "number",
        description: "Share from 0 to 1.",
      },
      {
        name: "cells",
        type: "number",
        default: "100",
        description: "Total cells in the grid.",
      },
      {
        name: "columns",
        type: "number",
        default: "10",
        description: "Cells per row.",
      },
      {
        name: "caption",
        type: "string",
        description: "Muted line under the percent.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-diff",
    title: "diff",
    name: "GraphDiff",
    description:
      "What was added, removed or kept. Write `- app: +31 kb` and bold the total. `- ~~old~~ new` draws one removed line and one added line. For numbers before and after, use Slope.",
    registry: "graph-diff",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "rows",
        type: "DiffRow[]",
        description: "label, value, and optional sign: add, remove, or keep.",
      },
      {
        name: "footer",
        type: "DiffRow",
        description: "Total row under a rule.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-invoice",
    title: "invoice",
    name: "GraphInvoice",
    description:
      "An invoice with sender, recipient, line items and totals. Write the line items as a Markdown table and the sender and recipient as text. For a general table, use Table.",
    registry: "graph-invoice",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "from",
        type: "InvoiceParty | string",
        description: "Issuer name. A string, or name plus address lines.",
      },
      {
        name: "to",
        type: "InvoiceParty | string",
        description: "Recipient name. A string, or name plus address lines.",
      },
      {
        name: "meta",
        type: "InvoiceMeta[]",
        description: "Fields like number, issued, due.",
      },
      {
        name: "items",
        type: "InvoiceItem[]",
        description:
          "Line items. qty and rate are optional; columns hide when unused.",
      },
      {
        name: "totals",
        type: "InvoiceTotal[]",
        description: "Rows under the items. Set accent on the amount due.",
      },
      {
        name: "note",
        type: "string",
        description: "Muted line under the totals. Payment terms, etc.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-compare",
    title: "compare",
    name: "GraphCompare",
    description:
      "Options side by side. Write a Markdown table where `yes` and `no` become ✓ and –. For exact numbers on both axes, use Matrix.",
    registry: "graph-compare",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "columns",
        type: "string[]",
        description: "Option names across the top.",
      },
      {
        name: "rows",
        type: "CompareRow[]",
        description: "label plus one value per column. Booleans become ✓ or –.",
      },
      {
        name: "accent",
        type: "string",
        description: "Column name to highlight. Other columns recede.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-matrix",
    title: "matrix",
    name: "GraphMatrix",
    description:
      "A grid of exact numbers with labels on both axes. Write a Markdown table. For shaded intensities use Heatmap, and for yes/no features use Compare.",
    registry: "graph-matrix",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "columns",
        type: "string[]",
        description: "Column headings across the top.",
      },
      {
        name: "rows",
        type: "MatrixRow[]",
        description: "label plus one number or string per column.",
      },
      {
        name: "accent",
        type: "string",
        description: "Row label to highlight. Other rows recede.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-stat",
    title: "stat",
    name: "GraphStat",
    description:
      "Two to four big numbers. Write `- 12,400 docs` and bold the one that matters most. For a single number with a trend, use KPI.",
    registry: "graph-stat",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "items",
        type: "StatItem[]",
        description: "value, label, optional hint, optional accent.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-kpi",
    title: "kpi",
    name: "GraphKpi",
    description:
      "One big number with a sparkline underneath. Write `12,400 this week — +18%`, then a line of numbers.",
    registry: "graph-kpi",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "value",
        type: "string",
        description: "The large number, already formatted.",
      },
      {
        name: "label",
        type: "string",
        description: "Line under the number.",
      },
      {
        name: "hint",
        type: "string",
        description: "Optional extra next to the label, like a delta.",
      },
      {
        name: "data",
        type: "number[]",
        description: "Sparkline values. Scaled to the highest point.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        description: "Sparkline characters. Defaults to ▁▂▃▄▅▆▇█.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-spec",
    title: "spec",
    name: "GraphSpec",
    description:
      "Aligned label and value rows. Write `- Family: Geist Mono`. Inline code and links work, and an indented paragraph appears under its value. For headline numbers use Stat, and for a table with headers use Table.",
    registry: "graph-spec",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "rows",
        type: "SpecRow[]",
        description: "label, value, and optional accent.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-activity",
    title: "activity",
    name: "GraphActivity",
    description:
      "A GitHub-style contribution grid. Pass dated counts, or write `- 2026-03-02: 0 1 4 2 0*3` and the counts fill in day by day from that date.",
    registry: "graph-activity",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "days",
        type: "ActivityDay[]",
        description: "ISO date plus count. Gaps fill as empty days.",
      },
      {
        name: "weekStartsOn",
        type: "0 | 1",
        default: "0",
        description: "0 is Sunday, like GitHub. 1 is Monday.",
      },
      {
        name: "max",
        type: "number",
        description: "Lock the intensity scale. Defaults to the highest count.",
      },
      {
        name: "legend",
        type: "boolean",
        default: "true",
        description: "Less / more glyph key under the grid.",
      },
      {
        name: "caption",
        type: "string | false",
        description:
          "Replaces the computed contribution total. Pass false to hide it.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-heatmap",
    title: "heatmap",
    name: "GraphHeatmap",
    description:
      "A labeled grid shaded by intensity. Write a Markdown table. For exact numbers use Matrix, and for a contribution calendar use Activity.",
    registry: "graph-heatmap",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "columns",
        type: "string[]",
        description: "Column headers, left to right.",
      },
      {
        name: "rows",
        type: "HeatRow[]",
        description: "label plus a value per column.",
      },
      {
        name: "max",
        type: "number",
        description: "Lock the intensity scale across charts.",
      },
      {
        name: "legend",
        type: "boolean",
        default: "true",
        description: "Less / more glyph key.",
      },
      {
        name: "caption",
        type: "string",
        description: "Optional note under the matrix.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-calendar",
    title: "calendar",
    name: "GraphCalendar",
    description:
      "One month as a seven-column grid. Write `- 12: launch` to mark a day; marked days use the accent and their labels are listed under the month. Today is shown in brackets, and a bold item sets it.",
    registry: "graph-calendar",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption. Defaults to the month name.",
      },
      {
        name: "year",
        type: "number",
        description: "Full year.",
      },
      {
        name: "month",
        type: "number",
        description: "1–12.",
      },
      {
        name: "weekStartsOn",
        type: "0 | 1",
        default: "1",
        description: "0 is Sunday. 1 is Monday.",
      },
      {
        name: "marks",
        type: "number[] | CalendarMark[]",
        description: "Days to accent. Pass numbers, or { day, accent }.",
      },
      {
        name: "today",
        type: "number",
        description: "Day of the month to wrap in brackets. Pass it in.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-waterfall",
    title: "waterfall",
    name: "GraphWaterfall",
    description:
      "A running total drawn as floating bars. The first row is the starting value, the last is the result, and the signed values in between move it up or down.",
    registry: "graph-waterfall",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "items",
        type: "WaterfallItem[]",
        description:
          "label, value, optional kind: start, in, out, or end. Kind is inferred if omitted.",
      },
      {
        name: "ticks",
        type: "number",
        default: "24",
        description: "Bar width in characters.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-uptime",
    title: "uptime",
    name: "GraphUptime",
    description:
      "One glyph per day for ok, degraded, down or no data, wrapping every 30 days. Shorthand keeps long runs short: `ok*40 down*2 ok*48`.",
    registry: "graph-uptime",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "days",
        type: "UptimeStatus[]",
        description: "ok, degraded, down, or empty.",
      },
      {
        name: "from",
        type: "string",
        description: "Label at the start of the range.",
      },
      {
        name: "to",
        type: "string",
        description: "Label at the end of the range.",
      },
      {
        name: "columns",
        type: "number",
        default: "30",
        description: "Days per row. Short series are not padded to this width.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-slope",
    title: "slope",
    name: "GraphSlope",
    description:
      "Two values per row with an arrow between them. Increases use the accent and decreases fade.",
    registry: "graph-slope",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "fromLabel",
        type: "string",
        description: "Header over the first column.",
      },
      {
        name: "toLabel",
        type: "string",
        description: "Header over the second column.",
      },
      {
        name: "items",
        type: "SlopeItem[]",
        description: "label, from, and to.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-board",
    title: "board",
    name: "GraphBoard",
    description:
      "Columns of work, like a kanban board. Each `### heading` is a column with a list underneath. Bold marks what's in progress, italics what's next, and `— note` adds a line under an item. For a to-do list use Check, and for dates use Timeline.",
    registry: "graph-board",
    dependencies: ["motion"],
    mdx: "### Now\n- **Children for every graph**\n\n### Next\n- Board",
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "children",
        type: "Markdown",
        description:
          "Headings, each followed by a list. Up to four columns; they stack on small screens.",
      },
      {
        name: "columns",
        type: "{ title, items: (string | { label, note?, state? })[] }[]",
        description: "Data form. Optional when children are Markdown.",
      },
      corner,
      className,
    ],
  },
  {
    slug: "graph-score",
    title: "score",
    name: "GraphScore",
    description:
      "Ratings drawn as dots. Write `- Docs: 4/5`; halves draw a half dot. Bold the row that matters and the rest fade. For actual versus target, use Bullet.",
    registry: "graph-score",
    dependencies: ["motion"],
    mdx: "- Performance: 4/5\n- **Docs: 2.5/5**",
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "children",
        type: "Markdown",
        description: "A list of `label: value/max`. Bold is the row to read.",
      },
      {
        name: "items",
        type: "{ label, value, max?, accent? }[]",
        description: "Data form. Optional when children are Markdown.",
      },
      {
        name: "max",
        type: "number",
        default: "5",
        description: "Dots per row. Defaults to the /n in the first row.",
      },
      {
        name: "glyphs",
        type: "Glyphs",
        description: "Empty, half, and full dot. Default ○ ◐ ●.",
      },
      corner,
      className,
    ],
  },
  {
    slug: "graph-bullet",
    title: "bullet",
    name: "GraphBullet",
    description:
      "An actual value against a target on one bar. The marker shows the target.",
    registry: "graph-bullet",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "items",
        type: "BulletItem[]",
        description: "label, value, optional target, max, and display.",
      },
      {
        name: "ticks",
        type: "number",
        default: "20",
        description: "Track width in characters, not counting the brackets.",
      },
      {
        name: "glyphs",
        type: '"shade" | "ascii" | "hash" | "bar" | string[]',
        default: '"shade"',
        description:
          "Character set. shade is ·░▒▓█. ascii is .- =#@. Pass a preset or your own characters.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-timer",
    title: "timer",
    name: "GraphTimer",
    description:
      "Time since a moment, how long ago it was, or the current time, updated every second. Write the start inside the tag: `2026-09-01T09:00Z — since deploy`.",
    registry: "graph-timer",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "kind",
        type: '"elapsed" | "ago" | "clock"',
        default: '"elapsed"',
        description:
          "elapsed counts up from at. ago is relative. clock is the time of day.",
      },
      {
        name: "at",
        type: "Date | number | string",
        description:
          "Start time for elapsed and ago. A date, timestamp, or ISO string.",
      },
      {
        name: "caption",
        type: "string",
        description: "Line under the number.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-countdown",
    title: "countdown",
    name: "GraphCountdown",
    description:
      "Time remaining until a date. Once the date passes, it shows a short label you choose. Write `2026-12-01 — until launch` inside the tag.",
    registry: "graph-countdown",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description: "Caption drawn on the top edge of the frame.",
      },
      {
        name: "to",
        type: "Date | number | string",
        description: "The deadline. A date, timestamp, or ISO string.",
      },
      {
        name: "done",
        type: "string",
        default: '"done"',
        description: "What to show after the deadline.",
      },
      {
        name: "caption",
        type: "string",
        description: "Line under the number.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner of the frame.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the outer frame.",
      },
    ],
  },
  {
    slug: "graph-frame",
    title: "frame",
    name: "Graph",
    description:
      "The dashed frame every graph is drawn in. Build with GraphTitle, GraphBody, GraphRule, GraphTrack and GraphTick. Set corner to change the corner character and frame to change the border. Wrap a page in GraphFrameProvider to set the frame for every graph inside it.",
    registry: "graph-frame",
    dependencies: ["motion"],
    props: [
      {
        name: "title",
        type: "string",
        description:
          "Optional caption. Renders as [ TITLE ] on the top edge, or above the content when frame is none. Pass an empty string to drop a component's default title.",
      },
      {
        name: "corner",
        type: "string",
        default: '"+"',
        description: "Character at each corner. Default +.",
      },
      {
        name: "className",
        type: "string",
        description: "Passed to the figure.",
      },
      {
        name: "children",
        type: "ReactNode",
        description: "Usually GraphBody.",
      },
    ],
  },
]

const PALETTE_SLUGS = new Set([
  "changelog",
  "annotate",
  "decision",
  "chat",
  "env",
  "endpoint",
  "keys",
  "faq",
  "graph-board",
  "graph-score",
  "graph-flow",
  "graph-bars",
  "graph-rank",
  "graph-cells",
  "graph-meter",
  "graph-spark",
  "graph-timeline",
  "graph-stack",
  "graph-funnel",
  "graph-gantt",
  "graph-plot",
  "graph-waffle",
  "graph-diff",
  "graph-compare",
  "graph-matrix",
  "graph-kpi",
  "graph-check",
  "graph-activity",
  "graph-heatmap",
  "graph-calendar",
  "graph-waterfall",
  "graph-uptime",
  "graph-slope",
  "graph-bullet",
  "graph-timer",
  "graph-countdown",
])

const paletteProp: PropRow = {
  name: "palette",
  type: '"mono" | "duo" | "multi"',
  default: '"mono"',
  description:
    "mono is one accent plus muted. duo paints the second series with --graph-accent-2. multi cycles three accents.",
}

/**
 * Order is the docs order. Content first — it is the most Markdown-like —
 * then the graphs that read children, then the ones that take data.
 */
const ORDER: Record<Category, string[]> = {
  content: [
    "callout",
    "quote",
    "steps",
    "terminal",
    "changelog",
    "annotate",
    "decision",
    "chat",
    "env",
    "endpoint",
    "keys",
    "faq",
  ],
  diagrams: [
    "graph-flow",
    "graph-timeline",
    "graph-tree",
    "graph-gantt",
    "graph-board",
  ],
  data: [
    "graph-stat",
    "graph-spec",
    "graph-check",
    "graph-diff",
    "graph-kpi",
    "graph-table",
    "graph-sheet",
    "graph-compare",
    "graph-matrix",
    "graph-invoice",
  ],
  charts: [
    "graph-rank",
    "graph-funnel",
    "graph-slope",
    "graph-bullet",
    "graph-score",
    "graph-waterfall",
    "graph-stack",
    "graph-spark",
    "graph-plot",
    "graph-meter",
    "graph-waffle",
    "graph-cells",
    "graph-bars",
    "graph-heatmap",
    "graph-activity",
  ],
  time: ["graph-uptime", "graph-calendar", "graph-timer", "graph-countdown"],
  primitives: ["graph-frame"],
}

const categoryOf = new Map<string, Category>()
for (const [category, slugs] of Object.entries(ORDER) as [
  Category,
  string[],
][]) {
  for (const slug of slugs) {
    categoryOf.set(slug, category)
  }
}

const rank = new Map(
  Object.values(ORDER)
    .flat()
    .map((slug, index) => [slug, index] as const)
)

/**
 * Graphs that read MDX children instead of an array prop. `data` is the prop
 * the children replace; `child` is the tag; `usage` is the one-line MDX.
 */
const CHILD_ITEMS: Record<
  string,
  { data: string; child: string; usage: string; note?: string }
> = {
  "graph-meter": {
    data: "value",
    child: "text",
    usage: "67% — of the disk",
  },
  "graph-waffle": {
    data: "value",
    child: "text",
    usage: "73% — tests green",
  },
  "graph-spark": {
    data: "data",
    child: "text",
    usage: "2 3 5 8 13 — last point is the accent",
  },
  "graph-plot": {
    data: "data",
    child: "list",
    usage: "- Mon: 4",
    note: "Or a line of numbers.",
  },
  "graph-kpi": {
    data: "data",
    child: "text",
    usage: "12,400 this week — +18%\n\n4 5 5 6 8 7 9",
    note: "value, label, and hint come from the first line.",
  },
  "graph-uptime": {
    data: "days",
    child: "text",
    usage: "ok*40 degraded ok*20 down*2 ok*27",
  },
  "graph-calendar": {
    data: "marks",
    child: "list",
    usage: "- 12: launch\n- **18: today**",
  },
  "graph-activity": {
    data: "days",
    child: "list",
    usage: "- 2026-03-02: 0 1 4 2 0*3 3",
  },
  "graph-timer": {
    data: "at",
    child: "text",
    usage: "2026-09-01T09:00Z — since deploy",
  },
  "graph-countdown": {
    data: "to",
    child: "text",
    usage: "2026-12-01 — until launch",
  },
  "graph-stat": {
    data: "items",
    child: "list",
    usage: "- **860** shipped",
  },
  "graph-timeline": {
    data: "events",
    child: "list",
    usage: "- **Mar 18: Docs, live previews**",
  },
  "graph-check": {
    data: "items",
    child: "list",
    usage: "- [x] freeze tokens",
  },
  "graph-spec": {
    data: "rows",
    child: "list",
    usage: "- Family: Geist Mono",
  },
  "graph-diff": {
    data: "rows",
    child: "list",
    usage: "- app: +31 kb",
  },
  "graph-rank": {
    data: "items",
    child: "list",
    usage: "- 12,400 /docs",
  },
  "graph-funnel": {
    data: "steps",
    child: "list",
    usage: "- 4,100 copy",
  },
  "graph-slope": {
    data: "items",
    child: "list",
    usage: "- read: 160 → 142",
  },
  "graph-bullet": {
    data: "items",
    child: "list",
    usage: "- CPU: 72 / 80",
  },
  "graph-gantt": {
    data: "items",
    child: "list",
    usage: "- build: 0.2 0.75 0.55",
  },
  "graph-waterfall": {
    data: "items",
    child: "list",
    usage: "- Refunds: -6",
  },
  "graph-stack": {
    data: "rows",
    child: "list",
    usage: "- docs: 28 js, 18 css, 54 images",
  },
  "graph-tree": {
    data: "nodes",
    child: "list",
    usage: "- registry/default\n  - **graph-tree.tsx** — ui",
  },
  "graph-flow": {
    data: "rows",
    child: "list",
    usage: "request → **middleware** → handler",
  },
  "graph-table": {
    data: "rows",
    child: "table",
    usage: "| Agent | Tokens |\n| --- | ---: |\n| Inks and paper | 115,207 |",
  },
  "graph-sheet": {
    data: "sections",
    child: "headings",
    usage:
      "### Scope\n\n| Item | Owner |\n| --- | --- |\n| CLI copies files | priya |",
  },
  "graph-compare": {
    data: "rows",
    child: "table",
    usage: "| | Solo | Studio |\n| --- | --- | --- |\n| Registry | yes | yes |",
  },
  "graph-matrix": {
    data: "rows",
    child: "table",
    usage: "| | Pos | Neg |\n| --- | --- | --- |\n| Pos | 41 | 3 |",
  },
  "graph-heatmap": {
    data: "rows",
    child: "table",
    usage: "| | 0 | 4 | 8 |\n| --- | --- | --- | --- |\n| Mon | 0 | 1 | 4 |",
  },
  "graph-invoice": {
    data: "items",
    child: "table",
    usage: "| Description | Amount |\n| --- | --- |\n| Design system | 4,200 |",
  },
  "graph-bars": {
    data: "from",
    child: "list",
    usage: "- before: 2 4 3 5 2",
  },
  "graph-cells": {
    data: "items",
    child: "list",
    usage: "- fragments: 1 0 1 0 0 / 0 1 0 1 0",
  },
}

/** Props that also read a plain string, so MDX attributes stay short. */
const STRING_PROPS: Record<string, Record<string, string>> = {
  "graph-spark": { data: 'number[] | "2 3 4"' },
  "graph-plot": { data: 'number[] | "2 3 4"' },
  "graph-kpi": { data: 'number[] | "2 3 4"' },
  "graph-meter": { value: 'number | "67%"' },
  "graph-waffle": { value: 'number | "73%"' },
  "graph-uptime": { days: 'UptimeStatus[] | "ok ok down"' },
  "graph-calendar": { marks: 'number[] | CalendarMark[] | "12 18"' },
  "graph-table": {
    headers: 'string[] | "Agent, Tokens"',
    align: '("left" | "right")[] | "left right"',
  },
  "graph-sheet": {
    headers: 'string[] | "Item, Owner, Status"',
    align: '("left" | "right")[] | "left left left"',
  },
  "graph-compare": { columns: 'string[] | "Solo Studio"' },
  "graph-matrix": { columns: 'string[] | "Pos Neg"' },
  "graph-heatmap": { columns: 'string[] | "0 4 8 12"' },
}

function withProps(item: CatalogEntry): PropRow[] {
  let props = [...item.props]
  const child = CHILD_ITEMS[item.slug]
  const strings = STRING_PROPS[item.slug]

  if (strings) {
    props = props.map((prop) =>
      strings[prop.name] ? { ...prop, type: strings[prop.name] } : prop
    )
  }

  if (child) {
    props = props.map((prop) =>
      prop.name === child.data
        ? {
            ...prop,
            description: `${prop.description} Optional when children are Markdown.`,
          }
        : prop
    )
    const at = props.findIndex((prop) => prop.name === child.data)
    props.splice(at === -1 ? 0 : at + 1, 0, {
      name: "children",
      type: "Markdown",
      description: `${child.usage}${child.note ? ` ${child.note}` : ""}`,
    })
  }

  const cornerAt = props.findIndex((prop) => prop.name === "corner")
  if (cornerAt !== -1) {
    props.splice(cornerAt + 1, 0, frameProp)
  }

  if (PALETTE_SLUGS.has(item.slug)) {
    const at = props.findIndex((prop) => prop.name === "corner")
    props.splice(at === -1 ? props.length : at, 0, paletteProp)
  }

  return props
}

export const components: ComponentDoc[] = [...catalog]
  .sort(
    (a, b) =>
      (rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
      (rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER)
  )
  .map((item) => {
    const hint = CHOOSER[item.slug]
    const child = CHILD_ITEMS[item.slug]

    return {
      ...item,
      category: categoryOf.get(item.slug) ?? "charts",
      props: withProps(item),
      mdx: item.mdx ?? child?.usage,
      ...(hint ? { when: hint.when, not: hint.not } : {}),
    }
  })

export function componentsByCategory() {
  return CATEGORIES.map((category) => ({
    ...category,
    items: components.filter((item) => item.category === category.id),
  })).filter((group) => group.items.length > 0)
}

export function getComponent(slug: string) {
  return components.find((item) => item.slug === slug)
}
