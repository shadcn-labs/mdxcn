"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  Graph,
  GraphBody,
  splitDash,
  textOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  formatAgo,
  formatClock,
  formatHms,
  parseInstant,
  useGraphNow,
} from "@/registry/default/graph-frame/graph-clock"
import {
  fadeUp,
  toneClass,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type TimerKind = "elapsed" | "ago" | "clock"

type GraphTimerProps = {
  title?: string
  kind?: TimerKind
  at?: Date | number | string
  caption?: string
  /** Markdown: the instant, then the caption. `2026-09-01T09:00Z — since deploy`. */
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function GraphTimer({
  title,
  kind = "elapsed",
  at: atProp,
  caption: captionProp,
  children,
  palette,
  corner,
  frame,
  className,
}: GraphTimerProps) {
  const reduce = useReducedMotion()
  const enter = fadeUp(reduce)
  const now = useGraphNow()
  const written = splitDash(textOf(children).replace(/\s+/g, " ").trim())
  const at = atProp ?? (written.label || undefined)
  const caption = captionProp ?? (written.rest || undefined)
  const origin = at == null ? Number.NaN : parseInstant(at)
  let value = kind === "ago" ? "0s ago" : "00:00:00"
  let spoken = "timer"

  if (now != null) {
    if (kind === "clock") {
      value = formatClock(now)
      spoken = `local time ${value}`
    } else if (Number.isFinite(origin)) {
      const elapsed = Math.max(0, now - origin)
      if (kind === "ago") {
        value = formatAgo(elapsed)
        spoken = value
      } else {
        value = formatHms(elapsed)
        spoken = `elapsed ${value}`
      }
    }
  }

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody>
        <motion.div
          className="flex flex-col gap-2"
          initial={reduce ? false : "hidden"}
          variants={enter}
          viewport={graphViewport}
          whileInView="show"
        >
          <p
            className={cn(
              "text-3xl tracking-tight tabular-nums sm:text-4xl",
              toneClass(palette, "primary")
            )}
          >
            {value}
          </p>
          {caption ? <p className="text-graph-muted">{caption}</p> : null}
        </motion.div>
        <span className="sr-only">{spoken}</span>
      </GraphBody>
    </Graph>
  )
}

export { GraphTimer }
export type { GraphTimerProps, TimerKind }
