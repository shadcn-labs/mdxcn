"use client"

import { useState, type ReactNode } from "react"

import { CopyButton } from "@/components/docs/copy-button"
import { SectionHeading, sectionId } from "@/components/docs/section-heading"
import { SegmentedTabs } from "@/components/docs/segmented-tabs"
import { FrameBox, SiteRule } from "@/components/site/corners"
import { SiteFrameProvider } from "@/components/site/display-controls"
import { ProseMuted } from "@/components/site/prose"
import { useAccent } from "@/hooks/use-accent"
import { accentCss } from "@/lib/accent"
import { toMdxCopy } from "@/lib/docs/mdx"

type SourceTab = "mdx" | "md" | "react"

function ComponentPreview({
  title,
  description,
  code,
  react,
  source: kind = "mdx",
  ascii = true,
  children,
}: {
  title: string
  description?: string
  /** The MDX you write: the parent tag with Markdown inside. */
  code: string
  /** TSX with the parent import. Falls back to `code`. */
  react?: string
  /** `tsx` when the example needs JavaScript and has no MDX form. */
  source?: "mdx" | "tsx"
  /** Show the fenced ASCII twin for READMEs and GitHub. */
  ascii?: boolean
  children: ReactNode
}) {
  const tabs = (
    [
      ["mdx", "mdx"],
      ["react", "react"],
      ["md", "plain text"],
    ] as const
  ).filter(([id]) => (id !== "mdx" || kind === "mdx") && (id !== "md" || ascii))
  // Open on what people write. The plain-text figure repeats the preview, so
  // it waits behind its tab.
  const [tab, setTab] = useState<SourceTab>(() => tabs[0]?.[0] ?? "react")
  const accent = useAccent()
  const tsx = `${accentCss(accent.id)}\n\n${(react ?? code).trim()}`
  const source =
    tab === "mdx" ? code.trim() : tab === "md" ? toMdxCopy(code) : tsx
  const label = { mdx: "MDX", md: "Markdown", react: "React" }[tab]

  return (
    <section className="flex flex-col gap-5">
      <div className="flex min-w-0 flex-col gap-2">
        <SectionHeading id={sectionId(title)}>{title}</SectionHeading>
        {description ? <ProseMuted>{description}</ProseMuted> : null}
      </div>

      {/* One unit: the figure on its stage, its source underneath. The
          figure brings its own frame, so the stage has none, and it tells the
          frame's corner marks which color to paint over the dashes. */}
      <div className="flex min-w-0 flex-col">
        <div className="graph-scroll-x min-h-44 bg-stage px-5 py-10 [--graph-surface:var(--stage)] sm:min-h-48 sm:px-10 sm:py-14">
          <SiteFrameProvider>{children}</SiteFrameProvider>
        </div>
        <FrameBox className="min-w-0 overflow-visible" tone="rail">
          <div className="relative flex items-center justify-between gap-4 py-1.5 pr-2 pl-2 sm:pl-3">
            <SegmentedTabs
              className="flex-nowrap"
              label={`${title} source`}
              onValueChange={setTab}
              tabClassName="font-mono text-xs"
              tabs={tabs}
              value={tab}
            />
            <CopyButton label={`Copy ${label}`} text={source} />
            <SiteRule className="inset-x-0 bottom-0" />
          </div>
          <pre className="scrollbar-graph max-h-96 overflow-auto p-3 text-muted-foreground sm:p-4">
            <code>{source}</code>
          </pre>
        </FrameBox>
      </div>
    </section>
  )
}

export { ComponentPreview }
