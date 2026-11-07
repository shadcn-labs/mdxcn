"use client"

import { isValidElement, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  dropLead,
  Graph,
  GraphBody,
  GraphProse,
  isHost,
  itemParts,
  listItems,
  childNodes,
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

type ChatTurn = {
  /** Who is talking. */
  by: string
  /** Markdown. What they said. */
  children?: ReactNode
  /** An aside — a tool call, a pause. Muted. Italic in Markdown. */
  aside?: boolean
}

type ChatProps = {
  /** Default `chat`. */
  title?: string
  /** The person asking. Their turns get the prompt. Default: the first speaker. */
  you?: string
  /** The glyph on your turns. Default `>`. */
  prompt?: string
  /** Data form. Or a Markdown list. */
  turns?: ChatTurn[]
  /** Markdown list. `- you: which graph?` / `- agent: Timeline.` */
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

const SPEAKER = /^\s*([^:\n]{1,24}):\s*/

function turnsOf(children: ReactNode): ChatTurn[] {
  return listItems(children).flatMap((item) => {
    const { head, body } = itemParts(item)
    const { match, rest } = dropLead(head, SPEAKER)
    if (!match) {
      return []
    }
    const parts = childNodes(rest).filter((node) => textOf(node).trim() !== "")
    const only = parts[0]
    const aside =
      body.length === 0 &&
      parts.length === 1 &&
      isValidElement(only) &&
      isHost(only, ["em", "i"])
    return [{ by: (match[1] ?? "").trim(), children: [rest, ...body], aside }]
  })
}

/**
 * A conversation. Markdown:
 *
 * ```mdx
 * <Chat title="SESSION">
 *
 * - you: which graph shows a rollback?
 * - agent: Timeline. Bold the rollback row.
 * - agent: *reads graph-timeline.tsx*
 *
 * </Chat>
 * ```
 *
 * Your turns get the prompt. An italic turn is an aside.
 */
function Chat({
  title = "chat",
  you,
  prompt = ">",
  turns: turnsProp,
  children,
  palette,
  corner,
  frame,
  className,
}: ChatProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.06)
  const turns = turnsProp ?? turnsOf(children)
  const asker = (you ?? turns[0]?.by ?? "").toLowerCase()

  return (
    <Graph className={className} corner={corner} frame={frame} title={title}>
      <GraphBody>
        <motion.ol
          className="flex flex-col"
          initial={reduce ? false : "hidden"}
          role="list"
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {turns.map((turn, index) => {
            const mine = turn.by.toLowerCase() === asker
            const same = index > 0 && turns[index - 1]?.by === turn.by

            return (
              <motion.li
                className={cn(
                  "grid grid-cols-[1.25rem_minmax(0,7rem)_minmax(0,1fr)] items-baseline gap-x-3 max-sm:grid-cols-[1.25rem_minmax(0,1fr)]",
                  index > 0 && (same ? "mt-1" : "mt-4")
                )}
                key={`${index}-${turn.by}`}
                variants={item}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "text-center select-none",
                    mine && !same
                      ? toneClass(palette, "primary")
                      : "text-transparent"
                  )}
                >
                  {mine && !same ? prompt : " "}
                </span>
                <span
                  className={cn(
                    "truncate text-graph-muted",
                    same && "max-sm:hidden"
                  )}
                >
                  {same ? <span className="sr-only">{turn.by}</span> : turn.by}
                </span>
                <GraphProse
                  className={cn(
                    "max-sm:col-start-2",
                    turn.aside ? "text-graph-muted" : "text-foreground"
                  )}
                >
                  {turn.children}
                </GraphProse>
              </motion.li>
            )
          })}
        </motion.ol>
      </GraphBody>
    </Graph>
  )
}

export { Chat }
export type { ChatProps, ChatTurn }
