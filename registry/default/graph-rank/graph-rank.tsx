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
  staggerList,
  toneClass,
  trackMarks,
  type Glyphs,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"

type RankItem = {
  /** Falls back to the child text: `<Rank value={12400}>/docs</Rank>`. */
  label?: string
  value: number | string
  display?: string
}

type GraphRankProps = {
  title?: string
  /** Data form. Or write `<Rank />` children. */
  items?: RankItem[]
  children?: ReactNode
  max?: number
  ticks?: number
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

/** `<Rank value={4100}>/install</Rank>` inside `<GraphRank>`. */
const Rank = defineItem<RankItem>("Rank")

type RankRow = { label: string; value: number; display?: string }

function formatValue(item: RankRow) {
  if (item.display) {
    return item.display
  }

  return item.value.toLocaleString("en-US", {
    maximumFractionDigits: Number.isInteger(item.value) ? 0 : 1,
  })
}

function GraphRank({
  title,
  items: itemsProp,
  children,
  max,
  ticks = 20,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphRankProps) {
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
  const tagged = childItems(children, Rank).map((entry) => ({
    ...entry,
    label: entry.label ?? textOf(entry.children),
  }))
  const items: RankRow[] = (
    itemsProp ?? (listed.length > 0 ? listed : tagged)
  ).map((entry) => ({
    label: entry.label ?? "",
    value: numberOf(entry.value),
    display: entry.display,
  }))
  const peak = max ?? Math.max(...items.map((entry) => entry.value), 1)
  const marks = trackMarks(glyphs, {
    empty: "-",
    rest: "=",
    fill: "=",
  })

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col gap-3">
        <motion.ol
          className="flex w-full list-none flex-col gap-2"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {items.map((entry) => {
            const filled = Math.min(
              ticks,
              Math.round((Math.max(entry.value, 0) / peak) * ticks)
            )
            const shown = formatValue(entry)

            return (
              <motion.li
                aria-label={`${entry.label} ${shown}`}
                className="grid grid-cols-[minmax(0,5rem)_minmax(0,1fr)_minmax(0,4.5rem)] items-center gap-x-2 sm:grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(0,7rem)] sm:gap-x-4"
                key={entry.label}
                variants={item}
              >
                <span className="truncate text-foreground">{entry.label}</span>
                <span className="flex min-w-0 items-center">
                  <span
                    aria-hidden="true"
                    className="text-graph-frame select-none"
                  >
                    [
                  </span>
                  <GraphTrack>
                    {Array.from({ length: ticks }, (_, index) => {
                      const on = index < filled

                      return (
                        <GraphTick
                          className={
                            on
                              ? toneClass(palette, "primary")
                              : "text-graph-frame"
                          }
                          key={index}
                        >
                          {on ? marks.fill : marks.empty}
                        </GraphTick>
                      )
                    })}
                  </GraphTrack>
                  <span
                    aria-hidden="true"
                    className="text-graph-frame select-none"
                  >
                    ]
                  </span>
                </span>
                <span className="text-right text-graph-muted tabular-nums">
                  {shown}
                </span>
              </motion.li>
            )
          })}
        </motion.ol>
      </GraphBody>
    </Graph>
  )
}

export { GraphRank, Rank }
export type { GraphRankProps, RankItem }
