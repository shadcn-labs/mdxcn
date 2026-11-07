"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  Graph,
  GraphBody,
  listItems,
  numbers,
  sourceText,
  splitLabel,
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

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const DAY_MS = 86_400_000

type ActivityDay = {
  date: string
  count: number
}

type ActivityCell = {
  date: string
  count: number
  inRange: boolean
}

type GraphActivityProps = {
  title?: string
  /** `{ date, count }` per day. Or write the counts as children. */
  days?: ActivityDay[]
  /**
   * Markdown. One row per run of days: `- 2026-03-02: 0 1 4 2 0*5 3`. Counts
   * go day by day from the date.
   */
  children?: ReactNode
  weekStartsOn?: 0 | 1
  max?: number
  legend?: boolean
  caption?: string | false
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function parseUTC(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return Date.UTC(year, month - 1, day)
}

function toISO(utc: number) {
  return new Date(utc).toISOString().slice(0, 10)
}

/** `2026-03-02: 0 1 4` → three days from Mar 2. */
function daysOf(children: ReactNode): ActivityDay[] {
  const listed = listItems(children)
  const rows =
    listed.length > 0
      ? listed.map((item) => sourceText(item).trim())
      : sourceText(children).split("\n")

  return rows.flatMap((row) => {
    const { label, rest } = splitLabel(row)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(label)) {
      return []
    }
    const start = parseUTC(label)
    return numbers(rest).map((count, index) => ({
      date: toISO(start + index * DAY_MS),
      count,
    }))
  })
}

function buildWeeks(days: ActivityDay[], weekStartsOn: 0 | 1) {
  if (days.length === 0) {
    return [] as ActivityCell[][]
  }

  const counts = new Map<string, number>()
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY

  for (const day of days) {
    const time = parseUTC(day.date)
    counts.set(day.date, day.count)
    if (time < min) min = time
    if (time > max) max = time
  }

  const lead = (new Date(min).getUTCDay() - weekStartsOn + 7) % 7
  const trail = (weekStartsOn + 6 - new Date(max).getUTCDay() + 7) % 7
  const first = min - lead * DAY_MS
  const last = max + trail * DAY_MS
  const weeks: ActivityCell[][] = []
  let week: ActivityCell[] = []

  for (let time = first; time <= last; time += DAY_MS) {
    const date = toISO(time)
    const inRange = time >= min && time <= max
    week.push({
      date,
      count: inRange ? (counts.get(date) ?? 0) : 0,
      inRange,
    })
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }

  return weeks
}

function monthLabels(weeks: ActivityCell[][]) {
  return weeks.map((week) => {
    const start = week.find((cell) => {
      if (!cell.inRange) {
        return false
      }

      return new Date(parseUTC(cell.date)).getUTCDate() === 1
    })

    if (!start) {
      return ""
    }

    return MONTHS[new Date(parseUTC(start.date)).getUTCMonth()] ?? ""
  })
}

function dayLabels(weekStartsOn: 0 | 1) {
  return weekStartsOn === 1
    ? ["M", "", "W", "", "F", "", ""]
    : ["", "M", "", "W", "", "F", ""]
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

function GraphActivity({
  title,
  days: daysProp,
  children,
  weekStartsOn = 0,
  max,
  legend = true,
  caption,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphActivityProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.01)
  const days = daysProp ?? daysOf(children)
  const weeks = buildWeeks(days, weekStartsOn)
  const months = monthLabels(weeks)
  const labels = dayLabels(weekStartsOn)
  const peak = max ?? Math.max(0, ...days.map((day) => day.count), 0)
  const total = days.reduce((sum, day) => sum + day.count, 0)
  const summary = `${total.toLocaleString("en-US")} contributions`
  const set = resolveGlyphs(glyphs)
  const quiet = set[0] ?? "·"
  const scrollRef = useRef<HTMLDivElement>(null)

  // Narrow frames open on the latest weeks, like GitHub.
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollLeft = el.scrollWidth
    }
  }, [weeks.length])

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col gap-4">
        <div
          className="scrollbar-graph overflow-x-auto overflow-y-hidden"
          ref={scrollRef}
        >
          <div
            className="flex w-full flex-col gap-1 pr-[2ch]"
            style={{ minWidth: `max(100%, ${weeks.length + 4}ch)` }}
          >
            <div className="flex h-[1.25em] w-full">
              <span className="w-[2ch] shrink-0" />
              {months.map((month, index) => (
                <span
                  className="relative min-w-[1ch] flex-1"
                  key={`m-${index}`}
                >
                  {month ? (
                    <span className="absolute bottom-0 left-0 whitespace-nowrap text-graph-muted">
                      {month}
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
            <div className="flex w-full">
              <div className="flex w-[2ch] shrink-0 flex-col">
                {labels.map((label, index) => (
                  <span
                    className="flex h-[1.15em] items-center text-graph-muted"
                    key={`d-${index}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <motion.div
                className="flex flex-1"
                initial={reduce ? false : "hidden"}
                variants={list}
                viewport={graphViewport}
                whileInView="show"
              >
                {weeks.map((week, weekIndex) => (
                  <motion.div
                    className={cn(
                      "flex min-w-[1ch] flex-1 flex-col",
                      !reduce && "will-change-[transform,opacity]"
                    )}
                    key={week[0]?.date ?? weekIndex}
                    variants={item}
                  >
                    {week.map((cell) => {
                      const level = cell.inRange
                        ? intensityLevel(cell.count, peak)
                        : 0

                      return (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "flex h-[1.15em] w-full items-center justify-center leading-none select-none",
                            cell.inRange
                              ? intensityClass(level, palette)
                              : "text-transparent"
                          )}
                          key={cell.date}
                        >
                          {cell.inRange ? intensityGlyph(level, set) : quiet}
                        </span>
                      )
                    })}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
        {caption === false && !legend ? null : (
          <div
            className={cn(
              "flex flex-wrap items-center gap-3",
              caption === false ? "justify-end" : "justify-between"
            )}
          >
            {caption === false ? null : (
              <p className="text-graph-muted tabular-nums">
                {caption ?? summary}
              </p>
            )}
            {legend ? <IntensityScale glyphs={set} palette={palette} /> : null}
          </div>
        )}
        <span className="sr-only">
          {total} contributions across {days.length} days
          {caption ? `. ${caption}` : ""}
        </span>
      </GraphBody>
    </Graph>
  )
}

export { GraphActivity }
export type { ActivityDay, GraphActivityProps }
