"use client"

import Link from "next/link"

import {
  GraphActivity,
  GraphBullet,
  GraphCalendar,
  GraphHeatmap,
  GraphKpi,
  GraphRank,
  GraphTimer,
  GraphUptime,
  GraphWaterfall,
} from "@/components/graphs"
import { AccentPicker } from "@/components/site/accent-picker"
import {
  FramePicker,
  SiteFrameProvider,
} from "@/components/site/display-controls"
import { SiteContainer } from "@/components/site/container"

function activityDays(start: string, length: number) {
  const [year, month, day] = start.split("-").map(Number)
  const origin = Date.UTC(year, (month ?? 1) - 1, day)
  return Array.from({ length }, (_, index) => {
    const time = origin + index * 86_400_000
    const date = new Date(time).toISOString().slice(0, 10)
    const dow = new Date(time).getUTCDay()
    const week = Math.floor(index / 7)
    let count = 0
    if (dow > 0 && dow < 6) {
      const pulse = (week + dow) % 9
      count =
        pulse === 0
          ? 12
          : pulse === 4
            ? 7
            : pulse % 3 === 0
              ? 3
              : index % 5 === 0
                ? 1
                : 0
    } else if (index % 13 === 0) {
      count = 2
    }
    return { date, count }
  })
}

const commits = activityDays("2025-09-01", 371)

const uptime = Array.from({ length: 90 }, (_, index) => {
  if (index === 41 || index === 42) {
    return "down" as const
  }
  if (index === 18 || index === 60 || index === 61) {
    return "degraded" as const
  }
  return "ok" as const
})

function HomeGraphDemos() {
  return (
    <section>
      <SiteContainer className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="max-w-[35ch] text-2xl font-semibold tracking-tight text-balance">
            pick a palette and a frame, copy the component
          </h2>
          <p className="max-w-[56ch] leading-relaxed text-pretty text-foreground/88">
            Every graph is drawn with text glyphs and takes its colors from your
            theme. Pick an accent and a frame below and the demos redraw, the
            same way the copied component will in your app.
          </p>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <AccentPicker />
          <FramePicker />
        </div>
        <SiteFrameProvider>
          <GraphActivity days={commits} palette="multi" title="COMMITS" />
          <div className="grid gap-8 lg:grid-cols-2">
            <GraphWaterfall
              items={[
                { label: "Revenue", value: 48 },
                { label: "Refunds", value: -6 },
                { label: "Hosting", value: -4 },
                { label: "Profit", value: 38 },
              ]}
              palette="duo"
              ticks={18}
              title="MARGIN"
            />
            <GraphBullet
              items={[
                { label: "CPU", value: 72, target: 80, max: 100 },
                { label: "RAM", value: 34, target: 64, max: 100 },
                { label: "SSD", value: 91, target: 90, max: 100 },
              ]}
              palette="duo"
              title="LOAD"
            />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <GraphCalendar
              marks={[12, 18]}
              month={8}
              palette="duo"
              today={27}
              year={2026}
            />
            <GraphUptime
              days={uptime}
              from="Jun 1"
              palette="duo"
              title="API"
              to="Aug 29"
            />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <GraphHeatmap
              columns={["0", "4", "8", "12", "16", "20"]}
              palette="multi"
              rows={[
                { label: "Mon", values: [0, 1, 4, 8, 6, 1] },
                { label: "Tue", values: [0, 0, 5, 9, 4, 2] },
                { label: "Wed", values: [1, 0, 6, 12, 5, 1] },
                { label: "Thu", values: [0, 2, 4, 7, 8, 3] },
                { label: "Fri", values: [0, 1, 3, 5, 2, 0] },
              ]}
              title="DEPLOYS"
            />
            <GraphRank
              items={[
                { label: "/docs", value: 12400 },
                { label: "/install", value: 4100 },
                { label: "/plot", value: 860 },
                { label: "/rank", value: 420 },
              ]}
              palette="duo"
              title="ROUTES"
            />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <GraphKpi
              data={[4, 5, 5, 6, 8, 7, 9, 8, 11, 10, 12, 14]}
              hint="+18%"
              label="this week"
              palette="duo"
              title="READS"
              value="12,400"
            />
            <GraphTimer
              at="2026-08-01T00:00:00Z"
              caption="api"
              kind="elapsed"
              palette="duo"
              title="UPTIME"
            />
          </div>
        </SiteFrameProvider>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/agents"
          >
            for agents
          </Link>
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/docs"
          >
            all components
          </Link>
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/docs/examples"
          >
            examples
          </Link>
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/llms.txt"
          >
            llms.txt
          </Link>
        </div>
      </SiteContainer>
    </section>
  )
}

export { HomeGraphDemos }
