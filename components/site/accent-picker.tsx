"use client"

import type { CSSProperties } from "react"

import { MonoLabel } from "@/components/docs/mono-label"
import { useAccent } from "@/hooks/use-accent"
import { accents, setAccent } from "@/lib/accent"
import { cn } from "@/lib/utils"
import { HitArea } from "@/components/site/hit-area"

function Swatch({
  accent,
  selected,
  compact = false,
}: {
  accent: (typeof accents)[number]
  selected: boolean
  compact?: boolean
}) {
  return (
    <button
      aria-checked={selected}
      aria-label={accent.label}
      className={cn(
        "relative flex items-center justify-center rounded-md",
        compact ? "size-6" : "size-7",
        selected && "bg-muted"
      )}
      onClick={() => setAccent(accent.id)}
      role="radio"
      type="button"
    >
      <span
        aria-hidden="true"
        className={cn(
          "overflow-hidden rounded-full",
          compact ? "size-4" : "size-5",
          accent.id === "theme" && "border border-border"
        )}
        style={{ background: accent.swatch } as CSSProperties}
      />
      <HitArea />
    </button>
  )
}

/**
 * `inline` puts every swatch on one wrapping row. `stacked` gives solids and
 * gradients a row each, for narrow columns like the docs rail.
 */
function AccentPicker({
  layout = "inline",
}: {
  layout?: "inline" | "stacked"
}) {
  const current = useAccent()
  const solids = accents.filter((item) => item.kind === "solid")
  const gradients = accents.filter((item) => item.kind === "gradient")

  if (layout === "stacked") {
    return (
      <div className="flex flex-col gap-2">
        <MonoLabel>accent</MonoLabel>
        <div
          aria-label="accent color"
          className="flex flex-col gap-1"
          role="radiogroup"
        >
          {[solids, gradients].map((group) => (
            <div className="flex flex-wrap" key={group[0]?.kind}>
              {group.map((accent) => (
                <Swatch
                  accent={accent}
                  compact
                  key={accent.id}
                  selected={accent.id === current.id}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <MonoLabel>accent</MonoLabel>
      <div
        aria-label="accent color"
        className="flex flex-wrap items-center gap-1"
        role="radiogroup"
      >
        {solids.map((accent) => (
          <Swatch
            accent={accent}
            key={accent.id}
            selected={accent.id === current.id}
          />
        ))}
        <span aria-hidden="true" className="mx-1 h-4 w-px bg-graph-frame" />
        {gradients.map((accent) => (
          <Swatch
            accent={accent}
            key={accent.id}
            selected={accent.id === current.id}
          />
        ))}
      </div>
    </div>
  )
}

export { AccentPicker }
