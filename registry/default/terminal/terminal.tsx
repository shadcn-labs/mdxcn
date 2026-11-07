"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  Graph,
  GraphBody,
  textOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  staggerList,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type TerminalProps = {
  title?: string
  /** The prompt glyph that marks a command line. Default `$`. */
  prompt?: string
  /** Plain lines, or a fenced code block. `$ cmd` is a command, `# …` a comment. */
  children?: ReactNode
  corner?: string
  frame?: GraphFrame
  className?: string
}

type Line =
  | { kind: "command"; text: string }
  | { kind: "comment"; text: string }
  | { kind: "ok"; text: string }
  | { kind: "output"; text: string }

function parse(source: string, prompt: string): Line[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n")

  while (lines.length > 0 && lines[0]?.trim() === "") {
    lines.shift()
  }

  while (lines.length > 0 && lines[lines.length - 1]?.trim() === "") {
    lines.pop()
  }

  return lines.map((raw) => {
    const text = raw.replace(/\s+$/, "")

    if (text.startsWith(`${prompt} `) || text === prompt) {
      return { kind: "command", text: text.slice(prompt.length).trimStart() }
    }

    if (text.startsWith("#")) {
      return { kind: "comment", text }
    }

    if (/^[✓✔√]/.test(text)) {
      return { kind: "ok", text }
    }

    return { kind: "output", text }
  })
}

/**
 * A shell session.
 *
 * ````mdx
 * <Terminal title="SHELL">
 * ```
 * $ pnpm dlx shadcn@latest add @mdxcn/all
 * ✓ 43 files copied
 * ```
 * </Terminal>
 * ````
 */
function Terminal({
  title = "shell",
  prompt = "$",
  children,
  corner,
  frame,
  className,
}: TerminalProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.04)
  const lines = parse(textOf(children), prompt)

  return (
    <Graph className={className} corner={corner} frame={frame} title={title}>
      <GraphBody className="overflow-x-auto overflow-y-hidden">
        <motion.pre
          className="m-0 flex min-w-max flex-col gap-0.5 leading-relaxed whitespace-pre"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {lines.map((line, index) => (
            <motion.code
              className={cn(
                "grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2",
                line.kind === "command" && "text-foreground",
                line.kind === "comment" && "text-graph-muted",
                line.kind === "ok" && "text-graph-accent",
                line.kind === "output" && "text-graph-muted"
              )}
              key={`${index}-${line.text}`}
              variants={item}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "text-center select-none",
                  line.kind === "command"
                    ? "text-graph-accent"
                    : "text-transparent"
                )}
              >
                {line.kind === "command" ? prompt : " "}
              </span>
              <span>{line.text || " "}</span>
            </motion.code>
          ))}
        </motion.pre>
      </GraphBody>
    </Graph>
  )
}

export { Terminal }
export type { TerminalProps }
