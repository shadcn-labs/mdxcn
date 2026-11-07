"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import { GraphArrow } from "@/registry/default/graph-frame/graph-arrow"
import {
  childItems,
  defineItem,
  Graph,
  GraphBody,
  hasHost,
  itemText,
  listItems,
  numbers,
  splitLabel,
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

type BarSeries = {
  label: string
  values: number[]
  size?: "sm" | "lg"
}

type SeriesProps = {
  label: string
  values?: number[] | string
  size?: "sm" | "lg"
}

/** `<Series label="before">2 4 3 5 2</Series>` — first is from, second is to. */
const Series = defineItem<SeriesProps>("Series")

type GraphBarsProps = {
  title?: string
  /** Left series. Or write two `<Series>` children. */
  from?: BarSeries
  /** Right series. Or write two `<Series>` children. */
  to?: BarSeries
  children?: ReactNode
  processor?: string
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function MiniBars({
  values,
  height,
  delay = 0,
  tone = "accent",
  fill,
  palette,
}: {
  values: number[]
  height: number
  delay?: number
  tone?: "accent" | "muted"
  fill: string
  palette?: GraphPalette
}) {
  const reduce = useReducedMotion()
  const max = Math.max(...values, 1)

  return (
    <div className="flex items-end gap-1">
      {values.map((value, index) => {
        const level = Math.round((value / max) * (height - 1))

        return (
          <span className="flex w-[1ch] flex-col justify-end" key={index}>
            {Array.from({ length: height }, (_, row) => {
              const fromBottom = height - 1 - row
              const on = fromBottom <= level

              return (
                <motion.span
                  className={cn(
                    "h-[1em] w-full text-center",
                    on
                      ? tone === "accent"
                        ? toneClass(palette, "primary")
                        : toneClass(palette, "secondary")
                      : "text-transparent"
                  )}
                  initial={reduce || !on ? false : { opacity: 0 }}
                  key={row}
                  transition={graphTransition(reduce, {
                    delay: delay + fillDelay(reduce, index, 0.03),
                  })}
                  viewport={graphViewport}
                  whileInView={{ opacity: 1 }}
                >
                  {on ? fill : " "}
                </motion.span>
              )
            })}
          </span>
        )
      })}
    </div>
  )
}

function GraphBars({
  title,
  from: fromProp,
  to: toProp,
  children,
  processor,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphBarsProps) {
  const listed = listItems(children).map((item) => {
    const { label, rest } = splitLabel(itemText(item))
    const content = (item.props as { children?: ReactNode }).children
    return {
      label: label || itemText(item),
      values: numbers(rest),
      size: hasHost(content, ["strong", "b"]) ? ("lg" as const) : undefined,
    }
  })
  const tagged = childItems(children, Series).map((entry) => ({
    label: entry.label,
    values: numbers(entry.values ?? textOf(entry.children)),
    size: entry.size,
  }))
  const series = listed.length > 0 ? listed : tagged
  const empty: BarSeries = { label: "", values: [] }
  const from = fromProp ?? series[0] ?? empty
  const to = toProp ?? series[1] ?? empty
  const marks = trackMarks(glyphs)
  const fromHeight = from.size === "lg" ? 8 : 5
  const toHeight = to.size === "lg" ? 8 : 5

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody>
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-end sm:justify-center sm:gap-8">
          <div className="flex flex-col items-center gap-3">
            <MiniBars
              delay={0.04}
              fill={marks.fill}
              height={fromHeight}
              palette={palette}
              tone="muted"
              values={from.values}
            />
            <p className={toneClass(palette, "secondary")}>{from.label}</p>
          </div>

          <div className="flex items-center justify-center gap-3 text-graph-muted max-sm:rotate-90">
            <GraphArrow />
            {processor ? <span>{processor}</span> : null}
            <GraphArrow />
          </div>

          <div className="flex flex-col items-center gap-3">
            <MiniBars
              delay={0.16}
              fill={marks.fill}
              height={toHeight}
              palette={palette}
              values={to.values}
            />
            <p className="text-foreground">{to.label}</p>
          </div>
        </div>
      </GraphBody>
    </Graph>
  )
}

export { GraphBars, Series }
export type { BarSeries, GraphBarsProps, SeriesProps }
