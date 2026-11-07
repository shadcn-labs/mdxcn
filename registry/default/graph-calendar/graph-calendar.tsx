"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  Graph,
  GraphBody,
  GraphRule,
  hasHost,
  itemText,
  listItems,
  numbers,
  splitLabel,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  isMonoPalette,
  staggerList,
  toneClass,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

const WEEKDAYS_SUN = ["S", "M", "T", "W", "T", "F", "S"]
const WEEKDAYS_MON = ["M", "T", "W", "T", "F", "S", "S"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

type CalendarMark = {
  day: number
  accent?: boolean
  /** Listed under the month, next to the day. */
  label?: string
}

type GraphCalendarProps = {
  title?: string
  year: number
  month: number
  weekStartsOn?: 0 | 1
  /** `[12, 18]`, `"12 18"`, or `{ day, accent }` objects. */
  marks?: CalendarMark[] | number[] | string
  today?: number
  /** Markdown list: `- 12: launch`. Bold is today. Labels list under the month. */
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function monthLength(year: number, monthIndex: number) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
}

function leadingBlanks(year: number, monthIndex: number, weekStartsOn: 0 | 1) {
  const weekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay()
  return (weekday - weekStartsOn + 7) % 7
}

function marksOf(children: ReactNode) {
  return listItems(children).flatMap((item) => {
    const { label, rest } = splitLabel(itemText(item))
    const day = Number.parseInt(label, 10)
    if (!Number.isFinite(day)) {
      return []
    }
    const content = (item.props as { children?: ReactNode }).children
    return [
      {
        day,
        accent: true,
        label: rest || undefined,
        today: hasHost(content, ["strong", "b"]),
      },
    ]
  })
}

function markSet(marks?: CalendarMark[] | number[]) {
  const map = new Map<number, boolean>()

  if (!marks) {
    return map
  }

  for (const mark of marks) {
    if (typeof mark === "number") {
      map.set(mark, true)
      continue
    }

    map.set(mark.day, mark.accent ?? true)
  }

  return map
}

function GraphCalendar({
  title,
  year,
  month,
  weekStartsOn = 1,
  marks: marksProp,
  today: todayProp,
  children,
  palette,
  corner,
  frame,
  className,
}: GraphCalendarProps) {
  const listed = marksOf(children)
  const marks =
    typeof marksProp === "string"
      ? numbers(marksProp)
      : (marksProp ?? (listed.length > 0 ? listed : undefined))
  const today = todayProp ?? listed.find((mark) => mark.today)?.day
  const notes = (marks ?? [])
    .filter((mark): mark is CalendarMark => typeof mark !== "number")
    .filter((mark) => mark.label)
    .sort((a, b) => a.day - b.day)
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.04)
  const monthIndex = month - 1
  const days = monthLength(year, monthIndex)
  const pad = leadingBlanks(year, monthIndex, weekStartsOn)
  const highlighted = markSet(marks)
  const headers = weekStartsOn === 1 ? WEEKDAYS_MON : WEEKDAYS_SUN
  const trailing = (7 - ((pad + days) % 7)) % 7
  const caption = title ?? `${MONTHS[monthIndex]} ${year}`
  const grid: (number | null)[] = [
    ...Array.from({ length: pad }, () => null),
    ...Array.from({ length: days }, (_, index) => index + 1),
    ...Array.from({ length: trailing }, () => null),
  ]
  const weeks: (number | null)[][] = []

  for (let index = 0; index < grid.length; index += 7) {
    weeks.push(grid.slice(index, index + 7))
  }

  return (
    <Graph title={caption} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col gap-3">
        <div
          aria-hidden="true"
          className="grid grid-cols-7 justify-items-center"
        >
          {headers.map((header, index) => (
            <span
              className="w-[4ch] text-center text-graph-muted"
              key={`${header}-${index}`}
            >
              {header}
            </span>
          ))}
        </div>
        <motion.div
          aria-hidden="true"
          className="flex flex-col gap-1"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {weeks.map((week, weekIndex) => (
            <motion.div
              className="grid grid-cols-7 justify-items-center"
              key={weekIndex}
              variants={item}
            >
              {week.map((day, dayIndex) => {
                const inMonth = day != null
                const accent = inMonth && highlighted.get(day) === true
                const isToday = inMonth && today === day

                return (
                  <span
                    className={cn(
                      "w-[4ch] text-center tabular-nums",
                      !inMonth && "text-transparent",
                      inMonth && !accent && !isToday && "text-foreground",
                      accent && toneClass(palette, "primary"),
                      isToday &&
                        !accent &&
                        toneClass(
                          palette,
                          isMonoPalette(palette) ? "primary" : "secondary"
                        )
                    )}
                    key={`${weekIndex}-${dayIndex}`}
                  >
                    {inMonth ? (isToday ? `[${day}]` : day) : "\u00a0"}
                  </span>
                )
              })}
            </motion.div>
          ))}
        </motion.div>
        {notes.length > 0 ? (
          <>
            <GraphRule className="mt-2" />
            <motion.ul
              className="flex flex-col gap-2"
              initial={reduce ? false : "hidden"}
              role="list"
              variants={list}
              viewport={graphViewport}
              whileInView="show"
            >
              {notes.map((mark) => (
                <motion.li
                  className="grid grid-cols-[4ch_minmax(0,1fr)] items-baseline gap-x-3"
                  key={mark.day}
                  variants={item}
                >
                  <span
                    className={cn(
                      "text-right tabular-nums",
                      mark.accent === false
                        ? "text-foreground"
                        : toneClass(palette, "primary")
                    )}
                  >
                    {mark.day === today ? `[${mark.day}]` : mark.day}
                  </span>
                  <span className="text-foreground">{mark.label}</span>
                </motion.li>
              ))}
            </motion.ul>
          </>
        ) : null}
        <span className="sr-only">
          {MONTHS[monthIndex]} {year}
          {today ? `, today ${today}` : ""}
          {highlighted.size > 0
            ? `, marked ${[...highlighted.keys()].join(", ")}`
            : ""}
        </span>
      </GraphBody>
    </Graph>
  )
}

export { GraphCalendar }
export type { CalendarMark, GraphCalendarProps }
