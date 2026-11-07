import type { Metadata } from "next"
import Link from "next/link"

import { SectionHeading } from "@/components/docs/section-heading"
import { Callout } from "@/components/graphs"
import { InstallCommand } from "@/components/docs/install"
import { DocsPageHeader } from "@/components/docs/page-header"
import { MonoLabel } from "@/components/docs/mono-label"
import { JsonLd } from "@/components/seo/json-ld"
import { SiteCorners, SiteMark, SiteRule } from "@/components/site/corners"
import { TextLink } from "@/components/site/prose"
import {
  components,
  componentsByCategory,
  getComponent,
} from "@/lib/docs/catalog"
import { mdxExample } from "@/lib/docs/ascii"
import { isNewSlug } from "@/lib/docs/new"
import { docsJsonLd, pageMeta } from "@/lib/seo"
import { DOCS_DESCRIPTION } from "@/lib/site"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"

export const metadata: Metadata = pageMeta({
  title: "introduction",
  description: DOCS_DESCRIPTION,
  path: "/docs",
})

const intro = `mdxcn is a set of React components for documentation, drawn with text: callouts, steps, timelines, tables and small charts. Every example in these docs has three tabs. .mdx is what you write in an MDX page, .tsx is the same figure in plain React, and .md is the figure as a code block you can paste into Notion, Linear or a README.`

/** The top of a component's plain-text figure, as a card thumbnail. */
function figureOf(slug: string) {
  const ascii = mdxExample(slug)?.ascii
  return ascii ? ascii.split("\n").slice(0, 8).join("\n") : null
}

export default function DocsPage() {
  const groups = componentsByCategory()
  const extra = [
    "## components",
    "",
    ...groups.flatMap((group) => [
      `### ${group.label}`,
      "",
      ...group.items.map(
        (item) =>
          `- ${item.title} (${item.name}): ${item.description}${item.mdx ? ` MDX: ${item.mdx}` : ""}`
      ),
      "",
    ]),
  ].join("\n")

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <JsonLd data={docsJsonLd()} />
      <DocsPageHeader
        copy={{
          description: intro,
          extra,
          registry: "all",
          title: "introduction",
        }}
        lead={intro}
        title="introduction"
      >
        <p className="max-w-[56ch] text-pretty text-muted-foreground">
          New here? Start with{" "}
          <TextLink href="/docs/installation">installation</TextLink> for the
          CLI and the <code className="font-mono">mdx-components</code> setup.{" "}
          <TextLink href="/docs/examples">Examples</TextLink> are complete
          write-ups with two figures each,{" "}
          <TextLink href="/agents">for agents</TextLink> covers the agent skill,
          and <TextLink href="/docs/comark">Comark</TextLink> and{" "}
          <TextLink href="/docs/knap">Knap</TextLink> render the same graphs
          from plain <code className="font-mono">.md</code> files.
        </p>
      </DocsPageHeader>

      <Callout type="tip">
        The .md tab is the figure itself: the dashed frame, the title and the
        glyphs, all as text. Paste it into Notion or a README and it looks the
        same there. The rules for writing it are on the{" "}
        <TextLink href="/docs/grammar">grammar</TextLink> page.
      </Callout>

      <div className="flex flex-col gap-4">
        <SectionHeading id="install">install</SectionHeading>
        <p className="max-w-[56ch] text-pretty text-muted-foreground">
          The CLI copies a component into your repo. You can also copy the files
          from GitHub by hand.
        </p>
        <InstallCommand doc={getComponent("callout")} name="callout" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between gap-4">
          <SectionHeading id="components">components</SectionHeading>
          <MonoLabel>{components.length} total</MonoLabel>
        </div>
        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <section className="flex flex-col gap-3" key={group.id}>
              <div className="flex flex-col gap-1">
                <h3 className="font-mono tracking-wide text-graph-accent">
                  [ {group.label} ]
                </h3>
                <p className="max-w-[56ch] text-pretty text-muted-foreground">
                  {group.blurb}
                </p>
              </div>
              <div className="relative isolate -mx-4 sm:-mx-6 lg:-mx-8">
                <SiteRule className="top-0" />
                <SiteRule className="bottom-0" />
                <SiteCorners />
                <SiteMark className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden" />
                <SiteMark className="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 max-sm:hidden" />
                <ul className="grid sm:grid-cols-2" role="list">
                  {group.items.map((item, index) => (
                    <li
                      className={cn(
                        "min-w-0",
                        "max-sm:[&:not(:first-child)]:border-t max-sm:[&:not(:first-child)]:border-dashed max-sm:[&:not(:first-child)]:border-site-rail",
                        "sm:[&:nth-child(n+3)]:border-t sm:[&:nth-child(n+3)]:border-dashed sm:[&:nth-child(n+3)]:border-site-rail",
                        "sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-dashed sm:[&:nth-child(odd)]:border-site-rail",
                        group.items.length % 2 === 1 &&
                          index === group.items.length - 1 &&
                          "sm:col-span-2 sm:[&:nth-child(odd)]:border-r-0"
                      )}
                      key={item.slug}
                    >
                      <Link
                        className="group flex h-full flex-col gap-4 px-4 py-6 transition-colors duration-150 ease-out hover:bg-muted/40 sm:px-6"
                        href={`/docs/${item.slug}`}
                      >
                        <div className="flex flex-col gap-2">
                          <p className="flex items-center gap-2 font-medium text-foreground">
                            {item.title}
                            {isNewSlug(item.slug) ? (
                              <span className="font-mono text-xs tracking-wide text-graph-accent">
                                new
                              </span>
                            ) : null}
                            <HugeiconsIcon
                              className="ml-auto shrink-0 text-muted-foreground transition-transform duration-200 ease-out-cubic group-hover:translate-x-1 group-hover:text-foreground"
                              icon={ArrowRight02Icon}
                              size={18}
                              strokeWidth={2}
                            />
                          </p>
                          <p className="max-w-[40ch] text-pretty text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        {figureOf(item.slug) ? (
                          <pre
                            aria-hidden="true"
                            className="mt-auto h-32 overflow-hidden bg-stage [mask-image:linear-gradient(to_bottom,black_60%,transparent)] px-3 py-3 font-mono text-[11px] leading-[1.35] text-graph-muted select-none group-hover:text-muted-foreground"
                          >
                            {figureOf(item.slug)}
                          </pre>
                        ) : null}
                        {item.mdx && !figureOf(item.slug) ? (
                          <code className="min-w-0 truncate font-mono text-xs text-graph-muted">
                            {item.mdx}
                          </code>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
