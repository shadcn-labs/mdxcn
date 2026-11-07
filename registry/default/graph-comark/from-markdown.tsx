"use client"

import type { ComponentType } from "react"

import { Graph, GraphBody } from "@/registry/default/graph-frame/graph-frame"
import { graphViewport } from "@/registry/default/graph-frame/graph-motion"
import type { GraphAdapter } from "@/registry/default/graph-comark/adapters"
import { coerceProps } from "@/registry/default/graph-comark/coerce"

/**
 * Shown while a block's props are still incomplete.
 *
 * Comark auto-closes a dangling `::graph-table`, but a component's props live
 * in a `---` fence that the parser only accepts once the closing fence
 * arrives. For a few frames the tag exists with no props, and `rows.map(...)`
 * would throw. Reserving the frame keeps the layout stable.
 */
function PendingGraph({ title }: { title?: string }) {
  return (
    <Graph title={title}>
      <GraphBody className="flex items-center justify-center py-14">
        <span className="font-mono text-sm text-graph-frame select-none">
          · · ·
        </span>
      </GraphBody>
    </Graph>
  )
}

function isPresent(value: unknown): boolean {
  if (value == null) return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === "string") return value.trim() !== ""
  return true
}

/**
 * A key that changes when a figure's data changes, so the graph remounts.
 *
 * The graphs animate with `whileInView` and `viewport={graphViewport}`. When
 * Markdown is streaming, rows arrive one at a time — children mounted after
 * the parent's once-only animation has fired sit at `opacity: 0`. Remounting
 * on a data change lets the animation run again over the full set.
 *
 * On a static page the props never change, so this is one string per figure.
 * `children` is skipped: React elements are cyclic, and a layout block's
 * identity is its own props.
 */
function propsKey(props: Record<string, unknown>): string | undefined {
  try {
    const parts: string[] = []
    for (const [key, value] of Object.entries(props)) {
      if (key === "children") continue
      parts.push(
        `${key}=${typeof value === "object" && value !== null ? JSON.stringify(value) : String(value)}`
      )
    }
    return parts.join("|")
  } catch {
    return undefined
  }
}

export function fromMarkdown<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  { numeric = [], required = [] }: GraphAdapter = {}
) {
  function MarkdownGraph(raw: Record<string, unknown>) {
    const props = coerceProps<P>(raw, numeric)

    // A block can carry the data as YAML or as its Markdown body — the same
    // grammar MDX children use. Either one is enough.
    const written = isPresent(props.children)
    if (!written && !required.every((key) => isPresent(props[key]))) {
      return <PendingGraph title={props.title as string | undefined} />
    }

    return <Component key={propsKey(props)} {...props} />
  }

  MarkdownGraph.displayName = `FromMarkdown(${
    Component.displayName ?? Component.name ?? "Graph"
  })`

  return MarkdownGraph as ComponentType<Record<string, unknown>>
}
