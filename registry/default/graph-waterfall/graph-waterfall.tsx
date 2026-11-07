"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  defineItem,
  Graph,
  GraphBody,
  GraphRule,
  GraphTick,
  GraphTrack,
  itemText,
  listItems,
  numberOf,
  splitLabel,
  textOf,
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

type WaterfallKind = "start" | "in" | "out" | "end"

type WaterfallItem = {
  /** Falls back to the child text: `<Delta value={-6}>Refunds</Delta>`. */
  label?: string
  value: number | string
  display?: string
  kind?: WaterfallKind
}

type GraphWaterfallProps = {
  title?: string
  /** Data form. Or write `<Delta />` children. */
  items?: WaterfallItem[]
  children?: ReactNode
  ticks?: number
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

type WaterfallRow = {
  label: string
  value: number
  display?: string
  kind?: WaterfallKind
}

/** `<Delta value={-6}>Refunds</Delta>` inside `<GraphWaterfall>`. First and last rows are start / end. */
const Delta = defineItem<WaterfallItem>("Delta")

function resolveKind(
  item: WaterfallRow,
  index: number,
  length: number
): WaterfallKind {
  if (item.kind) {
    return item.kind
  }

  if (index === 0) {
    return "start"
  }

  if (index === length - 1) {
    return "end"
  }

  return item.value >= 0 ? "in" : "out"
}

function formatValue(item: WaterfallRow, kind: WaterfallKind) {
  if (item.display) {
    return item.display
  }

  const absolute = Math.abs(item.value)

  if (kind === "in") {
    return `+${absolute.toLocaleString("en-US")}`
  }

  if (kind === "out") {
    return `−${absolute.toLocaleString("en-US")}`
  }

  return item.value.toLocaleString("en-US")
}

function GraphWaterfall({
  title,
  items: itemsProp,
  children,
  ticks = 24,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphWaterfallProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const marks = trackMarks(glyphs)
  const listed = listItems(children).map((item) => {
    const { label, rest } = splitLabel(itemText(item))
    const raw = rest || itemText(item)
    const match = raw.match(/([+\-−]?[\d,]+(?:\.\d+)?)\s*$/)
    return {
      label: rest
        ? label
        : itemText(item)
            .replace(match?.[0] ?? "", "")
            .trim(),
      value: match?.[1] ?? rest,
      display: undefined,
      kind: undefined,
    }
  })
  const tagged = childItems(children, Delta).map((entry) => ({
    ...entry,
    label: entry.label ?? textOf(entry.children),
  }))
  const items: WaterfallRow[] = (
    itemsProp ?? (listed.length > 0 ? listed : tagged)
  ).map((entry) => ({
    label: entry.label ?? "",
    value: numberOf(entry.value),
    display: entry.display,
    kind: entry.kind,
  }))
  const segments: (WaterfallRow & {
    kind: WaterfallKind
    from: number
    to: number
  })[] = []
  items.reduce((run, entry, index) => {
    const kind = resolveKind(entry, index, items.length)
    const magnitude = Math.abs(entry.value)

    if (kind === "start") {
      segments.push({ ...entry, kind, from: 0, to: entry.value })
      return entry.value
    }

    if (kind === "in") {
      segments.push({ ...entry, kind, from: run, to: run + magnitude })
      return run + magnitude
    }

    if (kind === "out") {
      segments.push({ ...entry, kind, from: run - magnitude, to: run })
      return run - magnitude
    }

    segments.push({ ...entry, kind, from: 0, to: entry.value })
    return entry.value
  }, 0)
  const lows = segments.map((segment) => Math.min(segment.from, segment.to))
  const highs = segments.map((segment) => Math.max(segment.from, segment.to))
  const low = Math.min(0, ...lows)
  const high = Math.max(1, ...highs)
  const span = high - low || 1

  function column(value: number) {
    return Math.round(((value - low) / span) * ticks)
  }

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col gap-3">
        <motion.ul
          className="flex w-full flex-col gap-2"
          initial={reduce ? false : "hidden"}
          role="list"
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {segments.map((segment, index) => {
            const start = Math.min(column(segment.from), column(segment.to))
            const end = Math.max(
              column(segment.from),
              column(segment.to),
              start + 1
            )
            const isEnd = segment.kind === "end"
            const showRule = isEnd && index > 0

            return (
              <li className="flex flex-col gap-2" key={segment.label}>
                {showRule ? <GraphRule /> : null}
                <motion.div
                  className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(0,5.5rem)] items-center gap-x-2 sm:gap-x-4"
                  variants={item}
                >
                  <span className="truncate text-foreground">
                    {segment.label}
                  </span>
                  <GraphTrack>
                    {Array.from({ length: ticks }, (_, cell) => {
                      const filled = cell >= start && cell < end
                      const tone = !filled
                        ? toneClass(palette, "empty")
                        : segment.kind === "out"
                          ? toneClass(palette, "secondary")
                          : segment.kind === "start"
                            ? "text-foreground"
                            : toneClass(palette, "primary")

                      return (
                        <GraphTick className={tone} key={cell}>
                          {filled ? marks.fill : marks.empty}
                        </GraphTick>
                      )
                    })}
                  </GraphTrack>
                  <span
                    className={cn(
                      "text-right tabular-nums",
                      segment.kind === "out" && toneClass(palette, "secondary"),
                      segment.kind === "end" && toneClass(palette, "primary"),
                      (segment.kind === "start" || segment.kind === "in") &&
                        "text-foreground"
                    )}
                  >
                    {formatValue(segment, segment.kind)}
                  </span>
                </motion.div>
              </li>
            )
          })}
        </motion.ul>
        <span className="sr-only">
          {segments
            .map(
              (segment) =>
                `${segment.label} ${formatValue(segment, segment.kind)}`
            )
            .join(", ")}
        </span>
      </GraphBody>
    </Graph>
  )
}

export { Delta, GraphWaterfall }
export type { GraphWaterfallProps, WaterfallItem, WaterfallKind }
