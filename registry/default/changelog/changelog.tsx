"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  defineItem,
  Graph,
  GraphBody,
  GraphProse,
  GraphRule,
  itemText,
  listItems,
  splitLabel,
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

type ChangeType = "add" | "change" | "fix" | "remove"

type ChangeProps = {
  /** add is the accent. remove recedes. change and fix stay plain. */
  type?: ChangeType
  /** Markdown. One change. */
  children?: ReactNode
}

type ChangelogProps = {
  /** Drawn as the frame title unless `title` is set. */
  version: string
  /** Muted, right of the version. */
  date?: string
  title?: string
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

/** `<Change type="add">Callout, Steps, Terminal</Change>` inside `<Changelog>`. */
const Change = defineItem<ChangeProps>("Change")

const glyph: Record<ChangeType, string> = {
  add: "+",
  change: "~",
  fix: "*",
  remove: "-",
}

const label: Record<ChangeType, string> = {
  add: "added",
  change: "changed",
  fix: "fixed",
  remove: "removed",
}

function typeOf(token: string): ChangeType | undefined {
  const key = token.trim().toLowerCase()
  if (key === "add" || key === "added" || key === "+") {
    return "add"
  }
  if (key === "change" || key === "changed" || key === "~") {
    return "change"
  }
  if (key === "fix" || key === "fixed" || key === "*") {
    return "fix"
  }
  if (key === "remove" || key === "removed" || key === "-") {
    return "remove"
  }
  return undefined
}

function changesOf(children: ReactNode): ChangeProps[] {
  const listed = listItems(children)
  if (listed.length === 0) {
    return childItems(children, Change)
  }

  return listed.map((item) => {
    const { label, rest } = splitLabel(itemText(item))
    return {
      type: typeOf(label) ?? "change",
      children: rest || itemText(item),
    }
  })
}
function Changelog({
  version,
  date,
  title,
  children,
  palette,
  corner,
  frame,
  className,
}: ChangelogProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const changes = changesOf(children)

  return (
    <Graph
      className={className}
      corner={corner}
      frame={frame}
      title={title ?? version}
    >
      <GraphBody className="flex flex-col gap-4">
        {date || title ? (
          <>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-foreground tabular-nums">
                {title ? version : ""}
              </span>
              {date ? (
                <span className="text-graph-muted tabular-nums">{date}</span>
              ) : null}
            </div>
            <GraphRule />
          </>
        ) : null}
        <motion.ul
          className="flex flex-col gap-2"
          initial={reduce ? false : "hidden"}
          role="list"
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {changes.map((change, index) => {
            const type = change.type ?? "change"
            const tone =
              type === "add"
                ? toneClass(palette, "primary")
                : type === "remove"
                  ? toneClass(palette, "secondary")
                  : "text-foreground"

            return (
              <motion.li
                className="grid grid-cols-[1.25rem_5.5rem_minmax(0,1fr)] items-baseline gap-x-3 max-sm:grid-cols-[1.25rem_minmax(0,1fr)]"
                key={`${index}-${type}`}
                variants={item}
              >
                <span
                  aria-hidden="true"
                  className={cn("text-center select-none", tone)}
                >
                  {glyph[type]}
                </span>
                <span className="text-graph-muted max-sm:hidden">
                  {label[type]}
                </span>
                <GraphProse
                  className={cn(
                    type === "remove" ? "text-graph-muted" : "text-foreground"
                  )}
                >
                  {change.children}
                </GraphProse>
              </motion.li>
            )
          })}
        </motion.ul>
      </GraphBody>
    </Graph>
  )
}

export { Change, Changelog }
export type { ChangelogProps, ChangeProps, ChangeType }
