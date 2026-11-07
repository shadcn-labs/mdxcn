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

type BulletItem = {
  /** Falls back to the child text: `<Target value={42} target={40}>Design</Target>`. */
  label?: string
  value: number | string
  target?: number | string
  max?: number | string
  display?: string
}

type GraphBulletProps = {
  title?: string
  /** Data form. Or write `<Target />` children. */
  items?: BulletItem[]
  children?: ReactNode
  ticks?: number
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function formatItem(item: BulletItem) {
  if (item.display) {
    return item.display
  }

  const value = item.value.toLocaleString("en-US", {
    maximumFractionDigits: Number.isInteger(item.value) ? 0 : 1,
  })

  if (item.target == null) {
    return value
  }

  const target = item.target.toLocaleString("en-US", {
    maximumFractionDigits: Number.isInteger(item.target) ? 0 : 1,
  })

  return `${value} / ${target}`
}

/** `<Target value={72} target={80} max={100}>CPU</Target>` inside `<GraphBullet>`. */
const Target = defineItem<BulletItem>("Target")

type BulletRow = {
  label: string
  value: number
  target?: number
  max?: number
  display?: string
}

function GraphBullet({
  title,
  items: itemsProp,
  children,
  ticks = 20,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphBulletProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const listed = listItems(children).map((item) => {
    const { label, rest } = splitLabel(itemText(item))
    const [value, restMax] = rest.split(/\s*\/\s*/)
    const [target, max] = (restMax ?? "").split(/\s+of\s+/i)
    return {
      label,
      value,
      target: target || undefined,
      max: max || undefined,
      display: undefined,
    }
  })
  const tagged = childItems(children, Target).map((entry) => ({
    ...entry,
    label: entry.label ?? textOf(entry.children),
  }))
  const items: BulletRow[] = (
    itemsProp ?? (listed.length > 0 ? listed : tagged)
  ).map((entry) => ({
    label: entry.label ?? "",
    value: numberOf(entry.value),
    target: entry.target == null ? undefined : numberOf(entry.target),
    max: entry.max == null ? undefined : numberOf(entry.max),
    display: entry.display,
  }))
  const marks = trackMarks(glyphs, {
    empty: "-",
    rest: "=",
    fill: "=",
  })

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
          {items.map((entry) => {
            const peak =
              entry.max ?? Math.max(entry.value, entry.target ?? 0, 1)
            const filled = Math.min(
              ticks,
              Math.round((Math.max(entry.value, 0) / peak) * ticks)
            )
            const mark =
              entry.target == null
                ? null
                : Math.min(
                    ticks - 1,
                    Math.max(
                      0,
                      Math.round((Math.max(entry.target, 0) / peak) * ticks)
                    )
                  )

            return (
              <motion.li
                aria-label={`${entry.label} ${formatItem(entry)}`}
                className="grid grid-cols-[minmax(0,5rem)_minmax(0,1fr)_minmax(0,4.5rem)] items-center gap-x-2 sm:grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(0,7rem)] sm:gap-x-4"
                key={entry.label}
                variants={item}
              >
                <span className="truncate text-foreground">{entry.label}</span>
                <span className="flex min-w-0 items-center">
                  <span aria-hidden="true" className="text-graph-frame">
                    [
                  </span>
                  <GraphTrack>
                    {Array.from({ length: ticks }, (_, index) => {
                      const isMark = mark != null && index === mark
                      const isFill = index < filled

                      return (
                        <GraphTick
                          className={
                            isMark
                              ? toneClass(palette, "secondary")
                              : isFill
                                ? mark != null && index > mark
                                  ? toneClass(palette, "secondary")
                                  : toneClass(palette, "primary")
                                : "text-graph-frame"
                          }
                          key={index}
                        >
                          {isMark ? "|" : isFill ? marks.fill : marks.empty}
                        </GraphTick>
                      )
                    })}
                  </GraphTrack>
                  <span aria-hidden="true" className="text-graph-frame">
                    ]
                  </span>
                </span>
                <span className="text-right text-graph-muted tabular-nums">
                  {formatItem(entry)}
                </span>
              </motion.li>
            )
          })}
        </motion.ul>
      </GraphBody>
    </Graph>
  )
}

export { GraphBullet, Target }
export type { BulletItem, GraphBulletProps }
