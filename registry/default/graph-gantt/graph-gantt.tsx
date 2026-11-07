"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  defineItem,
  Graph,
  GraphBody,
  GraphTick,
  GraphTrack,
  hasHost,
  itemText,
  listItems,
  numberOf,
  splitLabel,
  textOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  clamp01,
  fadeUp,
  seriesDim,
  staggerList,
  toneClass,
  trackMarks,
  type Glyphs,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type GanttItem = {
  /** Falls back to the child text: `<Span start={0} end={0.35}>design</Span>`. */
  label?: string
  start: number | string
  end: number | string
  accent?: boolean
  complete?: number | string
}

type GraphGanttProps = {
  title?: string
  /** Data form. Or write `<Span />` children. */
  items?: GanttItem[]
  children?: ReactNode
  ticks?: string[]
  columns?: number
  stage?: string
  progress?: number
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

/** `<Span start={0.2} end={0.75} complete={0.55}>build</Span>` inside `<GraphGantt>`. */
const Span = defineItem<GanttItem>("Span")

type GanttRow = {
  label: string
  start: number
  end: number
  accent?: boolean
  complete?: number
}

function GraphGantt({
  title,
  items: itemsProp,
  children,
  ticks,
  columns = 24,
  stage,
  progress,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphGanttProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const listed = listItems(children).map((item) => {
    const text = itemText(item)
    const { label, rest } = splitLabel(text)
    const source = rest || text
    const nums = source.match(/[\d.]+/g) ?? []
    const content = (item.props as { children?: ReactNode }).children
    return {
      label: rest
        ? label
        : text
            .replace(/[\d.]+/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
      start: nums[0] ?? 0,
      end: nums[1] ?? nums[0] ?? 0,
      complete: nums[2],
      accent: hasHost(content, ["strong", "b"]),
    }
  })
  const tagged = childItems(children, Span).map((entry) => ({
    ...entry,
    label: entry.label ?? textOf(entry.children),
  }))
  const items: GanttRow[] = (
    itemsProp ?? (listed.length > 0 ? listed : tagged)
  ).map((entry) => ({
    label: entry.label ?? "",
    start: numberOf(entry.start),
    end: numberOf(entry.end),
    accent: entry.accent,
    complete: entry.complete == null ? undefined : numberOf(entry.complete),
  }))
  const playhead =
    progress == null ? null : Math.round(clamp01(progress) * (columns - 1))
  const marks = trackMarks(glyphs)

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col gap-4">
        {playhead != null ? (
          <div className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-x-2 sm:gap-x-4">
            <span />
            <GraphTrack>
              {Array.from({ length: columns }, (_, index) => (
                <GraphTick
                  className={
                    index === playhead
                      ? toneClass(palette, "primary")
                      : "text-transparent"
                  }
                  key={index}
                >
                  ▾
                </GraphTick>
              ))}
            </GraphTrack>
          </div>
        ) : null}
        <motion.ul
          className="flex flex-col gap-2"
          initial={reduce ? false : "hidden"}
          role="list"
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {items.map((entry) => {
            const start = Math.round(clamp01(entry.start) * columns)
            const end = Math.max(
              start + 1,
              Math.round(clamp01(entry.end) * columns)
            )
            const span = end - start
            const done = Math.round(clamp01(entry.complete ?? 1) * span)
            const focused = stage
              ? entry.label === stage
              : Boolean(entry.accent)
            const dim = Boolean(stage) && !focused

            return (
              <motion.li
                aria-label={`${entry.label} from ${Math.round(entry.start * 100)}% to ${Math.round(entry.end * 100)}%${
                  entry.complete != null
                    ? `, ${Math.round(entry.complete * 100)}% complete`
                    : ""
                }`}
                className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-x-2 sm:gap-x-4"
                key={entry.label}
                style={seriesDim(palette, !dim)}
                variants={item}
              >
                <span
                  className={cn(
                    "truncate",
                    focused ? toneClass(palette, "primary") : "text-foreground"
                  )}
                >
                  {entry.label}
                </span>
                <GraphTrack>
                  {Array.from({ length: columns }, (_, index) => {
                    const inBar = index >= start && index < end
                    const filled = inBar && index < start + done
                    const rest = inBar && !filled

                    return (
                      <GraphTick
                        className={
                          filled
                            ? focused
                              ? toneClass(palette, "primary")
                              : "text-foreground"
                            : rest
                              ? toneClass(palette, "secondary")
                              : toneClass(palette, "empty")
                        }
                        key={index}
                      >
                        {filled ? marks.fill : rest ? marks.rest : marks.empty}
                      </GraphTick>
                    )
                  })}
                </GraphTrack>
              </motion.li>
            )
          })}
        </motion.ul>
        {ticks && ticks.length > 0 ? (
          <div className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-x-2 sm:gap-x-4">
            <span />
            <div className="flex justify-between text-graph-muted">
              {ticks.map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
          </div>
        ) : null}
      </GraphBody>
    </Graph>
  )
}

export { GraphGantt, Span }
export type { GanttItem, GraphGanttProps }
