"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  elementsOf,
  Graph,
  GraphBody,
  GraphProse,
  GraphRule,
  hasHost,
  isHost,
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

type OptionState = "chosen" | "open" | "rejected"

type DecisionOption = {
  label: string
  /** Why. Muted, after the option. `— reason` in Markdown. */
  reason?: string
  /** chosen is the accent. rejected recedes. open (default) stays plain. */
  state?: OptionState
}

type DecisionProps = {
  /** Default `decision`. */
  title?: string
  /** proposed, accepted, superseded — any word. First row, left. */
  status?: string
  /** Muted, first row, right. */
  date?: string
  /** Data form. Or a Markdown list. */
  options?: DecisionOption[]
  /** Markdown. A list of options, then paragraphs for what follows. */
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

const glyph: Record<OptionState, string> = {
  chosen: "●",
  open: "○",
  rejected: "×",
}

function optionsOf(children: ReactNode): DecisionOption[] {
  return listItems(children).map((item) => {
    const content = (item.props as { children?: ReactNode }).children
    const { label, rest } = splitDash(itemText(item))
    const chosen = hasHost(content, ["strong", "b"])
    const rejected = !chosen && hasHost(content, ["em", "i"])
    return {
      label,
      reason: rest || undefined,
      state: chosen ? "chosen" : rejected ? "rejected" : "open",
    }
  })
}

/**
 * One decision, the options next to it, and what follows. Markdown:
 *
 * ```mdx
 * <Decision title="DATABASE" status="accepted" date="Mar 12">
 *
 * - **Postgres** — boring, and we already run it
 * - *Mongo* — no joins we trust
 * - SQLite — fine until the second writer
 *
 * Revisit if writes pass 2k/s.
 *
 * </Decision>
 * ```
 *
 * Bold is chosen, italic is rejected.
 */
function Decision({
  title = "decision",
  status,
  date,
  options: optionsProp,
  children,
  palette,
  corner,
  frame,
  className,
}: DecisionProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const options = optionsProp ?? optionsOf(children)
  const after = elementsOf(children).filter(
    (element) => !isHost(element, ["ul", "ol"])
  )
  const chosen = options.find((option) => option.state === "chosen")

  return (
    <Graph className={className} corner={corner} frame={frame} title={title}>
      <GraphBody className="flex flex-col gap-4">
        {status || date ? (
          <>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-foreground">{status ?? ""}</span>
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
          {options.map((option, index) => {
            const state = option.state ?? "open"
            const tone =
              state === "chosen"
                ? toneClass(palette, "primary")
                : state === "rejected"
                  ? toneClass(palette, "secondary")
                  : "text-foreground"

            return (
              <motion.li
                className="grid grid-cols-[1.25rem_minmax(0,11rem)_minmax(0,1fr)] items-baseline gap-x-3 max-sm:grid-cols-[1.25rem_minmax(0,1fr)]"
                key={`${option.label}-${index}`}
                variants={item}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "text-center select-none",
                    state === "open" ? "text-graph-muted" : tone
                  )}
                >
                  {glyph[state]}
                </span>
                <span className={tone}>{option.label}</span>
                {option.reason ? (
                  <span className="text-graph-muted max-sm:col-start-2">
                    {option.reason}
                  </span>
                ) : null}
              </motion.li>
            )
          })}
        </motion.ul>
        {after.length > 0 ? (
          <>
            <GraphRule />
            <motion.div
              initial={reduce ? false : "hidden"}
              variants={item}
              viewport={graphViewport}
              whileInView="show"
            >
              <GraphProse className="text-foreground/80">{after}</GraphProse>
            </motion.div>
          </>
        ) : null}
        {chosen ? (
          <span className="sr-only">
            Chose {chosen.label} over {options.length - 1} other options.
          </span>
        ) : null}
      </GraphBody>
    </Graph>
  )
}

export { Decision }
export type { DecisionOption, DecisionProps, OptionState }
