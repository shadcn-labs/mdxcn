"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  defineItem,
  dropLead,
  Graph,
  GraphBody,
  GraphProse,
  hasHost,
  itemParts,
  listItems,
  splitLabel,
  textOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  staggerList,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type SpecRow = {
  label: string
  /** Falls back to the child text: `<Field label="Family">Geist Mono</Field>`. */
  value?: string
  accent?: boolean
  /** Muted, under the value. A list item's body paragraphs land here. */
  note?: ReactNode
}

type SpecLine = SpecRow & {
  /** Inline Markdown after the label — code and links survive. */
  rich?: ReactNode
}

type GraphSpecProps = {
  title?: string
  /** Data form. Or write `<Field />` children. */
  rows?: SpecRow[]
  children?: ReactNode
  corner?: string
  frame?: GraphFrame
  className?: string
}

/** `<Field label="ETA" accent>Thu</Field>` inside `<GraphSpec>`. */
const Field = defineItem<SpecRow>("Field")

function GraphSpec({
  title,
  rows: rowsProp,
  children,
  corner,
  frame,
  className,
}: GraphSpecProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.04)
  const listed = listItems(children).map((item): SpecLine => {
    const { head, body } = itemParts(item)
    const { label, rest } = splitLabel(textOf(head).replace(/\s+/g, " ").trim())
    const rich = hasHost(head, ["code", "a", "del", "s"])
      ? dropLead(head, /^\s*[^\n]+?:\s+/).rest
      : undefined
    return {
      label,
      value: rest,
      rich,
      note: body.length > 0 ? body : undefined,
      accent: hasHost(head, ["strong", "b"]),
    }
  })
  const tagged = childItems(children, Field).map((entry) => ({
    ...entry,
    value: entry.value ?? textOf(entry.children),
  }))
  const rows: SpecLine[] = (
    rowsProp ?? (listed.length > 0 ? listed : tagged)
  ).map((entry) => ({ ...entry, value: entry.value ?? "" }))

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody>
        <motion.dl
          className="flex flex-col gap-3"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {rows.map((row) => (
            <motion.div
              className="grid grid-cols-[minmax(0,11rem)_minmax(0,1fr)] items-baseline gap-x-3 sm:gap-x-6"
              key={row.label}
              variants={item}
            >
              <dt className="text-graph-muted">{row.label}</dt>
              <dd className="flex min-w-0 flex-col gap-1">
                {row.rich ? (
                  <GraphProse
                    className={cn(
                      "[overflow-wrap:anywhere] tabular-nums",
                      row.accent ? "text-graph-accent" : "text-foreground"
                    )}
                  >
                    <span>{row.rich}</span>
                  </GraphProse>
                ) : (
                  <span
                    className={cn(
                      "tabular-nums",
                      row.accent ? "text-graph-accent" : "text-foreground"
                    )}
                  >
                    {row.value}
                  </span>
                )}
                {row.note ? (
                  <GraphProse className="text-graph-muted">
                    {row.note}
                  </GraphProse>
                ) : null}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </GraphBody>
    </Graph>
  )
}

export { Field, GraphSpec }
export type { GraphSpecProps, SpecRow }
