"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  firstToken,
  fraction,
  Graph,
  GraphBody,
  textOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fillDelay,
  graphTransition,
  toneClass,
  trackMarks,
  type Glyphs,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type GraphWaffleProps = {
  title?: string
  /** `0.73`, `"0.73"`, or `"73%"`. Or write `73% green` as children. */
  value?: number | string
  cells?: number
  columns?: number
  caption?: string
  /** Markdown: the value, then the caption. `73% — tests green`. */
  children?: ReactNode
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function GraphWaffle({
  title,
  value: valueProp,
  cells = 100,
  columns = 10,
  caption: captionProp,
  children,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphWaffleProps) {
  const written = firstToken(textOf(children).replace(/\s+/g, " ").trim())
  const value = fraction(valueProp ?? written.token)
  const caption =
    captionProp ??
    (valueProp == null
      ? written.rest.replace(/^[—–-]\s*/, "") || undefined
      : undefined)
  const reduce = useReducedMotion()
  const clamped = Math.min(1, Math.max(0, value))
  const filled = Math.round(clamped * cells)
  const rows = Math.ceil(cells / columns)
  const marks = trackMarks(glyphs, {
    empty: "░",
    rest: "░",
    fill: "█",
  })

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col gap-4">
        <div
          aria-hidden="true"
          className="flex w-full flex-col gap-1 select-none"
        >
          {Array.from({ length: rows }, (_, row) => (
            <div className="flex w-full" key={row}>
              {Array.from({ length: columns }, (_, column) => {
                const index = row * columns + column
                if (index >= cells) {
                  return <span className="min-w-[1ch] flex-1" key={column} />
                }
                const isFilled = index < filled

                return (
                  <motion.span
                    className={cn(
                      "min-w-[1ch] flex-1 text-center",
                      isFilled
                        ? toneClass(palette, "primary")
                        : "text-graph-frame"
                    )}
                    initial={reduce || !isFilled ? false : { opacity: 0 }}
                    key={column}
                    transition={graphTransition(reduce, {
                      delay: fillDelay(reduce, index, 0.006),
                    })}
                    viewport={graphViewport}
                    whileInView={{ opacity: 1 }}
                  >
                    {isFilled ? marks.fill : marks.empty}
                  </motion.span>
                )
              })}
            </div>
          ))}
        </div>
        <p className={cn("tabular-nums", toneClass(palette, "primary"))}>
          {Math.round(clamped * 100)}%
        </p>
        {caption ? <p className="text-graph-muted">{caption}</p> : null}
        <span className="sr-only">
          {Math.round(clamped * 100)} percent
          {caption ? `. ${caption}` : ""}
        </span>
      </GraphBody>
    </Graph>
  )
}

export { GraphWaffle }
export type { GraphWaffleProps }
