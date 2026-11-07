"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  Graph,
  GraphBody,
  GraphRule,
  GraphRuleY,
  hasHost,
  headingSections,
  itemText,
  listItems,
  splitDash,
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

type BoardState = "done" | "now" | "next"

type BoardItem = {
  label: string
  /** Muted, under the label. `— note` in Markdown. */
  note?: string
  /** now uses the accent. next recedes. done (default) stays plain. */
  state?: BoardState
}

type BoardColumn = {
  title: string
  items: (BoardItem | string)[]
}

type GraphBoardProps = {
  title?: string
  /** Data form. Or write `### Column` headings, each with a list. */
  columns?: BoardColumn[]
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

/**
 * Columns of work. Markdown:
 *
 * ```mdx
 * <GraphBoard title="ROADMAP">
 *
 * ### Now
 * - **Children for every graph**
 *
 * ### Next
 * - Board — this drop
 *
 * ### Later
 * - *Figma kit*
 *
 * </GraphBoard>
 * ```
 *
 * Bold is now, italic is next. A note after an em dash sits under the item.
 */
function columnsOf(children: ReactNode): BoardColumn[] {
  return headingSections(children).map((section) => ({
    title: section.title,
    items: listItems(section.children).map((item) => {
      const content = (item.props as { children?: ReactNode }).children
      const { label, rest } = splitDash(itemText(item))
      const now = hasHost(content, ["strong", "b"])
      const next = !now && hasHost(content, ["em", "i"])
      return {
        label,
        note: rest || undefined,
        state: now ? "now" : next ? "next" : "done",
      }
    }),
  }))
}

const columnGrid: Record<number, string> = {
  1: "sm:grid-cols-[minmax(0,1fr)]",
  2: "sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
  3: "sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]",
  4: "sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]",
}

function GraphBoard({
  title,
  columns: columnsProp,
  children,
  palette,
  corner,
  frame,
  className,
}: GraphBoardProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.04)
  const columns = (columnsProp ?? columnsOf(children)).slice(0, 4)
  const total = columns.reduce((sum, column) => sum + column.items.length, 0)

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody>
        <div
          className={cn(
            "grid grid-cols-1 gap-y-5 sm:gap-x-5",
            columnGrid[columns.length]
          )}
        >
          {columns.map((column, columnIndex) => {
            const items = column.items.map((entry) =>
              typeof entry === "string" ? { label: entry } : entry
            )

            return [
              columnIndex > 0 ? (
                <div aria-hidden="true" key={`rule-${columnIndex}`}>
                  <GraphRule className="sm:hidden" />
                  <GraphRuleY className="hidden h-full sm:block" />
                </div>
              ) : null,
              <motion.section
                aria-label={column.title}
                className="flex min-w-0 flex-col gap-3"
                initial={reduce ? false : "hidden"}
                key={`${column.title}-${columnIndex}`}
                variants={list}
                viewport={graphViewport}
                whileInView="show"
              >
                <motion.p
                  className="flex items-baseline justify-between gap-3 text-graph-muted"
                  variants={item}
                >
                  <span className="truncate">{column.title}</span>
                  <span className="tabular-nums">{items.length}</span>
                </motion.p>
                <ul className="flex flex-col gap-2" role="list">
                  {items.map((entry, index) => {
                    const state = entry.state ?? "done"

                    return (
                      <motion.li
                        className="grid grid-cols-[1ch_minmax(0,1fr)] items-baseline gap-x-2"
                        key={`${entry.label}-${index}`}
                        variants={item}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "select-none",
                            state === "now"
                              ? toneClass(palette, "primary")
                              : "text-graph-frame"
                          )}
                        >
                          -
                        </span>
                        <span className="flex min-w-0 flex-col gap-1">
                          <span
                            className={cn(
                              "text-pretty",
                              state === "now" && toneClass(palette, "primary"),
                              state === "next" &&
                                toneClass(palette, "secondary"),
                              state === "done" && "text-foreground"
                            )}
                          >
                            {entry.label}
                          </span>
                          {entry.note ? (
                            <span className="text-graph-muted">
                              {entry.note}
                            </span>
                          ) : null}
                        </span>
                      </motion.li>
                    )
                  })}
                </ul>
              </motion.section>,
            ]
          })}
        </div>
        <span className="sr-only">
          {columns
            .map((column) => `${column.title}: ${column.items.length}`)
            .join(", ")}
          . {total} items.
        </span>
      </GraphBody>
    </Graph>
  )
}

export { GraphBoard }
export type { BoardColumn, BoardItem, BoardState, GraphBoardProps }
