"use client"

import type { ReactNode } from "react"
import Link from "next/link"

import { SectionHeading } from "@/components/docs/section-heading"
import { CopyButton } from "@/components/docs/copy-button"
import {
  GraphCompare,
  GraphDiff,
  GraphFlow,
  GraphGantt,
  GraphKpi,
  GraphMeter,
  GraphRank,
  GraphSlope,
  GraphStat,
  GraphTimeline,
  GraphUptime,
} from "@/components/graphs"
import { recipeCopy, recipes, type Recipe } from "@/lib/docs/recipes"
import { components } from "@/lib/docs/catalog"

const titles = Object.fromEntries(
  components.map((item) => [item.slug, item.title])
)

const incidentDays = [
  "ok",
  "ok",
  "ok",
  "ok",
  "ok",
  "degraded",
  "ok",
  "ok",
  "down",
  "down",
  "ok",
  "ok",
  "ok",
  "ok",
] as const

const previews: Record<string, ReactNode[]> = {
  refactor: [
    <GraphFlow
      key="flow"
      rows={[
        {
          nodes: [
            { label: "request" },
            { label: "handler" },
            { label: "session util", tone: "muted" },
          ],
        },
        {
          nodes: [
            { label: "request" },
            { label: "middleware", tone: "accent" },
            { label: "handler" },
          ],
        },
      ]}
      title="AUTH"
    />,
    <GraphTimeline
      key="plan"
      events={[
        { date: "w1", label: "extract session helper", state: "done" },
        { date: "w2", label: "move checks to middleware", state: "now" },
        { date: "w3", label: "delete the old util", state: "next" },
      ]}
      title="PLAN"
    />,
  ],
  incident: [
    <GraphTimeline
      key="incident"
      events={[
        { date: "14:02", label: "p95 crossed 800ms" },
        {
          date: "14:11",
          label: "rolled back the cache flag",
          state: "now",
        },
        { date: "14:40", label: "write the postmortem", state: "next" },
      ]}
      title="INCIDENT"
    />,
    <GraphUptime
      key="api"
      days={[...incidentDays]}
      from="Aug 14"
      title="API"
      to="Aug 27"
    />,
  ],
  pick: [
    <GraphCompare
      key="queue"
      accent="BullMQ"
      columns={["BullMQ", "SQS"]}
      rows={[
        { label: "in-process", values: [true, false] },
        { label: "retries", values: [true, true] },
        { label: "ops", values: ["redis", "aws"] },
        { label: "local", values: [true, false] },
      ]}
      title="QUEUE"
    />,
    <GraphRank
      key="install"
      items={[
        { label: "bullmq", value: 48, display: "48 kb" },
        { label: "ioredis", value: 31, display: "31 kb" },
        { label: "aws sdk", value: 120, display: "120 kb" },
      ]}
      title="INSTALL"
    />,
  ],
  review: [
    <GraphDiff
      key="files"
      palette="duo"
      rows={[
        { label: "auth.ts", value: "new", sign: "add" },
        { label: "session.ts", value: "moved" },
        { label: "legacy-auth.ts", value: "gone", sign: "remove" },
      ]}
      title="FILES"
    />,
    <GraphSlope
      key="coverage"
      fromLabel="main"
      items={[
        { label: "auth", from: 41, to: 88 },
        { label: "billing", from: 72, to: 74 },
        { label: "docs", from: 11, to: 40 },
      ]}
      title="COVERAGE"
      toLabel="this pr"
    />,
  ],
  sprint: [
    <GraphGantt
      key="week"
      columns={20}
      items={[
        { label: "rfc", start: 0, end: 0.4, complete: 1 },
        { label: "patch", start: 0.35, end: 0.8, complete: 0.55 },
        { label: "review", start: 0.7, end: 1, complete: 0 },
      ]}
      stage="patch"
      ticks={["mon", "wed", "fri"]}
      title="THIS WEEK"
    />,
    <GraphStat
      key="board"
      items={[
        { value: "4", label: "in review" },
        { value: "2", label: "blocked" },
        { value: "9", label: "shipped", accent: true },
      ]}
      title="BOARD"
    />,
  ],
  migrate: [
    <GraphMeter key="rows" caption="users table" title="ROWS" value={0.67} />,
    <GraphKpi
      key="migrated"
      data={[2, 3, 3, 5, 8, 9, 11, 12, 14, 16, 18, 21]}
      hint="67%"
      label="of 1.8M rows"
      title="MIGRATED"
      value="1.2M"
    />,
  ],
}

function RecipeFigures({
  recipe,
  showLinks = true,
}: {
  recipe: Recipe
  showLinks?: boolean
}) {
  const figures = previews[recipe.slug] ?? []

  return (
    <div className="flex flex-col gap-8">
      {recipe.graphs.map((graph, index) => {
        const name = titles[graph.slug] ?? graph.slug

        return (
          <figure
            className="flex flex-col gap-2"
            key={`${graph.slug}-${index}`}
          >
            {figures[index]}
            <figcaption className="font-mono text-sm text-graph-muted">
              {showLinks ? (
                <Link
                  className="text-foreground hover:underline"
                  href={`/docs/${graph.slug}`}
                >
                  {name}
                </Link>
              ) : (
                <span className="text-foreground">{name}</span>
              )}
              {" · "}
              {graph.label}
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <SectionHeading id={recipe.slug}>{recipe.title}</SectionHeading>
          <p className="max-w-[56ch] text-pretty text-muted-foreground">
            {recipe.story}
          </p>
        </div>
        <CopyButton
          caption="Copy MDX"
          label={`Copy ${recipe.title} MDX`}
          text={recipeCopy(recipe)}
        />
      </div>
      <RecipeFigures recipe={recipe} />
    </section>
  )
}

function RecipeList({ items = recipes }: { items?: Recipe[] }) {
  return (
    <div className="flex flex-col gap-16">
      {items.map((item) => (
        <RecipeCard key={item.slug} recipe={item} />
      ))}
    </div>
  )
}

export { RecipeFigures, RecipeList }
