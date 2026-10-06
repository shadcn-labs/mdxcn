import { GITHUB_URL } from "@/lib/github"
import { SITE_URL } from "@/lib/site"

export const SKILL_INSTALL = "mdxcn"
export const SKILL_DIR = "skills/mdxcn"
export const SKILL_URL = `${GITHUB_URL}/tree/main/${SKILL_DIR}`

export type SkillGraph = {
  name: string
  slug: string
}

export type SkillChooserRow = {
  writing: string
  graphs: SkillGraph[]
}

export type SkillAgent = {
  id: "cursor" | "claude" | "codex" | "opencode"
  name: string
  project: string
  personal: string
}

export const skillAgents: SkillAgent[] = [
  {
    id: "cursor",
    name: "Cursor",
    project: ".cursor/skills",
    personal: "~/.cursor/skills",
  },
  {
    id: "claude",
    name: "Claude Code",
    project: ".claude/skills",
    personal: "~/.claude/skills",
  },
  {
    id: "codex",
    name: "Codex",
    project: ".agents/skills",
    personal: "~/.agents/skills",
  },
  {
    id: "opencode",
    name: "OpenCode",
    project: ".opencode/skills",
    personal: "~/.config/opencode/skills",
  },
]

export const skillChooser: SkillChooserRow[] = [
  {
    writing: "A path or a refactor",
    graphs: [
      { name: "GraphFlow", slug: "graph-flow" },
      { name: "GraphTimeline", slug: "graph-timeline" },
    ],
  },
  {
    writing: "An incident",
    graphs: [
      { name: "GraphTimeline", slug: "graph-timeline" },
      { name: "GraphUptime", slug: "graph-uptime" },
    ],
  },
  {
    writing: "Pick A vs B",
    graphs: [
      { name: "GraphCompare", slug: "graph-compare" },
      { name: "GraphRank", slug: "graph-rank" },
    ],
  },
  {
    writing: "What a PR changed",
    graphs: [
      { name: "GraphDiff", slug: "graph-diff" },
      { name: "GraphSlope", slug: "graph-slope" },
    ],
  },
  {
    writing: "Overlapping work",
    graphs: [
      { name: "GraphGantt", slug: "graph-gantt" },
      { name: "GraphStat", slug: "graph-stat" },
    ],
  },
  {
    writing: "A migration in flight",
    graphs: [
      { name: "GraphMeter", slug: "graph-meter" },
      { name: "GraphKpi", slug: "graph-kpi" },
    ],
  },
  {
    writing: "One headline number",
    graphs: [
      { name: "GraphKpi", slug: "graph-kpi" },
      { name: "GraphStat", slug: "graph-stat" },
    ],
  },
  {
    writing: "An RFC or a launch list",
    graphs: [
      { name: "GraphSheet", slug: "graph-sheet" },
      { name: "GraphCheck", slug: "graph-check" },
    ],
  },
  {
    writing: "Nested files",
    graphs: [{ name: "GraphTree", slug: "graph-tree" }],
  },
  {
    writing: "A decision or an ADR",
    graphs: [
      { name: "Decision", slug: "decision" },
      { name: "GraphScore", slug: "graph-score" },
    ],
  },
  {
    writing: "A roadmap or a sprint",
    graphs: [
      { name: "GraphBoard", slug: "graph-board" },
      { name: "GraphCheck", slug: "graph-check" },
    ],
  },
  {
    writing: "A code sample to explain",
    graphs: [
      { name: "Annotate", slug: "annotate" },
      { name: "Terminal", slug: "terminal" },
    ],
  },
  {
    writing: "An agent session",
    graphs: [
      { name: "Chat", slug: "chat" },
      { name: "GraphDiff", slug: "graph-diff" },
    ],
  },
  {
    writing: "Setup or an API",
    graphs: [
      { name: "Env", slug: "env" },
      { name: "Endpoint", slug: "endpoint" },
    ],
  },
]

export const skillRules = [
  "At most two graphs in a section. Prose between them.",
  "MDX: markdown children inside the tag, from the docs .mdx tab. Notion / README / GitHub / Linear: the fence from the docs .md tab. Comark: ::graph-* . Knap: graph_* filter. Do not invent ASCII.",
  "In MDX, write Markdown inside the tag. Bold is now, italic is next, label: value is a row, and '— note' is a side note. The rules are on /docs/grammar.",
  "Titles: short uppercase, drawn as [ TITLE ].",
  "Labels: lowercase, plain (auth middleware, not AuthMiddleware Layer).",
  "Copy the markdown children from docs or recipes. Paste the official fence when the host cannot render MDX. Props still work when the data is already JavaScript. Do not invent APIs, extra hues, or chart libraries.",
  'palette="duo" / "multi" only when a second or third series needs it.',
  "Motion is already in the components. Do not add loops or pulses.",
]

export type SkillExample = {
  label: string
  hint: string
  prompt: string
}

export const skillExamples: SkillExample[] = [
  {
    label: "Refactor",
    hint: "GraphFlow, then GraphTimeline",
    prompt: `We're moving session checks out of route handlers into middleware. Write a short plan for the team.

Use mdxcn for the before/after request path and the week-by-week rollout. Prose between the two figures. Don't draw SVG.`,
  },
  {
    label: "Incident",
    hint: "GraphTimeline, then GraphUptime",
    prompt: `Draft a tight postmortem: p95 crossed 800ms at 14:02, we rolled back the cache flag at 14:11, the write-up is still open.

Use mdxcn: a timeline of the night, then the days users felt it. No SVG.`,
  },
  {
    label: "Pull request",
    hint: "GraphDiff, then GraphSlope",
    prompt: `Leave a PR review comment on the auth refactor. Summarize what files moved, then show how coverage changed on main vs this branch.

    Use mdxcn from this project. At most two figures. Don't invent APIs or draw SVG.`,
  },
  {
    label: "Pick one",
    hint: "GraphCompare, then GraphRank",
    prompt: `We're choosing a queue: BullMQ vs SQS. Write the tradeoff for the RFC.

Use mdxcn: a feature matrix, and bundle size only if it matters. Don't draw SVG.`,
  },
  {
    label: "README",
    hint: "Fenced ASCII, not JSX",
    prompt: `Add a launch section to the README. It's a .md file, no React.

Use mdxcn: a punch list (the GraphCheck fence), plus a grouped table if one helps. Paste the official fenced ASCII from llms.txt. Don't paste JSX.`,
  },
  {
    label: "Comark",
    hint: "::graph-timeline, then ::graph-uptime",
    prompt: `Write this postmortem as a Comark Markdown file. p95 crossed 800ms at 14:02, rollback at 14:11.

Use ::graph-* blocks with YAML props. At most two figures. Don't paste JSX. Don't draw SVG.`,
  },
  {
    label: "Knap",
    hint: "{{ events | graph_timeline }}, then {{ uptime | graph_uptime }}",
    prompt: `Write a Knap template for this postmortem. p95 crossed 800ms at 14:02, rollback at 14:11.

Pipe the graph props through graph_* filters so the output is the official fenced ASCII. At most two figures. Don't paste JSX. Don't draw SVG.`,
  },
]

export function skillCurl(origin: string, dir: string) {
  const host = origin || SITE_URL
  return `mkdir -p ${dir}/${SKILL_INSTALL}
curl -fsSL ${host}/skill.md -o ${dir}/${SKILL_INSTALL}/SKILL.md
curl -fsSL ${host}/skill/recipes.md -o ${dir}/${SKILL_INSTALL}/recipes.md`
}

export function skillCopyFromRepo(dir: string) {
  return `cp -R skills/mdxcn ${dir}/${SKILL_INSTALL}`
}

export function skillPrompt(origin: string, dir = ".agents/skills") {
  const host = origin || SITE_URL
  return `Copy the mdxcn skill into this project. It is a SKILL.md (Agent Skills). It tells you when to put a framed graph next to the prose, which component to pick, and whether to write JSX, a ::graph-* block for Comark, a graph_* filter for Knap, or paste the official fenced ASCII. Do not draw SVG. Do not invent ASCII art.

Put it in the skills folder this agent already reads (${dir}/${SKILL_INSTALL}). If this repo uses a different skills directory (.cursor/skills, .claude/skills, .agents/skills, .opencode/skills), use that instead.

${skillCurl(host, dir)}

If the graph files are missing and the host is React, install them first:

pnpm dlx shadcn@latest add ${host}/r/all.json

Fetch ${host}/agents for the write and read story. Fetch ${host}/llms.txt for the chooser, the fenced figures, the Comark blocks, and the Knap filters. In an MDX file, copy the .mdx tab from ${host}/docs, which is Markdown inside the tag. Paste the .md fence when the host cannot render MDX. Copy ::graph-* from ${host}/docs/comark when the host is Comark. Copy graph_* filters from ${host}/docs/knap when the host is Knap.`
}
