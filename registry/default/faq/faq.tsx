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

type FaqEntry = {
  question: string
  /** Markdown. */
  answer?: ReactNode
  /** The question to read first. Bold in Markdown. */
  accent?: boolean
}

type FaqProps = {
  /** Default `faq`. */
  title?: string
  /** Data form. Or `### Question` headings, each followed by the answer. */
  entries?: FaqEntry[]
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"]

function entriesOf(children: ReactNode): FaqEntry[] {
  const entries: { question: string; answer: ReactNode[]; accent: boolean }[] =
    []

  for (const element of elementsOf(children)) {
    if (isHost(element, HEADINGS)) {
      const content = (element.props as { children?: ReactNode }).children
      entries.push({
        question: textOf(content).trim(),
        answer: [],
        accent: hasHost(content, ["strong", "b"]),
      })
      continue
    }
    entries.at(-1)?.answer.push(element)
  }

  return entries.map((entry) => ({
    ...entry,
    answer: entry.answer.length > 0 ? entry.answer : undefined,
  }))
}

/**
 * Questions and answers. Markdown:
 *
 * ```mdx
 * <Faq>
 *
 * ### Is this an npm package?
 *
 * No. The CLI copies the source into your repo.
 *
 * ### Does it need MDX?
 *
 * No. Comark reads `::graph-*` blocks from plain `.md`.
 *
 * </Faq>
 * ```
 */
function Faq({
  title = "faq",
  entries: entriesProp,
  children,
  palette,
  corner,
  frame,
  className,
}: FaqProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.06)
  const entries = entriesProp ?? entriesOf(children)

  return (
    <Graph className={className} corner={corner} frame={frame} title={title}>
      <GraphBody>
        <motion.ol
          className="flex flex-col gap-4"
          role="list"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {entries.map((entry, index) => {
            const tone = entry.accent
              ? toneClass(palette, "primary")
              : "text-foreground"

            return (
              <motion.li
                className="flex flex-col gap-4"
                key={`${entry.question}-${index}`}
                variants={item}
              >
                {index > 0 ? <GraphRule /> : null}
                <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "text-center select-none",
                      entry.accent ? tone : "text-graph-muted"
                    )}
                  >
                    ?
                  </span>
                  <p className={cn("text-pretty", tone)}>{entry.question}</p>
                  {entry.answer ? (
                    <GraphProse className="col-start-2 text-foreground/80">
                      {entry.answer}
                    </GraphProse>
                  ) : null}
                </div>
              </motion.li>
            )
          })}
        </motion.ol>
      </GraphBody>
    </Graph>
  )
}

export { Faq }
export type { FaqEntry, FaqProps }
