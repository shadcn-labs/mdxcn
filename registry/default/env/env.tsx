"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  elementsOf,
  Graph,
  GraphBody,
  hasHost,
  isHost,
  itemText,
  listItems,
  splitDash,
  splitLabel,
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

type EnvVar = {
  name: string
  /** Empty means no default. */
  value?: string
  /** Muted, under the name. The comment above it in a `.env` fence. */
  note?: string
  required?: boolean
}

type EnvProps = {
  /** Default `.env`. */
  title?: string
  /** Data form. Or a `.env` fence, or a Markdown list. */
  vars?: EnvVar[]
  /**
   * Markdown. A fenced `.env`: comments above a key describe it, and a
   * comment that says `required` marks it. Or a list: `- **KEY**: value — note`.
   */
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

const REQUIRED = /\(?\brequired\b\)?[.:]?/i

function unquote(value: string) {
  return value.replace(/^(['"])([\s\S]*)\1$/, "$2")
}

function fromFence(source: string): EnvVar[] {
  const vars: EnvVar[] = []
  let notes: string[] = []

  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim()
    if (line === "") {
      notes = []
      continue
    }
    if (line.startsWith("#")) {
      notes.push(line.replace(/^#+\s*/, ""))
      continue
    }
    const match = line.match(/^(?:export\s+)?([A-Za-z_][\w.]*)\s*=\s*(.*)$/)
    if (!match) {
      continue
    }
    const [value = "", inline = ""] = (match[2] ?? "").split(/\s+#\s*/)
    const all = [...notes, inline].filter(Boolean)
    const required = all.some((note) => REQUIRED.test(note))
    const note = all
      .map((entry) => entry.replace(REQUIRED, "").replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .join(" ")
    vars.push({
      name: match[1] ?? "",
      value: unquote(value.trim()),
      note: note || undefined,
      required,
    })
    notes = []
  }

  return vars
}

function fromList(children: ReactNode): EnvVar[] {
  return listItems(children).map((item) => {
    const content = (item.props as { children?: ReactNode }).children
    const { label, rest } = splitLabel(itemText(item))
    const { label: value, rest: note } = splitDash(rest)
    return {
      name: label,
      value,
      note: note || undefined,
      required: hasHost(content, ["strong", "b"]),
    }
  })
}

/**
 * Environment variables. Markdown:
 *
 * ````mdx
 * <Env>
 *
 * ```bash
 * # Postgres connection string. Required.
 * DATABASE_URL=postgres://localhost:5432/app
 *
 * # Leave empty to turn analytics off
 * ANALYTICS_ID=
 * ```
 *
 * </Env>
 * ````
 */
function Env({
  title = ".env",
  vars: varsProp,
  children,
  palette,
  corner,
  frame,
  className,
}: EnvProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.04)
  const pre = elementsOf(children).find((element) => isHost(element, "pre"))
  const listed = fromList(children)
  const vars =
    varsProp ??
    (pre
      ? fromFence(textOf(pre))
      : listed.length > 0
        ? listed
        : fromFence(textOf(children)))
  const anyRequired = vars.some((entry) => entry.required)
  const accent = toneClass(palette, "primary")

  return (
    <Graph className={className} corner={corner} frame={frame} title={title}>
      <GraphBody className="flex flex-col gap-4">
        <motion.ul
          role="list"
          className="flex flex-col gap-3"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {vars.map((entry, index) => (
            <motion.li
              className="grid grid-cols-[1.25rem_minmax(0,14rem)_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 max-sm:grid-cols-[1.25rem_minmax(0,1fr)]"
              key={`${entry.name}-${index}`}
              variants={item}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "text-center select-none",
                  entry.required ? accent : "text-transparent"
                )}
              >
                {entry.required ? "*" : " "}
              </span>
              <span className="truncate text-foreground">
                {entry.name}
                {entry.required ? (
                  <span className="sr-only"> (required)</span>
                ) : null}
              </span>
              <span
                className={cn(
                  "min-w-0 break-all tabular-nums max-sm:col-start-2",
                  entry.value ? "text-graph-muted" : "text-graph-frame"
                )}
              >
                {entry.value || "—"}
              </span>
              {entry.note ? (
                <span className="col-start-2 text-pretty text-graph-muted sm:col-span-2">
                  {entry.note}
                </span>
              ) : null}
            </motion.li>
          ))}
        </motion.ul>
        {anyRequired ? (
          <p aria-hidden="true" className="text-graph-muted">
            <span className={accent}>*</span> required
          </p>
        ) : null}
      </GraphBody>
    </Graph>
  )
}

export { Env }
export type { EnvProps, EnvVar }
