"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  defineItem,
  Graph,
  GraphBody,
  hasHost,
  itemText,
  listItems,
  nestedList,
  textOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  DIM_OPACITY,
  fadeUp,
  staggerList,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type TreeNode = {
  label: string
  meta?: string
  accent?: boolean
  children?: TreeNode[]
}

/**
 * Nested `<Node>` children. `label` falls back to the text child when the
 * node has no nested nodes: `<Node meta="ui">graph-frame.tsx</Node>`.
 */
type NodeProps = {
  label?: string
  meta?: string
  accent?: boolean
  children?: ReactNode
}

type GraphTreeProps = {
  title?: string
  /** Data form. Or nest `<Node />` children. */
  nodes?: TreeNode[]
  children?: ReactNode
  corner?: string
  frame?: GraphFrame
  className?: string
}

/** `<Node label="platform"><Node meta="priya">api</Node></Node>` inside `<GraphTree>`. */
const Node = defineItem<NodeProps>("Node")

function nodesFromList(items: ReturnType<typeof listItems>): TreeNode[] {
  return items.map((item) => {
    const kids = nodesFromList(nestedList(item))
    const text = itemText(item)
    const [name, extra] = text.split(/\s+[—–]\s+/)
    return {
      label: name || text,
      meta: extra,
      accent: hasHost((item.props as { children?: ReactNode }).children, [
        "strong",
        "b",
      ]),
      children: kids.length > 0 ? kids : undefined,
    }
  })
}

function nodesOf(children: ReactNode): TreeNode[] {
  const listed = nodesFromList(listItems(children))
  if (listed.length > 0) {
    return listed
  }

  return childItems(children, Node).map((node) => {
    const kids = nodesOf(node.children)
    return {
      label: node.label ?? (kids.length === 0 ? textOf(node.children) : ""),
      meta: node.meta,
      accent: node.accent,
      children: kids.length > 0 ? kids : undefined,
    }
  })
}

type FlatRow = {
  key: string
  branch: string
  label: string
  meta?: string
  accent?: boolean
}

function flatten(
  nodes: TreeNode[],
  prefix = "",
  trail = "root",
  isRoot = true
): FlatRow[] {
  const singleRoot = isRoot && nodes.length === 1

  return nodes.flatMap((node, index) => {
    const last = index === nodes.length - 1
    const branch = singleRoot ? "" : prefix + (last ? "└─ " : "├─ ")
    const key = `${trail}/${node.label}-${index}`
    const childPrefix = singleRoot ? "" : prefix + (last ? "   " : "│  ")
    const row: FlatRow = {
      key,
      branch,
      label: node.label,
      meta: node.meta,
      accent: node.accent,
    }
    const kids = node.children
      ? flatten(node.children, childPrefix, key, false)
      : []
    return [row, ...kids]
  })
}

function GraphTree({
  title,
  nodes,
  children,
  corner,
  frame,
  className,
}: GraphTreeProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.03)
  const rows = flatten(nodes ?? nodesOf(children))
  const hasAccent = rows.some((row) => row.accent)

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="overflow-x-auto overflow-y-hidden">
        <motion.ul
          role="list"
          className="flex min-w-max flex-col gap-1"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {rows.map((row) => {
            const dim = hasAccent && !row.accent

            return (
              <motion.li
                key={row.key}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6"
                style={dim ? { opacity: DIM_OPACITY } : undefined}
                variants={item}
              >
                <span className="whitespace-nowrap">
                  <span
                    aria-hidden="true"
                    className="text-graph-frame select-none"
                  >
                    {row.branch}
                  </span>
                  <span
                    className={cn(
                      row.accent ? "text-graph-accent" : "text-foreground"
                    )}
                  >
                    {row.label}
                  </span>
                </span>
                {row.meta ? (
                  <span className="text-graph-muted tabular-nums">
                    {row.meta}
                  </span>
                ) : (
                  <span />
                )}
              </motion.li>
            )
          })}
        </motion.ul>
        <span className="sr-only">Tree with {rows.length} nodes</span>
      </GraphBody>
    </Graph>
  )
}

export { GraphTree, Node }
export type { GraphTreeProps, NodeProps, TreeNode }
