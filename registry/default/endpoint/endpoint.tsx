"use client"

import type { ReactElement, ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childrenOf,
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

type EndpointParam = {
  name: string
  type?: string
  /** Markdown. */
  description?: ReactNode
  required?: boolean
}

type EndpointBlock = {
  /** Muted, above the block. Defaults to the fence language. */
  label?: string
  code: string
}

type EndpointProps = {
  /** Default `endpoint`. */
  title?: string
  /** Or the first line of the children: `POST /v1/graphs`. */
  method?: string
  path?: string
  /** Data form. Or a Markdown table: name, type, description. */
  params?: EndpointParam[]
  /** Data form. Or fenced blocks in the children. */
  blocks?: EndpointBlock[]
  /**
   * Markdown. `POST /v1/graphs`, a sentence, a table of params (bold name is
   * required), then fenced request / response blocks.
   */
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

const ROUTE = /^\s*(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|QUERY)\s+(\S+)\s*$/i

function cellsOf(row: ReactElement) {
  return elementsOf(childrenOf(row)).filter((cell) =>
    isHost(cell, ["td", "th"])
  )
}

function paramsOf(table: ReactElement | undefined): EndpointParam[] {
  if (!table) {
    return []
  }
  const sections = elementsOf(childrenOf(table))
  const body =
    sections.find((section) => isHost(section, "tbody")) ??
    sections.find((section) => !isHost(section, "thead"))
  const rows = elementsOf(body ? childrenOf(body) : null).filter((row) =>
    isHost(row, "tr")
  )

  return rows.map((row) => {
    const [name, type, ...rest] = cellsOf(row)
    return {
      name: name ? textOf(childrenOf(name)).trim() : "",
      type: type ? textOf(childrenOf(type)).trim() || undefined : undefined,
      description: rest[0] ? childrenOf(rest[0]) : undefined,
      required: name ? hasHost(childrenOf(name), ["strong", "b"]) : false,
    }
  })
}

function blocksOf(elements: ReactElement[]): EndpointBlock[] {
  return elements
    .filter((element) => isHost(element, "pre"))
    .map((pre) => {
      const code = elementsOf(childrenOf(pre)).find((element) =>
        isHost(element, "code")
      )
      const className = (code?.props as { className?: unknown } | undefined)
        ?.className
      const language =
        typeof className === "string"
          ? className.match(/language-(\S+)/)?.[1]
          : undefined
      const text = textOf(pre).replace(/\n$/, "")
      return {
        label: /^\s*(\$ |curl\b)/.test(text) ? "request" : language,
        code: text,
      }
    })
}

/**
 * One API route. Markdown:
 *
 * ````mdx
 * <Endpoint>
 *
 * POST /v1/graphs
 *
 * Draws a graph from props. Returns the fenced ASCII.
 *
 * | Field | Type | |
 * | --- | --- | --- |
 * | **slug** | string | `graph-timeline`, `graph-table`, … |
 * | props | object | Same shape as the React API |
 *
 * ```json
 * { "ascii": "+--- [ NIGHT ] ---+" }
 * ```
 *
 * </Endpoint>
 * ````
 */
function Endpoint({
  title = "endpoint",
  method: methodProp,
  path: pathProp,
  params: paramsProp,
  blocks: blocksProp,
  children,
  palette,
  corner,
  frame,
  className,
}: EndpointProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.04)
  const elements = elementsOf(children)
  const paragraphs = elements.filter((element) => isHost(element, "p"))
  const route = paragraphs
    .map((paragraph) => textOf(paragraph).match(ROUTE))
    .find(Boolean)
  const method = (methodProp ?? route?.[1] ?? "GET").toUpperCase()
  const path = pathProp ?? route?.[2] ?? "/"
  const about = paragraphs.filter((paragraph) => !ROUTE.test(textOf(paragraph)))
  const params =
    paramsProp ?? paramsOf(elements.find((element) => isHost(element, "table")))
  const blocks = blocksProp ?? blocksOf(elements)
  const anyRequired = params.some((param) => param.required)
  const accent = toneClass(palette, "primary")

  return (
    <Graph className={className} corner={corner} frame={frame} title={title}>
      <GraphBody className="flex flex-col gap-4">
        <motion.div
          className="flex flex-col gap-3"
          initial={reduce ? false : "hidden"}
          variants={item}
          viewport={graphViewport}
          whileInView="show"
        >
          <p className="flex min-w-0 items-baseline gap-3">
            <span className={cn("shrink-0", accent)}>{method}</span>
            <span className="min-w-0 break-all text-foreground">{path}</span>
          </p>
          {about.length > 0 ? (
            <GraphProse className="text-graph-muted">{about}</GraphProse>
          ) : null}
        </motion.div>
        {params.length > 0 ? (
          <>
            <GraphRule />
            <motion.ul
              role="list"
              className="flex flex-col gap-2"
              initial={reduce ? false : "hidden"}
              variants={list}
              viewport={graphViewport}
              whileInView="show"
            >
              {params.map((param, index) => (
                <motion.li
                  className="grid grid-cols-[1.25rem_minmax(0,11rem)_minmax(0,7rem)_minmax(0,1fr)] items-baseline gap-x-3 max-sm:grid-cols-[1.25rem_minmax(0,1fr)_auto]"
                  key={`${param.name}-${index}`}
                  variants={item}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "text-center select-none",
                      param.required ? accent : "text-transparent"
                    )}
                  >
                    {param.required ? "*" : " "}
                  </span>
                  <span className="truncate text-foreground">
                    {param.name}
                    {param.required ? (
                      <span className="sr-only"> (required)</span>
                    ) : null}
                  </span>
                  <span className="truncate text-graph-muted">
                    {param.type ?? ""}
                  </span>
                  {param.description ? (
                    <span className="min-w-0 max-sm:col-span-2 max-sm:col-start-2">
                      <GraphProse className="text-foreground/80">
                        {param.description}
                      </GraphProse>
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
          </>
        ) : null}
        {blocks.map((block, index) => (
          <motion.div
            className="flex min-w-0 flex-col gap-3"
            initial={reduce ? false : "hidden"}
            key={index}
            variants={item}
            viewport={graphViewport}
            whileInView="show"
          >
            <GraphRule />
            {block.label ? (
              <p className="text-graph-muted">{block.label}</p>
            ) : null}
            <div className="overflow-x-auto overflow-y-hidden">
              <pre className="m-0 min-w-max leading-relaxed whitespace-pre text-foreground/80">
                <code>{block.code}</code>
              </pre>
            </div>
          </motion.div>
        ))}
      </GraphBody>
    </Graph>
  )
}

export { Endpoint }
export type { EndpointBlock, EndpointParam, EndpointProps }
