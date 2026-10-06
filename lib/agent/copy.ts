import { GITHUB_URL, GITHUB_REPO } from "@/lib/github"
import { SITE_AUTHOR, SITE_EMAIL, SITE_URL } from "@/lib/site"

export const HOME_WHAT =
  "mdxcn is a set of figures drawn with text, made for agents to put in their writing. In an MDX file, the agent writes Markdown inside a component tag. In a README, a PR, or Linear, it pastes the same figure as a code block. The React components render the tag on an MDX page, and the shadcn CLI copies them into your app. There is no npm package."

export const HOME_WRITE =
  "When an agent is writing a refactor, an incident, a tradeoff, or a PR, it can put at most two graphs next to the prose. MDX gets markdown children inside the tag. A Comark app gets a ::graph-* block. A Knap template gets a graph_* filter that emits the official fence. A README, GitHub comment, Linear note, or any file that cannot run a renderer gets the official fenced ASCII from /llms.txt. It should not invent SVG, Mermaid, or homemade ASCII."

export const HOME_READ =
  "Because the figure is characters in the file, opening the MDX later shows the labels and values, and the agent can edit the frame the same way it wrote it."

export const HOME_INSTALL = `pnpm dlx shadcn@latest add ${SITE_URL}/r/all.json`

export const HOME_NEXT =
  "Then copy the skill from /skill.md, or fetch /llms.txt if the skill is not installed. The catalog is /docs, Comark wiring is /docs/comark, Knap wiring is /docs/knap, and OpenAPI is /openapi.json."

export const HOME_API =
  "The JSON catalog is at /api/v1/components, OpenAPI at /openapi.json, and the developer portal at /developers. Every API response includes RateLimit-* headers (1000 GET requests per hour)."

export const HOME_CLI =
  "Install graphs with the shadcn CLI. There is no npm package. One command copies the source into your project."

export const HOME_BRAND = `${SITE_URL.replace("https://", "")} is the canonical site; the GitHub repo is ${GITHUB_REPO}. Search for mdxcn for docs, the API, and the agent skill.`

export function homeMarkdown(origin = SITE_URL) {
  const host = origin || SITE_URL

  return `# mdxcn

${HOME_WHAT}

${HOME_WRITE}

## write

Install the skill into the folder the agent already reads. Ask for a write-up. The chooser picks the graph. Copy the markdown children from the docs or a recipe, then swap the labels. Paste the fence when the host cannot render MDX.

## read

${HOME_READ}

## Install

${HOME_INSTALL}

${HOME_NEXT}

${HOME_API}

${HOME_CLI}

${HOME_BRAND}

## Links

- developer api: ${host}/developers
- OpenAPI: ${host}/openapi.json
- JSON catalog: ${host}/api/v1/components
- for agents: ${host}/agents
- Comark: ${host}/comark
- Knap: ${host}/knap
- agents.md: ${host}/agents.md
- Docs: ${host}/docs
- Examples: ${host}/docs/examples
- Skill: ${host}/docs/skill
- llms.txt: ${host}/llms.txt
- Sitemap: ${host}/sitemap.xml
`
}

export const ABOUT_PARAS = [
  `mdxcn is a set of MDX components that draw figures with text. ${SITE_AUTHOR.name} publishes the source on GitHub under the MIT license. An agent writes Markdown inside a component tag, and the MDX page renders it in a frame. The shadcn CLI copies the files into your app. There is no npm package.`,
  "Each graph sits in a dashed frame with a title on the top edge. Drawing graphs use one accent by default. Most graphs have an official fenced ASCII for README files, GitHub, Linear, and PR comments. Comark apps can render the same figures from ::graph-* blocks in a plain .md file. Knap templates can emit that fence, or a ::graph-* block, from data.",
  `The site at ${SITE_URL.replace("https://", "")} is the catalog, the shadcn registry, and the agent skill. The skill file tells an agent which graph to put next to its prose, and what to write: Markdown inside the tag in MDX, a ::graph-* block in Comark, a graph_* filter in Knap, or the code block in a README.`,
  `Source: ${GITHUB_URL}. Mail: ${SITE_EMAIL}.`,
] as const

export const CONTACT_PARAS = [
  `Mail ${SITE_AUTHOR.name} at ${SITE_EMAIL}. That address is for the library, the site, and questions about mdxcn or the registry.`,
  `Bugs and patches go to ${GITHUB_URL}/issues. The repository is public. The license is MIT.`,
  `On X: ${SITE_AUTHOR.x}. The handle is @kshvbgde.`,
  "There is no support desk and no SLA. If a graph is wrong, open an issue with the slug and the props you passed. For the skill or the registry, start on /docs/skill or /openapi.json. Do not send secrets over email.",
] as const

export const DEVELOPERS_PARAS = [
  "mdxcn exposes a read-only JSON API for agents and integrators. Version 1 is prefixed at /api/v1/. No API keys. Responses include RateLimit-* headers (1000 GET requests per hour). Errors are RFC 9457 application/problem+json with code, detail, and recovery links.",
  "Start at /api/v1 for the endpoint index, /api/v1/health for a health check, and /api/v1/components for the full graph catalog. OpenAPI 3.1 is at /openapi.json. RFC 9727 API catalog is at /.well-known/api-catalog.",
  `Install graph source files with the shadcn CLI: pnpm dlx shadcn@latest add ${SITE_URL}/r/all.json. There is no npm package.`,
  "Agent resources: /agents and /agents.md for the write/read story, /skill.md for the skill file, /llms.txt for the chooser, fenced ASCII blocks, Comark blocks, and Knap filters. Comark wiring: /docs/comark. Knap wiring: /docs/knap. Deprecation policy: /developers/deprecation.",
] as const

export const DEPRECATION_PARAS = [
  "mdxcn API version 1 is stable under the /api/v1/ URL prefix. Breaking changes ship as /api/v2/ with at least six months notice on this page and in the OpenAPI description.",
  "When an endpoint or field is deprecated, responses may include Deprecation: true and Sunset: <HTTP-date> headers. After the sunset date the route returns 410 Gone with application/problem+json.",
  "The shadcn registry JSON under /r/ follows the same semver as the site. Registry item slugs are not removed without a replacement slug documented in the OpenAPI changelog.",
  `Subscribe to GitHub releases on ${GITHUB_REPO} for API and registry changes. Mail hi@kshv.me if you depend on a private integration.`,
] as const

export const PRIVACY_PARAS = [
  "mdxcn does not have accounts, logins, or user profiles. Copying a graph into your repo does not send us the file.",
  "The site is hosted on Vercel. Vercel Analytics records page views. We do not run ads, and we do not sell visitor data.",
  `The header may fetch the public GitHub star count for ${GITHUB_REPO}. That request goes to api.github.com. We do not send your identity with it.`,
  `Mail to ${SITE_EMAIL} is ordinary email. Do not send secrets. The registry JSON under /r/ and the skill files are public.`,
  "If this policy changes, the new text replaces this page. There is no separate legal entity behind the project beyond the author named on /about.",
] as const

export function developersMarkdown(origin = SITE_URL) {
  const host = origin || SITE_URL

  return `# mdxcn developer api

${DEVELOPERS_PARAS.join("\n\n")}

## Endpoints

- API index: ${host}/api/v1
- Health: ${host}/api/v1/health
- Catalog: ${host}/api/v1/components
- OpenAPI: ${host}/openapi.json
- Deprecation: ${host}/developers/deprecation
`
}

export function deprecationMarkdown(origin = SITE_URL) {
  return `# mdxcn API deprecation

${DEPRECATION_PARAS.join("\n\n")}

- developer api: ${origin}/developers
- OpenAPI: ${origin}/openapi.json
`
}

export function aboutMarkdown(origin = SITE_URL) {
  return `# about mdxcn

${ABOUT_PARAS.join("\n\n")}

## Also

- contact: ${origin}/contact
- privacy: ${origin}/privacy
- Source: ${GITHUB_URL}
`
}

export function contactMarkdown(origin = SITE_URL) {
  return `# contact mdxcn

${CONTACT_PARAS.join("\n\n")}

- about: ${origin}/about
- privacy: ${origin}/privacy
`
}

export function privacyMarkdown(origin = SITE_URL) {
  return `# privacy · mdxcn

${PRIVACY_PARAS.join("\n\n")}

- about: ${origin}/about
- contact: ${origin}/contact
`
}

export function copyLength(paras: readonly string[]) {
  return paras.join(" ").length
}
