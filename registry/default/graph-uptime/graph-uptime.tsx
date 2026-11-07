"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  Graph,
  GraphBody,
  GraphTick,
  GraphTrack,
  runs,
  sourceText,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  resolveGlyphs,
  staggerList,
  toneClass,
  type Glyphs,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type UptimeStatus = "ok" | "degraded" | "down" | "empty"

type GraphUptimeProps = {
  title?: string
  /** `["ok", "down"]`, `"ok ok down"`, or runs: `"ok*40 down*2"`. */
  days?: UptimeStatus[] | string
  from?: string
  to?: string
  columns?: number
  /** Markdown: the days as words. `ok*40 degraded ok*20 down*2 ok*27`. */
  children?: ReactNode
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

const STATUSES: Record<UptimeStatus, true> = {
  ok: true,
  degraded: true,
  down: true,
  empty: true,
}

function statusTone(
  palette: GraphPalette | undefined
): Record<UptimeStatus, string> {
  return {
    ok: toneClass(palette, "primary"),
    degraded: toneClass(palette, "secondary"),
    down: toneClass(palette, "empty"),
    empty: toneClass(palette, "empty"),
  }
}

function GraphUptime({
  title,
  days: daysProp,
  from,
  to,
  columns = 30,
  children,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphUptimeProps) {
  const days = runs(daysProp ?? sourceText(children)).filter(
    (day): day is UptimeStatus => day in STATUSES
  )
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.05)
  const known = days.filter((day) => day !== "empty")
  const ok = known.filter((day) => day === "ok").length
  const percent = known.length === 0 ? 0 : Math.round((ok / known.length) * 100)
  const cols = Math.max(1, columns)
  const rows: UptimeStatus[][] = []
  const set = resolveGlyphs(glyphs)
  const last = set.length - 1
  const mark: Record<UptimeStatus, string> = {
    ok: set[last] ?? "█",
    degraded: set[Math.min(2, last)] ?? "▒",
    down: set[0] ?? "·",
    empty: "-",
  }
  const tone = statusTone(palette)

  for (let index = 0; index < days.length; index += cols) {
    rows.push(days.slice(index, index + cols))
  }

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col items-center gap-4">
        <div className="flex scrollbar-graph w-fit max-w-full flex-col gap-4 overflow-x-auto overflow-y-hidden">
          <motion.div
            aria-hidden="true"
            className="flex flex-col gap-1 select-none"
            initial={reduce ? false : "hidden"}
            variants={list}
            viewport={graphViewport}
            whileInView="show"
          >
            {rows.map((row, rowIndex) => (
              <motion.div key={rowIndex} variants={item}>
                <GraphTrack className="w-auto justify-start gap-0.5">
                  {row.map((day, index) => (
                    <GraphTick
                      className={cn("flex-none", tone[day])}
                      key={`${rowIndex}-${index}`}
                    >
                      {mark[day]}
                    </GraphTick>
                  ))}
                </GraphTrack>
              </motion.div>
            ))}
          </motion.div>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className={cn("tabular-nums", tone.ok)}>{percent}%</p>
            {from || to ? (
              <p className="flex gap-3 text-graph-muted">
                {from ? <span>{from}</span> : null}
                {to ? <span>{to}</span> : null}
              </p>
            ) : null}
          </div>
        </div>
        <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-graph-muted">
          <span>
            <span className={tone.ok}>{mark.ok}</span> up
          </span>
          <span>
            <span className={tone.degraded}>{mark.degraded}</span> slow
          </span>
          <span>
            <span className={tone.down}>{mark.down}</span> down
          </span>
        </p>
        <span className="sr-only">
          {percent} percent uptime over {known.length} days
          {from && to ? `, ${from} to ${to}` : ""}
        </span>
      </GraphBody>
    </Graph>
  )
}

export { GraphUptime }
export type { GraphUptimeProps, UptimeStatus }
