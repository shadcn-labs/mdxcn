"use client"

import { useState, type ReactNode } from "react"

import { CopyButton } from "@/components/docs/copy-button"
import { MonoLabel } from "@/components/docs/mono-label"
import { FrameBox } from "@/components/site/corners"
import { ProseMuted } from "@/components/site/prose"
import { useAccent } from "@/hooks/use-accent"
import { accentCss } from "@/lib/accent"
import { toMdxCopy } from "@/lib/docs/mdx"
import { cn } from "@/lib/utils"

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
      ["md", ".md"],
      ["mdx", ".mdx"],
      ["react", ".tsx"],
    ] as const
  ).filter(([id]) => (id !== "mdx" || kind === "mdx") && (id !== "md" || ascii))
  const [tab, setTab] = useState<SourceTab>(() =>
    tabs.some(([id]) => id === "md") ? "md" : (tabs[0]?.[0] ?? "react")
  )
  const accent = useAccent()
  const tsx = `${accentCss(accent.id)}\n\n${(react ?? code).trim()}`
  const source =
    tab === "mdx" ? code.trim() : tab === "md" ? toMdxCopy(code) : tsx
  const label = { mdx: "MDX", md: "Markdown", react: "React" }[tab]

  return (
    <section className="flex flex-col gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-balance">
          {title}
        </h2>
        {description ? <ProseMuted>{description}</ProseMuted> : null}
      </div>

      <FrameBox
        className="min-w-0 overflow-visible bg-muted/25 p-2 sm:p-3"
        tone="rail"
      >
        <div className="graph-scroll-x min-h-44 px-3 py-4 sm:min-h-48 sm:px-4 sm:py-5">
          {children}
        </div>
      </FrameBox>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <MonoLabel>{label}</MonoLabel>
          <div
            aria-label="Source format"
            className="flex shrink-0 items-center gap-1"
            role="tablist"
          >
            {tabs.map(([id, name]) => (
              <button
                aria-selected={tab === id}
                className={cn(
                  "relative px-2 py-1 font-mono text-muted-foreground hover:text-foreground",
                  tab === id && "bg-muted text-foreground"
                )}
                key={id}
                onClick={() => setTab(id)}
                role="tab"
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                />
                {name}
              </button>
            ))}
          </div>
        </div>
        <FrameBox className="min-w-0 overflow-visible" tone="rail">
          <div className="absolute top-2 right-2 z-20">
            <CopyButton label={`Copy ${label}`} text={source} />
          </div>
          <pre className="scrollbar-graph max-h-128 min-h-48 overflow-auto p-3 pr-11 text-muted-foreground sm:p-4 sm:pr-12">
            <code>{source}</code>
          </pre>
        </FrameBox>
      </div>
    </section>
  )
}

export { ComponentPreview }
