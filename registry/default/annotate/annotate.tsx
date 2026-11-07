"use client"

import type { ReactElement, ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  elementsOf,
  Graph,
  GraphBody,
  GraphProse,
  GraphRule,
  isHost,
  itemParts,
  listItems,
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

type AnnotateProps = {
  /** Defaults to the fence language, or `code`. */
  title?: string
  /** Data form. Or a fenced block in the children. */
  code?: string
  /** Data form. Or an ordered list after the fence. */
  notes?: ReactNode[]
  /**
   * Markdown. A fenced block with `// (1)` markers, then an ordered list. The
   * first item explains (1), the second (2).
   */
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

type CodeLine = { text: string; mark?: number }

/** `// (1)`, `# (2)`, `/* (3) *\/`, `<!-- (4) -->`, `{/* (5) *\/}` at line end. */
const MARKER =
  /\s*(?:\/\/|#|--|;|%|\/\*|<!--|\{\/\*)\s*\((\d{1,2})\)\s*(?:\*\/\}|\*\/|-->)?\s*$/

function linesOfCode(source: string): CodeLine[] {
  const lines = source.replace(/\r\n?/g, "\n").replace(/\n+$/, "").split("\n")

  return lines.map((line) => {
    const match = line.match(MARKER)
    if (!match || match.index == null) {
      return { text: line }
    }
    return { text: line.slice(0, match.index), mark: Number(match[1]) }
  })
}

function languageOf(pre: ReactElement | undefined) {
  const code = elementsOf(
    (pre?.props as { children?: ReactNode } | undefined)?.children
  ).find((element) => isHost(element, "code"))
  const className = (code?.props as { className?: unknown } | undefined)
    ?.className
  const match =
    typeof className === "string" ? className.match(/language-(\S+)/) : null
  return match?.[1]
}

/**
 * Code with numbered notes. Markdown:
 *
 * ````mdx
 * <Annotate>
 *
 * ```tsx
 * import { withMdxcn } from "@/registry/default/mdx/mdx" // (1)
 * ```
 *
 * 1. Server-safe. No "use client" in this file.
 *
 * </Annotate>
 * ````
 *
 * Marked lines stay bright. The rest recede.
 */
function Annotate({
  title,
  code: codeProp,
  notes: notesProp,
  children,
  palette,
  corner,
  frame,
  className,
}: AnnotateProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const elements = elementsOf(children)
  const pre = elements.find((element) => isHost(element, "pre"))
  const lines = linesOfCode(codeProp ?? textOf(pre))
  const notes =
    notesProp ??
    listItems(elements.filter((element) => isHost(element, ["ol", "ul"]))).map(
      (note) => {
        const { head, body } = itemParts(note)
        return body.length > 0 ? [head, ...body] : head
      }
    )
  const marked = new Set(lines.flatMap((line) => line.mark ?? []))
  const width = Math.max(
    1,
    ...[...marked, notes.length].map(String).map((n) => n.length)
  )
  const tag = (index: number) => `[${String(index).padStart(width, " ")}]`
  const accent = toneClass(palette, "primary")

  return (
    <Graph
      className={className}
      corner={corner}
      frame={frame}
      title={title ?? languageOf(pre) ?? "code"}
    >
      <GraphBody className="flex flex-col gap-5">
        <motion.div
          className="overflow-x-auto overflow-y-hidden"
          initial={reduce ? false : "hidden"}
          variants={item}
          viewport={graphViewport}
          whileInView="show"
        >
          <pre className="m-0 flex min-w-max flex-col gap-0.5 leading-relaxed whitespace-pre">
            {lines.map((line, index) => (
              <code
                className={cn(
                  "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3",
                  line.mark ? "text-foreground" : "text-graph-muted"
                )}
                key={index}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "tabular-nums select-none",
                    line.mark ? accent : "text-transparent"
                  )}
                >
                  {line.mark ? tag(line.mark) : " "}
                </span>
                <span>{line.text || " "}</span>
              </code>
            ))}
          </pre>
        </motion.div>
        {notes.length > 0 ? (
          <>
            <GraphRule />
            <motion.ol
              className="flex flex-col gap-3"
              initial={reduce ? false : "hidden"}
              role="list"
              variants={list}
              viewport={graphViewport}
              whileInView="show"
            >
              {notes.map((note, index) => (
                <motion.li
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-3"
                  key={index}
                  variants={item}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "tabular-nums select-none",
                      marked.has(index + 1) ? accent : "text-graph-muted"
                    )}
                  >
                    {tag(index + 1)}
                  </span>
                  <GraphProse className="text-foreground">{note}</GraphProse>
                </motion.li>
              ))}
            </motion.ol>
          </>
        ) : null}
      </GraphBody>
    </Graph>
  )
}

export { Annotate }
export type { AnnotateProps }
