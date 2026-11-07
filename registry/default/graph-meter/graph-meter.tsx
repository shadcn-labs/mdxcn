"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  firstToken,
  fraction,
  Graph,
  GraphBody,
  GraphTick,
  GraphTrack,
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

type GraphMeterProps = {
  title?: string
  /** `0.67`, `"0.67"`, or `"67%"`. Or write `67% used` as children. */
  value?: number | string
  ticks?: number
  caption?: string
  /** Markdown: the value, then the caption. `67% — of the disk`. */
  children?: ReactNode
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function GraphMeter({
  title,
  value: valueProp,
  ticks = 14,
  caption: captionProp,
  children,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphMeterProps) {
  const written = firstToken(textOf(children).replace(/\s+/g, " ").trim())
  const value = fraction(valueProp ?? written.token)
  const caption =
    captionProp ??
    (valueProp == null
      ? written.rest.replace(/^[—–-]\s*/, "") || undefined
      : undefined)
  const reduce = useReducedMotion()
  const clamped = Math.min(1, Math.max(0, value))
  const filled = Math.round(clamped * ticks)
  const marks = trackMarks(glyphs, {
    empty: "-",
    rest: "=",
    fill: "=",
  })

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col gap-4">
        <p className="flex w-full items-center gap-3 tabular-nums">
          <span aria-hidden="true" className="text-graph-frame select-none">
            [
          </span>
          <GraphTrack>
            {Array.from({ length: ticks }, (_, index) => {
              const isFilled = index < filled

              return (
                <GraphTick
                  className={
                    isFilled
                      ? toneClass(palette, "primary")
                      : "text-graph-frame"
                  }
                  key={index}
                >
                  <motion.span
                    className="block w-full"
                    initial={reduce || !isFilled ? false : { opacity: 0 }}
                    transition={graphTransition(reduce, {
                      delay: fillDelay(reduce, index),
                    })}
                    viewport={graphViewport}
                    whileInView={{ opacity: 1 }}
                  >
                    {isFilled ? marks.fill : marks.empty}
                  </motion.span>
                </GraphTick>
              )
            })}
          </GraphTrack>
          <span aria-hidden="true" className="text-graph-frame select-none">
            ]
          </span>
          <span
            className={cn(
              "w-[4ch] shrink-0 text-right",
              toneClass(palette, "primary")
            )}
          >
            {Math.round(clamped * 100)}%
          </span>
        </p>
        {caption ? <p className="text-graph-muted">{caption}</p> : null}
        <span className="sr-only">
          {Math.round(clamped * 100)} percent
          {caption ? ` ${caption}` : ""}
        </span>
      </GraphBody>
    </Graph>
  )
}

export { GraphMeter }
export type { GraphMeterProps }
