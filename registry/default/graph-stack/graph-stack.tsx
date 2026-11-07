"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  defineItem,
  Graph,
  GraphBody,
  GraphTick,
  GraphTrack,
  itemText,
  listItems,
  numberOf,
  splitLabel,
  textOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  isMonoPalette,
  resolveGlyphs,
  seriesClass,
  seriesDim,
  staggerList,
  type Glyphs,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"

const DEFAULT_GLYPHS = ["█", "▓", "▒", "░", "#", "=", "+", "-"]

type StackSegment = {
  /** Falls back to the child text: `<Segment value={48}>js</Segment>`. */
  label?: string
  value: number | string
}

type StackRow = {
  label: string
  /** Data form. Or nest `<Segment />` children inside `<Bar>`. */
  segments?: StackSegment[]
  children?: ReactNode
}

type GraphStackProps = {
  title?: string
  /** Data form. Or write `<Bar>` children with `<Segment>` inside. */
  rows?: StackRow[]
  children?: ReactNode
  accent?: string
  ticks?: number
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

/** `<Bar label="marketing"><Segment value={48}>js</Segment></Bar>` inside `<GraphStack>`. */
const Bar = defineItem<StackRow>("Bar")

/** One part of a `<Bar>`. */
const Segment = defineItem<StackSegment>("Segment")

type SegmentRow = { label: string; value: number }
type BarRow = { label: string; segments: SegmentRow[] }

function segmentsOf(row: StackRow): SegmentRow[] {
  const source = row.segments ?? childItems(row.children, Segment)
  return source.map((segment) => ({
    label:
      segment.label ?? textOf((segment as { children?: ReactNode }).children),
    value: numberOf(segment.value),
  }))
}

function segmentsFromText(text: string): SegmentRow[] {
  const parts = [...text.matchAll(/([\d,.]+)\s+(\S+)/g)]
  return parts.map((part) => ({
    label: part[2] ?? "",
    value: numberOf(part[1]),
  }))
}

type Painted = {
  label: string
  glyph: string
  count: number
  accent: boolean
}

function paintRow(
  segments: SegmentRow[],
  ticks: number,
  glyphs: readonly string[],
  accentLabel?: string
): Painted[] {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1
  let left = ticks

  return segments.map((segment, index) => {
    const raw = Math.round((segment.value / total) * ticks)
    const count =
      index === segments.length - 1
        ? Math.max(0, left)
        : Math.min(Math.max(0, raw), left)
    left -= count
    const highlighted = accentLabel
      ? segment.label === accentLabel
      : index === 0

    return {
      label: segment.label,
      glyph: glyphs[index % glyphs.length] ?? "█",
      count,
      accent: highlighted,
    }
  })
}

function GraphStack({
  title,
  rows: rowsProp,
  children,
  accent,
  ticks = 24,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphStackProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const set = glyphs == null ? DEFAULT_GLYPHS : resolveGlyphs(glyphs)
  const listed = listItems(children).map((item) => {
    const { label, rest } = splitLabel(itemText(item))
    return {
      label,
      segments: segmentsFromText(rest),
    }
  })
  const tagged = childItems(children, Bar).map((row) => ({
    label: row.label,
    segments: segmentsOf(row),
  }))
  const rows: BarRow[] = rowsProp
    ? rowsProp.map((row) => ({
        label: row.label,
        segments: segmentsOf(row),
      }))
    : listed.length > 0
      ? listed
      : tagged
  const legend: string[] = []

  for (const row of rows) {
    for (const segment of row.segments) {
      if (!legend.includes(segment.label)) {
        legend.push(segment.label)
      }
    }
  }

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col gap-6">
        <motion.ul
          className="flex flex-col gap-3"
          initial={reduce ? false : "hidden"}
          role="list"
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {rows.map((row) => {
            const painted = paintRow(row.segments, ticks, set, accent)

            return (
              <motion.li
                aria-label={`${row.label}: ${row.segments
                  .map((segment) => `${segment.label} ${segment.value}`)
                  .join(", ")}`}
                className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-x-2 sm:gap-x-4"
                key={row.label}
                variants={item}
              >
                <span className="truncate text-foreground">{row.label}</span>
                <GraphTrack>
                  {painted.flatMap((piece) =>
                    Array.from({ length: piece.count }, (_, index) => (
                      <GraphTick
                        className={seriesClass(
                          palette,
                          legend.indexOf(piece.label)
                        )}
                        key={`${piece.label}-${index}`}
                        style={seriesDim(
                          palette,
                          isMonoPalette(palette) ? piece.accent : true
                        )}
                      >
                        {piece.glyph}
                      </GraphTick>
                    ))
                  )}
                </GraphTrack>
              </motion.li>
            )
          })}
        </motion.ul>
        <ul className="flex flex-wrap gap-x-4 gap-y-1" role="list">
          {legend.map((label, index) => {
            const glyph = set[index % set.length] ?? "█"
            const highlighted = isMonoPalette(palette)
              ? accent
                ? label === accent
                : index === 0
              : true

            return (
              <li
                className="flex items-center gap-2"
                key={label}
                style={seriesDim(palette, highlighted)}
              >
                <span
                  aria-hidden="true"
                  className={seriesClass(palette, index)}
                >
                  {glyph}
                </span>
                <span
                  className={
                    highlighted ? "text-foreground" : "text-graph-muted"
                  }
                >
                  {label}
                </span>
              </li>
            )
          })}
        </ul>
      </GraphBody>
    </Graph>
  )
}

export { Bar, GraphStack, Segment }
export type { GraphStackProps, StackRow, StackSegment }
