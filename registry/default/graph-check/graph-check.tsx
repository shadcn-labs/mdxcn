"use client"

import { isValidElement, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  defineItem,
  Graph,
  GraphBody,
  isHost,
  itemParts,
  itemText,
  listItems,
  childNodes,
  splitDash,
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

type CheckItem = {
  /** Falls back to the child text: `<Task done>freeze tokens</Task>`. */
  label?: string
  done?: boolean
  note?: string
  /** Sub-tasks. A nested list in Markdown. */
  items?: CheckItem[]
}

type GraphCheckProps = {
  title?: string
  /** Data form. Or write `<Task />` children. */
  items?: CheckItem[]
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

/** `<Task done>ship registry json</Task>` inside `<GraphCheck>`. */
const Task = defineItem<CheckItem>("Task")

function checksOf(children: ReactNode): CheckItem[] {
  const listed = listItems(children).map((item): CheckItem => {
    const content = (item.props as { children?: ReactNode }).children
    const box = childNodes(content).find(
      (child) =>
        isValidElement(child) &&
        isHost(child, "input") &&
        (child.props as { type?: string }).type === "checkbox"
    )
    const text = itemText(item)
    const marked = /^\s*\[x\]/i.test(text)
    const done =
      marked ||
      (isValidElement(box) &&
        Boolean((box.props as { checked?: boolean }).checked))
    const label = text.replace(/^\s*\[[xX ]\]\s*/, "")
    const { label: name, rest } = splitDash(label)
    const nested = itemParts(item).lists.flatMap((list) => checksOf(list))
    return {
      label: name,
      done,
      note: rest || undefined,
      items: nested.length > 0 ? nested : undefined,
    }
  })
  if (listed.length > 0) {
    return listed
  }

  return childItems(children, Task).map((entry) => ({
    ...entry,
    label: entry.label ?? textOf(entry.children),
  }))
}

function flatten(items: CheckItem[]): CheckItem[] {
  return items.flatMap((entry) => [entry, ...flatten(entry.items ?? [])])
}

function CheckRow({
  entry,
  palette,
  variants,
  nested = false,
}: {
  entry: CheckItem
  palette?: GraphPalette
  variants?: ReturnType<typeof fadeUp>
  nested?: boolean
}) {
  const done = Boolean(entry.done)
  const Row = nested ? "li" : motion.li

  return (
    <Row
      className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-3"
      {...(nested ? {} : { variants })}
    >
      <span
        aria-hidden="true"
        className={cn(
          "select-none",
          done ? toneClass(palette, "primary") : "text-graph-muted"
        )}
      >
        {done ? "[x]" : "[ ]"}
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className={done ? "text-foreground" : "text-graph-muted"}>
          {entry.label}
        </span>
        {entry.note ? (
          <span className="text-graph-muted">{entry.note}</span>
        ) : null}
        {entry.items?.length ? (
          <ul className="mt-1 flex flex-col gap-2" role="list">
            {entry.items.map((child) => (
              <CheckRow
                entry={child}
                key={child.label}
                nested
                palette={palette}
              />
            ))}
          </ul>
        ) : null}
      </span>
    </Row>
  )
}

function GraphCheck({
  title,
  items: itemsProp,
  children,
  palette,
  corner,
  frame,
  className,
}: GraphCheckProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const items = itemsProp ?? checksOf(children)
  const flat = flatten(items)

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody>
        <motion.ul
          className="flex flex-col gap-2"
          initial={reduce ? false : "hidden"}
          role="list"
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {items.map((entry) => (
            <CheckRow
              entry={entry}
              key={entry.label}
              palette={palette}
              variants={item}
            />
          ))}
        </motion.ul>
        <span className="sr-only">
          {flat.filter((entry) => entry.done).length} of {flat.length} done
        </span>
      </GraphBody>
    </Graph>
  )
}

export { GraphCheck, Task }
export type { CheckItem, GraphCheckProps }
