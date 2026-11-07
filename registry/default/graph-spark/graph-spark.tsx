"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  Graph,
  GraphBody,
  GraphTick,
  GraphTrack,
  numbers,
  seriesOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  DIM_OPACITY,
  fillDelay,
  graphTransition,
  isMonoPalette,
  resolveGlyphs,
  toneClass,
  type Glyphs,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

const SPARK_DEFAULT = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"]

type GraphSparkProps = {
  title?: string
  /** `[2, 3, 4]` or `"2 3 4"`. Scaled to the max. Or write it as children. */
  data?: number[] | string
  caption?: string
  /** Markdown: `2 3 5 8 — caption`, or a list of `- Mon: 4` rows. */
  children?: ReactNode
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function GraphSpark({
  title,
  data: dataProp,
  caption: captionProp,
  children,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphSparkProps) {
  const written = seriesOf(children)
  const data = dataProp == null ? written.data : numbers(dataProp)
  const caption =
    captionProp ?? (dataProp == null ? written.caption : undefined)
  const reduce = useReducedMotion()
  const max = Math.max(...data, 1)
  const last = data.length - 1
  const set = glyphs == null ? SPARK_DEFAULT : resolveGlyphs(glyphs)
  const points = data.map((value) => {
    const index = Math.round((value / max) * (set.length - 1))
    return set[index] ?? set[0] ?? "▁"
  })

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col items-center gap-4">
        <GraphTrack className="justify-center gap-0.5">
          {points.map((glyph, index) => {
            const live = index === last

            return (
              <GraphTick className="flex-none" key={`${glyph}-${index}`}>
                <motion.span
                  className={cn(
                    live
                      ? toneClass(palette, "primary")
                      : toneClass(palette, "secondary")
                  )}
                  initial={reduce ? false : { opacity: 0 }}
                  transition={graphTransition(reduce, {
                    delay: fillDelay(reduce, index),
                  })}
                  viewport={graphViewport}
                  whileInView={{
                    opacity: live || !isMonoPalette(palette) ? 1 : DIM_OPACITY,
                  }}
                >
                  {glyph}
                </motion.span>
              </GraphTick>
            )
          })}
        </GraphTrack>
        {caption ? <p className="text-graph-muted">{caption}</p> : null}
        <span className="sr-only">
          Sparkline with {data.length} points
          {caption ? `. ${caption}` : ""}
        </span>
      </GraphBody>
    </Graph>
  )
}

export { GraphSpark }
export type { GraphSparkProps }
