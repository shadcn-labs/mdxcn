"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  defineItem,
  Graph,
  GraphBody,
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
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type SlopeItem = {
  /** Falls back to the child text: `<Slope from={160} to={142}>read</Slope>`. */
  label?: string
  from: number | string
  to: number | string
}

type GraphSlopeProps = {
  title?: string
  fromLabel: string
  toLabel: string
  /** Data form. Or write `<Slope />` children. */
  items?: SlopeItem[]
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

/** `<Slope from={8200} to={12400}>docs</Slope>` inside `<GraphSlope>`. */
const Slope = defineItem<SlopeItem>("Slope")

type SlopeRow = { label: string; from: number; to: number }

function format(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 1,
  })
}

function GraphSlope({
  title,
  fromLabel,
  toLabel,
  items: itemsProp,
  children,
  palette,
  corner,
  frame,
  className,
}: GraphSlopeProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const listed = listItems(children).map((item) => {
    const { label, rest } = splitLabel(itemText(item))
    const [from, to] = rest.split(/\s*(?:→|->|—>|=>)\s*/)
    return { label, from, to }
  })
  const tagged = childItems(children, Slope).map((entry) => ({
    ...entry,
    label: entry.label ?? textOf(entry.children),
  }))
  const items: SlopeRow[] = (
    itemsProp ?? (listed.length > 0 ? listed : tagged)
  ).map((entry) => ({
    label: entry.label ?? "",
    from: numberOf(entry.from),
    to: numberOf(entry.to),
  }))

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col gap-3">
        <div className="grid grid-cols-[minmax(0,1fr)_6.5rem_2rem_6.5rem] items-end gap-x-3">
          <span />
          <span className="text-right text-graph-muted">{fromLabel}</span>
          <span />
          <span className="text-right text-graph-muted">{toLabel}</span>
        </div>
        <motion.ul
          className="flex flex-col gap-2"
          initial={reduce ? false : "hidden"}
          role="list"
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {items.map((row) => {
            const up = row.to > row.from
            const down = row.to < row.from

            return (
              <motion.li
                aria-label={`${row.label} from ${format(row.from)} to ${format(row.to)}`}
                className="grid grid-cols-[minmax(0,1fr)_6.5rem_2rem_6.5rem] items-baseline gap-x-3"
                key={row.label}
                variants={item}
              >
                <span className="truncate text-foreground">{row.label}</span>
                <span className="text-right text-graph-muted tabular-nums">
                  {format(row.from)}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "text-center select-none",
                    up && toneClass(palette, "primary"),
                    down && toneClass(palette, "secondary"),
                    !up && !down && toneClass(palette, "empty")
                  )}
                >
                  {up ? "→" : down ? "→" : "–"}
                </span>
                <span
                  className={cn(
                    "text-right tabular-nums",
                    up && toneClass(palette, "primary"),
                    down && toneClass(palette, "secondary"),
                    !up && !down && "text-foreground"
                  )}
                >
                  {format(row.to)}
                </span>
              </motion.li>
            )
          })}
        </motion.ul>
      </GraphBody>
    </Graph>
  )
}

export { GraphSlope, Slope }
export type { GraphSlopeProps, SlopeItem }
