"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  Graph,
  GraphBody,
  GraphTick,
  GraphTrack,
  hasHost,
  itemText,
  listItems,
  numberOf,
  splitLabel,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  staggerList,
  toneClass,
  trackMarks,
  type Glyphs,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type ScoreRow = {
  label: string
  value: number
  /** Overrides the graph's `max` for this row. */
  max?: number
  accent?: boolean
}

type GraphScoreProps = {
  title?: string
  /** Data form. Or a Markdown list: `- Docs: 4/5`. */
  items?: ScoreRow[]
  /** Dots per row. Default 5, or the `/n` written in the first row. */
  max?: number
  children?: ReactNode
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function rowsOf(children: ReactNode): ScoreRow[] {
  return listItems(children).map((item) => {
    const content = (item.props as { children?: ReactNode }).children
    const { label, rest } = splitLabel(itemText(item))
    const [value = "", out] = rest.split("/")
    return {
      label,
      value: numberOf(value),
      max: out ? numberOf(out) : undefined,
      accent: hasHost(content, ["strong", "b"]),
    }
  })
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

/**
 * Ratings as dots. Markdown:
 *
 * ```mdx
 * <GraphScore title="REVIEW">
 *
 * - Performance: 4/5
 * - Accessibility: 5/5
 * - **Docs: 2.5/5**
 *
 * </GraphScore>
 * ```
 *
 * Halves draw a half dot. Bold is the row to read.
 */
function GraphScore({
  title,
  items: itemsProp,
  max: maxProp,
  children,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphScoreProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const rows = itemsProp ?? rowsOf(children)
  const fallback = maxProp ?? rows.find((row) => row.max)?.max ?? 5
  const marks = trackMarks(glyphs, { empty: "○", rest: "◐", fill: "●" })
  const anyAccent = rows.some((row) => row.accent)

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody>
        <motion.ol
          className="flex flex-col gap-2"
          initial={reduce ? false : "hidden"}
          role="list"
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {rows.map((row, index) => {
            const max = Math.max(1, Math.round(row.max ?? fallback))
            const value = Math.min(max, Math.max(0, row.value))
            const full = Math.floor(value)
            const half = value - full >= 0.5
            const lit = !anyAccent || row.accent

            return (
              <motion.li
                aria-label={`${row.label} ${format(value)} of ${max}`}
                className="grid grid-cols-[minmax(0,11rem)_minmax(0,1fr)_6ch] items-baseline gap-x-3 sm:gap-x-4"
                key={`${row.label}-${index}`}
                variants={item}
              >
                <span
                  className={cn(
                    "truncate",
                    row.accent
                      ? toneClass(palette, "primary")
                      : "text-foreground"
                  )}
                >
                  {row.label}
                </span>
                <GraphTrack className="justify-start gap-0.5">
                  {Array.from({ length: max }, (_, dot) => {
                    const on = dot < full
                    const partial = !on && half && dot === full

                    return (
                      <GraphTick
                        className={cn(
                          "flex-none",
                          on || partial
                            ? lit
                              ? toneClass(palette, "primary")
                              : toneClass(palette, "secondary")
                            : "text-graph-frame"
                        )}
                        key={dot}
                      >
                        {on ? marks.fill : partial ? marks.rest : marks.empty}
                      </GraphTick>
                    )
                  })}
                </GraphTrack>
                <span className="text-right text-graph-muted tabular-nums">
                  {format(value)}/{max}
                </span>
              </motion.li>
            )
          })}
        </motion.ol>
      </GraphBody>
    </Graph>
  )
}

export { GraphScore }
export type { GraphScoreProps, ScoreRow }
