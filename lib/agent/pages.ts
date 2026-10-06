import {
  aboutMarkdown,
  contactMarkdown,
  deprecationMarkdown,
  developersMarkdown,
  homeMarkdown,
  privacyMarkdown,
} from "@/lib/agent/copy"
import { components, getComponent } from "@/lib/docs/catalog"
import { pageMarkdown } from "@/lib/docs/prompt"
import { recipes, recipeCopy } from "@/lib/docs/recipes"
import {
  skillAgents,
  skillChooser,
  skillExamples,
  skillRules,
} from "@/lib/docs/skill"
import { readSkillFile } from "@/lib/docs/skill-files"
import { AGENTS_DESCRIPTION, DOCS_DESCRIPTION, SITE_URL } from "@/lib/site"
import { COMARK_DESCRIPTION, COMARK_WIRE } from "@/lib/docs/comark"
import { GRAMMAR_DESCRIPTION, grammarMarkdown } from "@/lib/docs/grammar"
import {
  MDX_BEFORE,
  MDX_DESCRIPTION,
  MDX_OPTIONS,
  MDX_OVERRIDE,
  MDX_WHY,
  MDX_WIRE,
} from "@/lib/docs/mdx-wiring"
import {
  KNAP_API_URL,
  KNAP_DESCRIPTION,
  KNAP_URL,
  KNAP_WIRE,
} from "@/lib/docs/knap"

function hostOf(origin?: string) {
  return origin || SITE_URL
}

function docsIntro(origin: string) {
  const extra = [
    "## components",
    "",
    ...components.map(
      (item) => `- ${item.title} (${item.name}): ${item.description}`
    ),
  ].join("\n")

  return pageMarkdown({
    origin,
    title: "introduction",
    description: DOCS_DESCRIPTION,
    registry: "all",
    extra,
  })
}

function installationMarkdown(origin: string) {
  return pageMarkdown({
    origin,
    title: "installation",
    description:
      "write markdown children inside the tag. paste the fence when the file cannot render mdx. the cli copies the source into your project so the tags exist. there is no npm package. you need motion.",
    registry: "all",
    extra: `## mdx

register the parent once in mdx-components.tsx. the .mdx tab is what you write. the .md tab is the framed figure, for notion or a readme.

## agents

$ORIGIN/agents covers writing and reading: markdown inside the tag in mdx, the code block in a readme, ::graph-* in comark, graph_* in knap. $ORIGIN/docs/skill is the skill.md. $ORIGIN/llms.txt is the chooser, the fences, the comark blocks, and the knap filters.

## one component

the shadcn cli copies the source, or copy the files from github.

pnpm dlx shadcn@latest add $ORIGIN/r/graph-table.json

## everything

installs every graph and the shared frame code into registry/default.

pnpm dlx shadcn@latest add $ORIGIN/r/all.json

## namespace

add the registry once in components.json, then install components by name.

pnpm dlx shadcn@latest registry add @mdxcn=$ORIGIN/r/{name}.json

then:

pnpm dlx shadcn@latest add @mdxcn/graph-table

## import

files land under @/registry.

import { GraphTable } from "@/registry/default/graph-table/graph-table"`,
  })
}

function examplesMarkdown(origin: string) {
  const extra = [
    "## examples",
    "",
    ...recipes.flatMap((item) => [
      `### ${item.title}`,
      "",
      item.story,
      "",
      recipeCopy(item),
      "",
    ]),
  ].join("\n")

  return pageMarkdown({
    origin,
    title: "examples",
    description:
      "Short write-ups with two graphs each. A refactor, an incident, a tradeoff, a pull request.",
    extra,
  })
}

function grammarDocsMarkdown(origin: string) {
  return pageMarkdown({
    origin,
    title: "grammar",
    description: GRAMMAR_DESCRIPTION,
    extra: grammarMarkdown(origin),
  })
}

function mdxDocsMarkdown(origin: string) {
  return pageMarkdown({
    origin,
    title: "mdx",
    description: MDX_DESCRIPTION,
    registry: "mdx",
    extra: `## Wire

${MDX_WIRE}

## Upgrades

${MDX_BEFORE}

## Overrides

${MDX_WHY}

${MDX_OVERRIDE}

## Options

${MDX_OPTIONS}`,
  })
}

function comarkDocsMarkdown(origin: string) {
  return pageMarkdown({
    origin,
    title: "comark",
    description: COMARK_DESCRIPTION,
    registry: "graph-comark",
    extra: `## Wire

${COMARK_WIRE}

## Hosts

GitHub, Linear, and a README still get the fenced ASCII. They do not run Comark. Landing: $ORIGIN/comark.`,
  })
}

function comarkLandingMarkdown(origin: string) {
  return pageMarkdown({
    origin,
    title: "comark",
    description: COMARK_DESCRIPTION,
    extra: `Write figures as ::graph-* blocks in Markdown. Comark parses the file. These graphs render it.

## Wire

${COMARK_WIRE}

## Links

- Wiring: $ORIGIN/docs/comark
- Skill: $ORIGIN/docs/skill
- Demo: https://comark-demo.vercel.app
- Comark: https://comark.dev`,
  })
}

function knapDocsMarkdown(origin: string) {
  return pageMarkdown({
    origin,
    title: "knap",
    description: KNAP_DESCRIPTION,
    registry: "graph-knap",
    extra: `## Wire

${KNAP_WIRE}

## Hosts

Output is Markdown. GitHub and a README can open the fence. A Comark app can open ::graph-* if you passed comark. The Knap CLI does not load these filters. Landing: $ORIGIN/knap.`,
  })
}

function knapLandingMarkdown(origin: string) {
  return pageMarkdown({
    origin,
    title: "knap",
    description: KNAP_DESCRIPTION,
    extra: `Pipe graph props through a graph_* filter. Knap renders Markdown. These filters draw the official fence.

## Wire

${KNAP_WIRE}

## Links

- Wiring: $ORIGIN/docs/knap
- Skill: $ORIGIN/docs/skill
- Knap: ${KNAP_URL}
- API: ${KNAP_API_URL}`,
  })
}

async function skillMarkdown(origin: string) {
  const source = await readSkillFile("SKILL.md")
  const extra = [
    "## Install",
    "",
    "Same two files. Put them in the skills folder your agent already reads.",
    "",
    ...skillAgents.flatMap((item) => [
      `${item.name}: ${item.project}/mdxcn (project) or ${item.personal}/mdxcn (personal)`,
    ]),
    "",
    "curl -fsSL $ORIGIN/skill.md -o <dir>/mdxcn/SKILL.md",
    "curl -fsSL $ORIGIN/skill/recipes.md -o <dir>/mdxcn/recipes.md",
    "",
    "## What it does",
    "",
    "When the agent is explaining a path, an incident, a tradeoff, or a PR, it puts at most two framed graphs next to the prose. MDX gets markdown children inside the tag. A Comark app gets a ::graph-* block. A Knap template gets a graph_* filter. A README, GitHub comment, or Linear note gets the official fence from /llms.txt.",
    "",
    "## Files",
    "",
    source,
  ].join("\n")

  return pageMarkdown({
    origin,
    title: "skill",
    description:
      "A SKILL.md that tells the agent which graph to put next to the prose.",
    extra,
  })
}

function componentMarkdown(slug: string, origin: string) {
  const item = getComponent(slug)
  if (!item) {
    return null
  }

  return pageMarkdown({
    origin,
    title: item.title,
    description: item.description,
    kicker: item.name,
    registry: item.registry,
    doc: item,
  })
}

function agentsMarkdown(origin: string) {
  const host = hostOf(origin)
  const picks = skillChooser
    .map(
      (row) =>
        `- ${row.writing}: ${row.graphs.map((graph) => graph.name).join(", then ")}`
    )
    .join("\n")
  const prompts = skillExamples
    .map((item) => `### ${item.label}\n\n${item.prompt}`)
    .join("\n\n")

  return `# for agents

${AGENTS_DESCRIPTION}

When a write-up needs a figure, the skill picks which graph to use. In MDX, wrap markdown children in the tag. In a Comark app, write a ::graph-* block. In a Knap template, pipe a graph_* filter. In a README, PR, or Linear note, paste the official fence.

## Writing and reading

On write, emit at most two graphs next to the claim. Use Markdown inside the tag in MDX, a ::graph-* block in Comark, a Knap filter when data becomes Markdown, or the code block from ${host}/llms.txt when the host cannot run a renderer.

On read, the figure is still characters in the file, so opening the MDX shows labels and values. Edit the labels; do not replace a graph with SVG.

## How to call it

1. Put ${host}/skill.md and ${host}/skill/recipes.md in the skills folder the agent already reads.
2. Write the figure. In MDX, wrap markdown children in the tag. In a README, PR, or Linear, paste the official fence from ${host}/llms.txt. In Comark, a ::graph-* block. In Knap, a graph_* filter.
3. If the MDX app does not have the tags yet: \`pnpm dlx shadcn@latest add ${host}/r/all.json\`.
4. Ask for a write-up. At most two graphs. Prose between them.

## Chooser

${picks}

## Rules

${skillRules.map((rule) => `- ${rule}`).join("\n")}

## Try it

${prompts}

## Links

- Skill install: ${host}/docs/skill
- Comark: ${host}/comark
- Comark wiring: ${host}/docs/comark
- Knap: ${host}/knap
- Knap wiring: ${host}/docs/knap
- Examples: ${host}/docs/examples
- OpenAPI: ${host}/openapi.json
- JSON catalog: ${host}/api/v1/components
- developer api: ${host}/developers
- agents.md: ${host}/agents.md
`
}

export async function markdownForPath(path: string, origin = SITE_URL) {
  const host = hostOf(origin)
  const clean = path.replace(/\.md$/i, "") || "/"

  switch (clean) {
    case "/":
      return homeMarkdown(host)
    case "/agents":
      return agentsMarkdown(host)
    case "/developers":
      return developersMarkdown(host)
    case "/developers/deprecation":
      return deprecationMarkdown(host)
    case "/about":
      return aboutMarkdown(host)
    case "/contact":
      return contactMarkdown(host)
    case "/privacy":
      return privacyMarkdown(host)
    case "/docs":
      return docsIntro(host)
    case "/docs/installation":
      return installationMarkdown(host)
    case "/docs/examples":
      return examplesMarkdown(host)
    case "/docs/grammar":
      return grammarDocsMarkdown(host)
    case "/docs/mdx":
      return mdxDocsMarkdown(host)
    case "/docs/comark":
      return comarkDocsMarkdown(host)
    case "/comark":
      return comarkLandingMarkdown(host)
    case "/docs/knap":
      return knapDocsMarkdown(host)
    case "/knap":
      return knapLandingMarkdown(host)
    case "/docs/skill":
      return skillMarkdown(host)
    default:
      break
  }

  const docMatch = /^\/docs\/([a-z0-9-]+)$/.exec(clean)
  if (docMatch?.[1]) {
    return componentMarkdown(docMatch[1], host)
  }

  return null
}

export function knownMarkdownPaths() {
  return [
    "/",
    "/agents",
    "/developers",
    "/developers/deprecation",
    "/about",
    "/contact",
    "/privacy",
    "/docs",
    "/docs/installation",
    "/docs/examples",
    "/docs/grammar",
    "/docs/mdx",
    "/docs/comark",
    "/comark",
    "/docs/knap",
    "/knap",
    "/docs/skill",
    ...components.map((item) => `/docs/${item.slug}`),
  ]
}
