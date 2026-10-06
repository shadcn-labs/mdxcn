import type { Metadata } from "next"
import Link from "next/link"

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

const intro = `each example has three tabs. .md is the framed figure as a code block, which you can paste into notion, linear, or a readme. .mdx is markdown inside the component tag, for an mdx page that registered the component in mdx-components.tsx. .tsx is the same figure as react.`

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
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/docs/installation"
          >
            installation
          </Link>{" "}
          covers the cli and <code className="font-mono">mdx-components</code>.{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/docs/examples"
          >
            examples
          </Link>{" "}
          are short write-ups with two figures each.{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/agents"
          >
            for agents
          </Link>{" "}
          is the skill.{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/docs/comark"
          >
            comark
          </Link>{" "}
          and{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/docs/knap"
          >
            knap
          </Link>{" "}
          render the same graphs from plain{" "}
          <code className="font-mono">.md</code>.
        </p>
      </DocsPageHeader>

      <Callout type="tip">
        the .md tab is the drawing itself: the dashed frame, the title, and the
        glyphs. paste it into notion or a readme and it looks the same there.
        the markdown rules are on{" "}
        <TextLink href="/docs/grammar">grammar</TextLink>.
      </Callout>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">install</h2>
        <p className="max-w-[56ch] text-pretty text-muted-foreground">
          the cli copies a registry item into your repo. you can also copy the
          files from github.
        </p>
        <InstallCommand doc={getComponent("callout")} name="callout" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">components</h2>
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
                <dl className="grid sm:grid-cols-2">
                  {group.items.map((item, index) => (
                    <Link
                      href={`/docs/${item.slug}`}
                      key={item.slug}
                      className={cn(
                        "group flex h-full flex-col justify-between gap-3 px-4 py-5 sm:px-6",
                        "max-sm:[&:not(:first-child)]:border-t max-sm:[&:not(:first-child)]:border-dashed max-sm:[&:not(:first-child)]:border-site-rail",
                        "sm:[&:nth-child(n+3)]:border-t sm:[&:nth-child(n+3)]:border-dashed sm:[&:nth-child(n+3)]:border-site-rail",
                        "sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-dashed sm:[&:nth-child(odd)]:border-site-rail",
                        group.items.length % 2 === 1 &&
                          index === group.items.length - 1 &&
                          "sm:col-span-2 sm:[&:nth-child(odd)]:border-r-0"
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <dt className="flex items-center gap-2 font-medium text-foreground">
                          {item.title}
                          {isNewSlug(item.slug) ? (
                            <span className="font-mono text-[10px] tracking-wide text-graph-accent">
                              new
                            </span>
                          ) : null}
                        </dt>
                        <dd className="max-w-[40ch] text-pretty text-muted-foreground">
                          {item.description}
                        </dd>
                      </div>
                      <div className="flex items-end justify-between gap-4">
                        {item.mdx ? (
                          <code className="graph-scroll-x min-w-0 font-mono text-xs whitespace-nowrap text-graph-muted">
                            {item.mdx}
                          </code>
                        ) : (
                          <span />
                        )}
                        <HugeiconsIcon
                          className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
                          icon={ArrowRight02Icon}
                          size={20}
                          strokeWidth={2}
                        />
                      </div>
                    </Link>
                  ))}
                </dl>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
