"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  Graph,
  GraphBody,
  GraphRule,
  labeledTable,
  Row,
  textOf,
  words,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  DIM_OPACITY,
  fadeUp,
  staggerList,
  toneClass,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type MatrixRow = {
  label: string
  values: (number | string)[]
}

type GraphMatrixProps = {
  title?: string
  /** Data form. Or `"Pos Neg"`. */
  columns?: string[] | string
  /** Data form. Or write `<Row label="Pos">41 3</Row>`. */
  rows?: MatrixRow[]
  children?: ReactNode
  accent?: string
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function matrixValues(text: string): (number | string)[] {
  return text
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((token) => {
      const parsed = Number(token)
      return Number.isFinite(parsed) ? parsed : token
    })
}

function formatCell(value: number | string) {
  if (typeof value === "number") {
    return value.toLocaleString("en-US", {
      maximumFractionDigits: Number.isInteger(value) ? 0 : 1,
    })
  }

  return value
}

function RuleY() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 graph-rule-y"
    />
  )
}

function GraphMatrix({
  title,
  columns: columnsProp,
  rows: rowsProp,
  children,
  accent,
  palette,
  corner,
  frame,
  className,
}: GraphMatrixProps) {
  const markdown = labeledTable(children)
  const columns =
    columnsProp == null ? (markdown?.columns ?? []) : words(columnsProp)
  const taggedRows = childItems(children, Row).map((row) => ({
    label: row.label ?? "",
    values: matrixValues(textOf(row.children)),
  }))
  const rows = (
    rowsProp ??
    (taggedRows.length > 0
      ? taggedRows
      : (markdown?.rows.map((row) => ({
          label: row.label,
          values: matrixValues(row.values.join(" ")),
        })) ?? []))
  ).map((row) => ({ ...row, label: row.label ?? "" }))
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.04)
  const template = `minmax(6rem, 1fr) repeat(${columns.length}, minmax(4.5rem, 7rem))`

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="overflow-x-auto overflow-y-hidden">
        <div className="flex flex-col">
          <div
            className="grid items-end"
            style={{ gridTemplateColumns: template }}
          >
            <span />
            {columns.map((column) => (
              <span
                className="relative px-3 pb-3 text-right text-graph-muted"
                key={column}
              >
                <RuleY />
                {column}
              </span>
            ))}
          </div>
          <GraphRule />
          <motion.ul
            className="flex flex-col"
            initial={reduce ? false : "hidden"}
            role="list"
            variants={list}
            viewport={graphViewport}
            whileInView="show"
          >
            {rows.map((row) => {
              const live = Boolean(accent) && row.label === accent
              const dim = Boolean(accent) && !live

              return (
                <motion.li
                  className="grid items-baseline"
                  key={row.label}
                  style={{
                    gridTemplateColumns: template,
                    opacity: dim ? DIM_OPACITY : undefined,
                  }}
                  variants={item}
                >
                  <span
                    className={cn(
                      "min-w-0 py-2.5 pr-3 wrap-break-word",
                      live ? toneClass(palette, "primary") : "text-foreground"
                    )}
                  >
                    {row.label}
                  </span>
                  {columns.map((column, index) => (
                    <span
                      className={cn(
                        "relative px-3 py-2.5 text-right tabular-nums",
                        live ? toneClass(palette, "primary") : "text-foreground"
                      )}
                      key={`${row.label}-${column}`}
                    >
                      <RuleY />
                      {formatCell(row.values[index] ?? "")}
                    </span>
                  ))}
                </motion.li>
              )
            })}
          </motion.ul>
        </div>
        <span className="sr-only">
          Matrix with {rows.length} rows and {columns.length} columns
        </span>
      </GraphBody>
    </Graph>
  )
}

export { GraphMatrix, Row }
export type { GraphMatrixProps, MatrixRow }
