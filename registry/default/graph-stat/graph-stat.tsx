"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  defineItem,
  firstToken,
  Graph,
  GraphBody,
  hasHost,
  itemText,
  listItems,
  splitDash,
  textOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  staggerList,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

const columnClass: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
}

type StatItem = {
  value: string | number
  /** Falls back to the child text: `<Stat value="860">shipped</Stat>`. */
  label?: string
  hint?: string
  accent?: boolean
}

type GraphStatProps = {
  title?: string
  /** Data form. Or write `<Stat />` children. */
  items?: StatItem[]
  children?: ReactNode
  corner?: string
  frame?: GraphFrame
  className?: string
}

/** `<Stat value="12,400" label="docs" />` inside `<GraphStat>`. */
const Stat = defineItem<StatItem>("Stat")

function GraphStat({
  title,
  items: itemsProp,
  children,
  corner,
  frame,
  className,
}: GraphStatProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.06)
  const listed = listItems(children).map((item) => {
    const { token, rest } = firstToken(itemText(item))
    const { label, rest: hint } = splitDash(rest)
    const content = (item.props as { children?: ReactNode }).children
    return {
      value: token,
      label,
      hint: hint || undefined,
      accent: hasHost(content, ["strong", "b"]),
    }
  })
  const tagged = childItems(children, Stat).map((entry) => ({
    ...entry,
    label: entry.label ?? textOf(entry.children),
  }))
  const items = (itemsProp ?? (listed.length > 0 ? listed : tagged)).map(
    (entry) => ({ ...entry, label: entry.label ?? "" })
  )
  const columns = Math.min(Math.max(items.length, 1), 4)

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody>
        <motion.ul
          className={cn("grid gap-8", columnClass[columns])}
          initial={reduce ? false : "hidden"}
          role="list"
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {items.map((entry) => (
            <motion.li
              className="flex flex-col gap-2"
              key={entry.label}
              variants={item}
            >
              <p
                className={cn(
                  "text-3xl tracking-tight tabular-nums sm:text-4xl",
                  entry.accent ? "text-graph-accent" : "text-foreground"
                )}
              >
                {entry.value}
              </p>
              <p className="text-graph-muted">{entry.label}</p>
              {entry.hint ? (
                <p className="text-graph-muted">{entry.hint}</p>
              ) : null}
            </motion.li>
          ))}
        </motion.ul>
      </GraphBody>
    </Graph>
  )
}

export { GraphStat, Stat }
export type { GraphStatProps, StatItem }
