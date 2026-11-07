"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  Graph,
  GraphBody,
  GraphProse,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type CalloutType = "note" | "tip" | "warning" | "danger"

type CalloutProps = {
  /** Sets the frame title and the glyph. Default note. */
  type?: CalloutType
  /** Overrides the frame title. Defaults to the type, uppercase. */
  title?: string
  /** Markdown. Paragraphs, lists, inline code, links. */
  children?: ReactNode
  corner?: string
  frame?: GraphFrame
  className?: string
}

const glyph: Record<CalloutType, string> = {
  note: "i",
  tip: "+",
  warning: "!",
  danger: "×",
}

const tone: Record<CalloutType, string> = {
  note: "text-graph-muted",
  tip: "text-graph-accent",
  warning: "text-graph-accent",
  danger: "text-destructive",
}

/**
 * An aside between paragraphs.
 *
 * ```mdx
 * <Callout type="warning">
 *   The CLI copies files. It does not add an npm dependency.
 * </Callout>
 * ```
 */
function Callout({
  type = "note",
  title,
  children,
  corner,
  frame,
  className,
}: CalloutProps) {
  const reduce = useReducedMotion()

  return (
    <Graph
      className={className}
      corner={corner}
      frame={frame}
      role="note"
      title={title ?? type}
    >
      <GraphBody className="py-6 sm:py-6">
        <motion.div
          className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-3"
          initial={reduce ? false : "hidden"}
          variants={fadeUp(reduce)}
          viewport={graphViewport}
          whileInView="show"
        >
          <span
            aria-hidden="true"
            className={cn(
              "text-center leading-relaxed select-none",
              tone[type]
            )}
          >
            {glyph[type]}
          </span>
          <GraphProse className="text-foreground">{children}</GraphProse>
        </motion.div>
      </GraphBody>
    </Graph>
  )
}

export { Callout }
export type { CalloutProps, CalloutType }
