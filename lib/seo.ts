import type { Metadata } from "next"

import { components, type ComponentDoc } from "@/lib/docs/catalog"
import { GITHUB_URL } from "@/lib/github"
import { SHADCN_LABS_URL, SHADCN_LABS_X } from "@/lib/shadcn-labs"
import {
  AGENTS_DESCRIPTION,
  DOCS_DESCRIPTION,
  SITE_ALTERNATE_NAMES,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_NAME_SHORT,
  SITE_OG_IMAGE,
  SITE_TITLE,
  SITE_TWITTER,
  SITE_URL,
} from "@/lib/site"

export function pageMeta({
  title,
  description,
  path,
}: {
  title?: string
  description: string
  path: string
}): Metadata {
  const ogTitle = title ? `${title} · ${SITE_NAME_SHORT}` : SITE_TITLE

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      type: "website",
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      site: SITE_TWITTER,
      creator: SITE_TWITTER,
      images: [SITE_OG_IMAGE],
    },
  }
}

const author = {
  "@type": "Person" as const,
  name: SITE_AUTHOR.name,
  url: SITE_AUTHOR.url,
  jobTitle: SITE_AUTHOR.jobTitle,
  description: SITE_DESCRIPTION,
  sameAs: [SITE_AUTHOR.url, SITE_AUTHOR.x],
}

export function developersJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebAPI",
        name: "mdxcn API",
        description:
          "Read-only JSON catalog and machine-readable docs for mdxcn.",
        url: `${SITE_URL}/developers`,
        documentation: `${SITE_URL}/openapi.json`,
        provider: organizationNode(),
      },
      breadcrumbJsonLd([
        { name: "home", path: "/" },
        { name: "mdxcn api", path: "/developers" },
      ]),
    ],
  }
}

function organizationNode() {
  return {
    "@type": "Organization" as const,
    name: "Shadcn Labs",
    url: SHADCN_LABS_URL,
    logo: `${SITE_URL}/shadcn-labs-brand/shadcn-labs-logomark.svg`,
    sameAs: ["https://github.com/shadcn-labs", SHADCN_LABS_X],
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "WebSite",
        name: SITE_NAME,
        alternateName: [...SITE_ALTERNATE_NAMES],
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        keywords: SITE_KEYWORDS.join(", "),
        inLanguage: "en",
        author,
        publisher: author,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/docs?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        alternateName: [...SITE_ALTERNATE_NAMES],
        description: SITE_DESCRIPTION,
        keywords: SITE_KEYWORDS.join(", "),
        url: SITE_URL,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        license: `${GITHUB_URL}/blob/main/LICENSE`,
        author,
        sameAs: [GITHUB_URL],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "SoftwareSourceCode",
        name: SITE_NAME_SHORT,
        alternateName: [...SITE_ALTERNATE_NAMES],
        description: SITE_DESCRIPTION,
        keywords: SITE_KEYWORDS.join(", "),
        url: SITE_URL,
        codeRepository: GITHUB_URL,
        license: `${GITHUB_URL}/blob/main/LICENSE`,
        programmingLanguage: "TypeScript",
        runtimePlatform: "React",
        author,
      },
    ],
  }
}

export function webPageJsonLd({
  name,
  description,
  path,
}: {
  name: string
  description: string
  path: string
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name,
        description,
        url: `${SITE_URL}${path}`,
        author,
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      breadcrumbJsonLd([
        { name: "home", path: "/" },
        { name, path },
      ]),
    ],
  }
}

export function docsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "mdxcn components",
    description: DOCS_DESCRIPTION,
    url: `${SITE_URL}/docs`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: components.length,
      itemListElement: components.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: `${SITE_URL}/docs/${item.slug}`,
      })),
    },
  }
}

export function componentJsonLd(item: ComponentDoc) {
  const url = `${SITE_URL}/docs/${item.slug}`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: `${item.title} (${item.name})`,
        name: item.name,
        description: item.description,
        url,
        author,
        isPartOf: {
          "@type": "SoftwareSourceCode",
          name: SITE_NAME_SHORT,
          url: SITE_URL,
        },
      },
      breadcrumbJsonLd([
        { name: "home", path: "/" },
        { name: "docs", path: "/docs" },
        { name: item.title, path: `/docs/${item.slug}` },
      ]),
    ],
  }
}

export function skillJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: "Skill",
        description:
          "A SKILL.md that tells the agent which graph to put next to the prose.",
        url: `${SITE_URL}/docs/skill`,
        author,
      },
      breadcrumbJsonLd([
        { name: "home", path: "/" },
        { name: "docs", path: "/docs" },
        { name: "Skill", path: "/docs/skill" },
      ]),
    ],
  }
}

export function installationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: "installation",
        description:
          "Write markdown children in MDX. Paste the fence when the file cannot render. The CLI copies the tags.",
        url: `${SITE_URL}/docs/installation`,
        author,
      },
      breadcrumbJsonLd([
        { name: "home", path: "/" },
        { name: "docs", path: "/docs" },
        { name: "installation", path: "/docs/installation" },
      ]),
    ],
  }
}

export function agentsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "for agents",
        description: AGENTS_DESCRIPTION,
        url: `${SITE_URL}/agents`,
        author,
      },
      breadcrumbJsonLd([
        { name: "home", path: "/" },
        { name: "for agents", path: "/agents" },
      ]),
    ],
  }
}

function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).toString(),
    })),
  }
}
