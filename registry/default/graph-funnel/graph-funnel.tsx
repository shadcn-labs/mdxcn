"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  defineItem,
  firstToken,
  Graph,
  GraphBody,
  GraphTick,
  GraphTrack,
  itemText,
  listItems,
  numberOf,
  textOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  isMonoPalette,
  seriesClass,
  seriesDim,
  staggerList,
  trackMarks,
  type Glyphs,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"

type FunnelStep = {
  /** Falls back to the child text: `<Stage value={12400}>docs</Stage>`. */
  label?: string
  value: number | string
  display?: string
}

type GraphFunnelProps = {
  title?: string
  /** Data form. Or write `<Stage />` children. */
  steps?: FunnelStep[]
  children?: ReactNode
  ticks?: number
  stage?: string
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

/** `<Stage value={860} display="860">ship</Stage>` inside `<GraphFunnel>`. */
const Stage = defineItem<FunnelStep>("Stage")

type FunnelRow = { label: string; value: number; display?: string }

function GraphFunnel({
  title,
  steps: stepsProp,
  children,
  ticks = 20,
  stage,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphFunnelProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const listed = listItems(children).map((item) => {
    const { token, rest } = firstToken(itemText(item))
    return {
      display: token,
      value: numberOf(token),
      label: rest,
    }
  })
  const tagged = childItems(children, Stage).map((entry) => ({
    ...entry,
    label: entry.label ?? textOf(entry.children),
  }))
  const steps: FunnelRow[] = (
    stepsProp ?? (listed.length > 0 ? listed : tagged)
  ).map((entry) => ({
    label: entry.label ?? "",
    value: numberOf(entry.value),
    display: entry.display,
  }))
  const max = Math.max(...steps.map((step) => step.value), 1)
  const head = steps[0]?.value || 1
  const marks = trackMarks(glyphs)

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody>
        <motion.ol
          className="flex flex-col gap-3"
          initial={reduce ? false : "hidden"}
          role="list"
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {steps.map((step, index) => {
            const width = Math.max(1, Math.round((step.value / max) * ticks))
            const percent = Math.round((step.value / head) * 100)
            const focused = Boolean(stage) && step.label === stage
            const dim = Boolean(stage) && !focused

            return (
              <motion.li
                className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(0,8ch)_minmax(0,4ch)] items-center gap-x-2 sm:gap-x-4"
                key={step.label}
                style={seriesDim(palette, !dim)}
                variants={item}
              >
                <span className="truncate text-foreground">{step.label}</span>
                <GraphTrack>
                  {Array.from({ length: ticks }, (_, cell) => {
                    const filled = cell < width

                    return (
                      <GraphTick
                        className={
                          filled
                            ? isMonoPalette(palette)
                              ? "text-graph-accent"
                              : seriesClass(palette, index)
                            : "text-graph-frame"
                        }
                        key={cell}
                      >
                        {filled ? marks.fill : marks.empty}
                      </GraphTick>
                    )
                  })}
                </GraphTrack>
                <span className="text-right text-foreground tabular-nums">
                  {step.display ?? step.value.toLocaleString()}
                </span>
                <span className="text-right text-graph-muted tabular-nums">
                  {index === 0 ? "" : `${percent}%`}
                </span>
              </motion.li>
            )
          })}
        </motion.ol>
      </GraphBody>
    </Graph>
  )
}

export { GraphFunnel, Stage }
export type { FunnelStep, GraphFunnelProps }
