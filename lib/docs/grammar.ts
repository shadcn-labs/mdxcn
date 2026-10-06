import { SITE_URL } from "@/lib/site"

/**
 * The Markdown every mdxcn component reads. One table, so an agent learns ten
 * rules instead of fifty prop APIs. Drives /docs/grammar, /llms.txt
 * `## Grammar`, and the skill.
 */
export type GrammarRule = {
  /** What you type. */
  write: string
  /** What it means to the component. */
  means: string
  /** Who reads it. */
  read: string
}

export const GRAMMAR_DESCRIPTION =
  "The Markdown every mdxcn component reads. Bold is now, italic is next, label: value is a row, and '— note' is a side note. The same grammar works as MDX children, a Comark block body, a Knap body, and the fenced ASCII."

export const GRAMMAR: GrammarRule[] = [
  {
    write: "**bold**",
    means: "now, chosen, the total, the row to read. Gets the accent.",
    read: "Timeline, Steps, Board, Decision, Diff, Spec, Stat, Score, Keys, Faq, Tree, Calendar (today), Env (required)",
  },
  {
    write: "*italic*",
    means: "next, rejected, an aside. Recedes.",
    read: "Timeline, Steps, Board, Decision, Chat",
  },
  {
    write: "- label: value",
    means: "one row. The label is everything before the first `: `.",
    read: "Spec, Timeline, Diff, Bullet, Slope, Score, Keys, Chat, Changelog, Calendar, Activity, Plot",
  },
  {
    write: "x — note",
    means:
      "a side note, a reason, or a caption. Muted, under or after the item.",
    read: "Check, Tree, Stat, Timeline, Board, Decision, Env, Meter, Waffle, Spark, KPI, Timer, Countdown",
  },
  {
    write: "a → b → c",
    means: "a path. `->` works too.",
    read: "Flow, Slope",
  },
  {
    write: "- [x] done",
    means: "a box. `[ ]` is open.",
    read: "Check",
  },
  {
    write: "nested list",
    means: "children: sub-tasks, folders.",
    read: "Tree, Check",
  },
  {
    write: "blank line + indented paragraph",
    means:
      "the item's body. Leave blank lines between items, indent the paragraph.",
    read: "Steps, Timeline, Spec, Chat",
  },
  {
    write: "### heading",
    means: "a section, a column, or a question.",
    read: "Sheet, Board, Faq",
  },
  {
    write: "| table |",
    means: "data. A last row in **bold** or starting `Total` is the footer.",
    read: "Table, Sheet, Compare, Matrix, Heatmap, Invoice, Endpoint",
  },
  {
    write: "```fence",
    means: "raw lines. The language becomes the title where it helps.",
    read: "Terminal, Annotate, Env, Endpoint",
  },
  {
    write: "code // (1)",
    means: "a marker. Item 1 of the ordered list after the fence explains it.",
    read: "Annotate",
  },
  {
    write: "~~old~~ new",
    means: "a rewrite: one removed line, one added line.",
    read: "Diff",
  },
  {
    write: "ok*40",
    means: "a run: forty of them. Works in any list of values.",
    read: "Uptime, Activity, Spark, Plot, KPI, Bars",
  },
]

/** Plain Markdown that `withMdxcn` upgrades. Still reads right on GitHub. */
export const UPGRADES: GrammarRule[] = [
  {
    write: "> [!WARNING]",
    means:
      "Callout. NOTE, TIP, IMPORTANT, WARNING, CAUTION, and the Obsidian names. Text after the marker is the title.",
    read: "withMdxcn → Callout",
  },
  {
    write: "> … \\n> — Name, Where",
    means:
      "Quote. The last line starts with an em dash; the comma splits name and source.",
    read: "withMdxcn → Quote",
  },
  {
    write: "```console",
    means: "Terminal. Also sh / bash / zsh fences that have `$ ` prompts.",
    read: "withMdxcn → Terminal",
  },
  {
    write: "text[^1]",
    means: "Footnotes. The GFM section at the end of the page gets a frame.",
    read: "withMdxcn → Footnotes",
  },
]

export const GRAMMAR_SAMPLE = {
  mdx: `<GraphTimeline title="NIGHT">

- 14:02: p95 crossed 800ms — paged the on-call
- **14:11: rolled back the cache flag**
- *14:40: write the postmortem*

</GraphTimeline>`,
  comark: `::graph-timeline{title="NIGHT"}
- 14:02: p95 crossed 800ms — paged the on-call
- **14:11: rolled back the cache flag**
- *14:40: write the postmortem*
::`,
  knap: `{{ night | graph_timeline:"NIGHT" }}`,
}

function cell(text: string) {
  return text.replaceAll("|", "\\|")
}

export function grammarMarkdown(origin = SITE_URL) {
  const host = origin || SITE_URL
  const rows = GRAMMAR.map(
    (rule) =>
      `| \`${cell(rule.write)}\` | ${cell(rule.means)} | ${cell(rule.read)} |`
  )
  const upgrades = UPGRADES.map(
    (rule) =>
      `| \`${cell(rule.write)}\` | ${cell(rule.means)} | ${cell(rule.read)} |`
  )

  return `## Grammar

Every component reads the same Markdown. Learn these rules once. They work as MDX children, as the body of a Comark block, as the \`body\` of a Knap content filter, and they draw the same fenced ASCII.
${host}/docs/grammar

| Write | Means | Read by |
| --- | --- | --- |
${rows.join("\n")}

### Upgrades

Wrap your MDX components in \`withMdxcn\` (${host}/docs/mdx) and plain Markdown becomes a frame. GitHub still renders the original.

| Write | Means | Becomes |
| --- | --- | --- |
${upgrades.join("\n")}

### Same figure, every host

MDX:

${GRAMMAR_SAMPLE.mdx}

Comark (the body is the same list):

${GRAMMAR_SAMPLE.comark}`
}
