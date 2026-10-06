export const SITE_URL = "https://mdxcn.dev"
export const SITE_HOST = "mdxcn.dev"
export const REGISTRY_SCOPE = "@mdxcn"

export function scopedRegistryInstall(name: string) {
  return `pnpm dlx shadcn@latest add ${REGISTRY_SCOPE}/${name}`
}
export const SITE_NAME = "mdxcn"
export const SITE_NAME_SHORT = "mdxcn"
/** Browser / OG homepage title — what people search for. */
export const SITE_TITLE = "mdxcn: markdown-friendly components"
export const SITE_TAGLINE = "markdown-friendly components."
export const SITE_KEYWORDS = [
  "mdxcn",
  "markdown-friendly components",
  "mdx components",
  "markdown components",
  "react mdx components",
  "markdown-friendly react components",
  "mdx callout",
  "mdx steps",
  "mdx charts",
  "ascii charts",
  "ascii diagrams",
  "markdown charts",
  "shadcn registry",
  "shadcn mdx",
  "comark",
  "knap",
  "mdxcn api",
] as const
export const SITE_DESCRIPTION =
  "markdown-friendly react components for mdx. callouts, steps, terminals, charts, and timelines that sit between paragraphs. the shadcn cli copies them into your project. there is no npm package."
export const SITE_ALTERNATE_NAMES = [
  "mdxcn.dev",
  "mdxcn",
  "mdx",
  "markdown-friendly components",
  "mdx components",
] as const
export const AGENTS_DESCRIPTION =
  "a skill and chooser that tell an agent which mdxcn component to put next to the prose, and whether to write mdx, a ::graph-* block, a knap filter, or fenced ascii it can read back later."
export const DOCS_DESCRIPTION =
  "markdown-friendly components for mdx. the .md tab is the framed figure, which you can paste into notion or a readme. to render it live, register the component once in mdx-components.tsx."
export const SITE_NAV = [
  { href: "/docs", label: "components" },
  { href: "/docs/examples", label: "examples" },
  { href: "/agents", label: "agents" },
  { href: "/comark", label: "comark" },
  { href: "/knap", label: "knap" },
] as const
export const SITE_TWITTER = "@kshvbgde"
export const SITE_EMAIL = "hi@kshv.me"
export const SITE_AUTHOR = {
  name: "Keshav Bagaade",
  url: "https://github.com/keshav-exe/mdxcn",
  x: "https://x.com/kshvbgde",
  jobTitle: "Engineer",
}
