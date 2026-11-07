"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  Graph,
  GraphBody,
  labeledTable,
  numbers,
  Row,
  textOf,
  words,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  intensityClass,
  intensityGlyph,
  intensityLevel,
  resolveGlyphs,
  staggerList,
  type Glyphs,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type HeatRow = {
  label: string
  values: number[]
}

type GraphHeatmapProps = {
  title?: string
  /** Data form. Or `"0 4 8 12"`. */
  columns?: string[] | string
  /** Data form. Or write `<Row label="Mon">0 1 4 8</Row>`. */
  rows?: HeatRow[]
  children?: ReactNode
  max?: number
  legend?: boolean
  caption?: string
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function IntensityScale({
  glyphs,
  palette,
}: {
  glyphs: readonly string[]
  palette?: GraphPalette
}) {
  return (
    <p className="flex items-center gap-2 text-graph-muted">
      <span>Less</span>
      <span aria-hidden="true" className="flex select-none">
        {glyphs.map((glyph, index) => (
          <span
            className={cn(
              "w-[1ch] text-center",
              intensityClass(
                Math.round((index / Math.max(glyphs.length - 1, 1)) * 4),
                palette
              )
            )}
            key={`${glyph}-${index}`}
          >
            {glyph}
          </span>
        ))}
      </span>
      <span>More</span>
    </p>
  )
}

function GraphHeatmap({
  title,
  columns: columnsProp,
  rows: rowsProp,
  children,
  max,
  legend = true,
  caption,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphHeatmapProps) {
  const markdown = labeledTable(children)
  const columns =
    columnsProp == null ? (markdown?.columns ?? []) : words(columnsProp)
  const taggedRows = childItems(children, Row).map((row) => ({
    label: row.label ?? "",
    values: numbers(textOf(row.children)),
  }))
  const rows = (
    rowsProp ??
    (taggedRows.length > 0
      ? taggedRows
      : (markdown?.rows.map((row) => ({
          label: row.label,
          values: numbers(row.values.join(" ")),
        })) ?? []))
  ).map((row) => ({ ...row, label: row.label ?? "" }))
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.04)
  const peak = max ?? Math.max(0, ...rows.flatMap((row) => row.values), 0)
  const template = `minmax(0,7rem) repeat(${Math.max(columns.length, 1)}, minmax(0,1fr))`
  const set = resolveGlyphs(glyphs)

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col gap-4">
        <div className="flex w-full flex-col gap-2">
          <div
            className="grid w-full items-end gap-x-1"
            style={{ gridTemplateColumns: template }}
          >
            <span />
            {columns.map((column) => (
              <span
                className="truncate text-center text-graph-muted"
                key={column}
              >
                {column}
              </span>
            ))}
          </div>
          <motion.ul
            className="flex flex-col gap-1"
            initial={reduce ? false : "hidden"}
            role="list"
            variants={list}
            viewport={graphViewport}
            whileInView="show"
          >
            {rows.map((row) => (
              <motion.li
                aria-label={`${row.label}: ${columns
                  .map((column, index) => `${column} ${row.values[index] ?? 0}`)
                  .join(", ")}`}
                className="grid items-center gap-x-1"
                key={row.label}
                style={{ gridTemplateColumns: template }}
                variants={item}
              >
                <span className="truncate text-foreground">{row.label}</span>
                {columns.map((column, index) => {
                  const value = row.values[index] ?? 0
                  const level = intensityLevel(value, peak)

                  return (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "text-center leading-none select-none",
                        intensityClass(level, palette)
                      )}
                      key={`${row.label}-${column}`}
                    >
                      {intensityGlyph(level, set)}
                    </span>
                  )
                })}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        {legend || caption ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            {caption ? <p className="text-graph-muted">{caption}</p> : <span />}
            {legend ? <IntensityScale glyphs={set} palette={palette} /> : null}
          </div>
        ) : null}
      </GraphBody>
    </Graph>
  )
}

export { GraphHeatmap, Row }
export type { GraphHeatmapProps, HeatRow }
