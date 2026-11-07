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

type GraphCountdownProps = {
  title?: string
  /** Or write it as children. */
  to?: Date | number | string
  done?: string
  caption?: string
  /** Markdown: the instant, then the caption. `2026-12-01 — until launch`. */
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function GraphCountdown({
  title,
  to: toProp,
  done = "done",
  caption: captionProp,
  children,
  palette,
  corner,
  frame,
  className,
}: GraphCountdownProps) {
  const reduce = useReducedMotion()
  const enter = fadeUp(reduce)
  const now = useGraphNow()
  const written = splitDash(textOf(children).replace(/\s+/g, " ").trim())
  const to = toProp ?? written.label
  const caption = captionProp ?? (written.rest || undefined)
  const target = to ? parseInstant(to) : Number.NaN
  const remaining =
    now == null || !Number.isFinite(target) ? null : target - now
  const finished = remaining != null && remaining <= 0
  const value =
    remaining == null ? "00:00:00" : finished ? done : formatHms(remaining)

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
              finished ? "text-graph-muted" : toneClass(palette, "primary")
            )}
          >
            {value}
          </p>
          {caption ? <p className="text-graph-muted">{caption}</p> : null}
        </motion.div>
        <span className="sr-only">
          {finished ? done : `remaining ${value}`}
        </span>
      </GraphBody>
    </Graph>
  )
}

export { GraphCountdown }
export type { GraphCountdownProps }
