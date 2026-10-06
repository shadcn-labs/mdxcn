import type { MetadataRoute } from "next"

import { components } from "@/lib/docs/catalog"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/agents",
    "/comark",
    "/knap",
    "/developers",
    "/developers/deprecation",
    "/about",
    "/shadcn-labs",
    "/contact",
    "/privacy",
    "/docs",
    "/docs/installation",
    "/docs/examples",
    "/docs/grammar",
    "/docs/mdx",
    "/docs/comark",
    "/docs/knap",
    "/docs/skill",
    ...components.map((item) => `/docs/${item.slug}`),
  ]

  return paths.map((path) => ({
    url: path === "/" ? SITE_URL : new URL(path, SITE_URL).toString(),
  }))
}
