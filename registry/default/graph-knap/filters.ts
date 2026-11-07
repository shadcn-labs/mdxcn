import { fence, reframeAscii } from "@/registry/default/graph-knap/frame"
import { drawMarkdown } from "@/registry/default/graph-knap/markdown"
import {
  asciiBars,
  asciiBoard,
  asciiBullet,
  asciiCells,
  asciiCheck,
  asciiCompare,
  asciiDiff,
  asciiFunnel,
  asciiGantt,
  asciiInvoice,
  asciiKpi,
  asciiMatrix,
  asciiMeter,
  asciiRank,
  asciiScore,
  asciiSheet,
  asciiSlope,
  asciiSpark,
  asciiSpec,
  asciiStack,
  asciiStat,
  asciiTable,
  asciiTimeline,
  asciiTree,
  asciiUptime,
  asciiWaffle,
  asciiWaterfall,
} from "@/registry/default/graph-knap/graphs"
import {
  filterName,
  resolveGraphProps,
  warnFilter,
  type GraphFilter,
  type GraphFilterContext,
} from "@/registry/default/graph-knap/props"
import { toComarkBlock } from "@/registry/default/graph-knap/yaml"

type Draw = (props: never) => string

/** Content blocks draw from their Markdown `body`, like the docs MDX tab. */
function fromBody(tag: string): Draw {
  return ((props: Record<string, unknown>) => {
    const attrs: Record<string, string> = {}
    for (const [key, value] of Object.entries(props)) {
      if (key === "body" || value == null) continue
      attrs[key] = typeof value === "string" ? value : String(value)
    }
    const body = typeof props.body === "string" ? props.body : ""
    return drawMarkdown(tag, attrs, body)
  }) as Draw
}

const ASCII: Record<string, Draw> = {
  callout: fromBody("Callout"),
  quote: fromBody("Quote"),
  steps: fromBody("Steps"),
  terminal: fromBody("Terminal"),
  changelog: fromBody("Changelog"),
  annotate: fromBody("Annotate"),
  decision: fromBody("Decision"),
  chat: fromBody("Chat"),
  env: fromBody("Env"),
  endpoint: fromBody("Endpoint"),
  keys: fromBody("Keys"),
  faq: fromBody("Faq"),
  "graph-board": asciiBoard as Draw,
  "graph-score": asciiScore as Draw,
  "graph-table": asciiTable as Draw,
  "graph-sheet": asciiSheet as Draw,
  "graph-bars": asciiBars as Draw,
  "graph-rank": asciiRank as Draw,
  "graph-cells": asciiCells as Draw,
  "graph-meter": asciiMeter as Draw,
  "graph-spark": asciiSpark as Draw,
  "graph-tree": asciiTree as Draw,
  "graph-timeline": asciiTimeline as Draw,
  "graph-check": asciiCheck as Draw,
  "graph-stack": asciiStack as Draw,
  "graph-funnel": asciiFunnel as Draw,
  "graph-gantt": asciiGantt as Draw,
  "graph-waffle": asciiWaffle as Draw,
  "graph-diff": asciiDiff as Draw,
  "graph-invoice": asciiInvoice as Draw,
  "graph-compare": asciiCompare as Draw,
  "graph-matrix": asciiMatrix as Draw,
  "graph-stat": asciiStat as Draw,
  "graph-kpi": asciiKpi as Draw,
  "graph-spec": asciiSpec as Draw,
  "graph-waterfall": asciiWaterfall as Draw,
  "graph-uptime": asciiUptime as Draw,
  "graph-slope": asciiSlope as Draw,
  "graph-bullet": asciiBullet as Draw,
}

export const GRAPH_FILTER_SLUGS = [
  "callout",
  "quote",
  "steps",
  "terminal",
  "changelog",
  "annotate",
  "decision",
  "chat",
  "env",
  "endpoint",
  "keys",
  "faq",
  "graph-table",
  "graph-sheet",
  "graph-invoice",
  "graph-spec",
  "graph-matrix",
  "graph-compare",
  "graph-diff",
  "graph-stat",
  "graph-kpi",
  "graph-spark",
  "graph-plot",
  "graph-bars",
  "graph-slope",
  "graph-cells",
  "graph-meter",
  "graph-waffle",
  "graph-stack",
  "graph-funnel",
  "graph-waterfall",
  "graph-rank",
  "graph-bullet",
  "graph-heatmap",
  "graph-activity",
  "graph-calendar",
  "graph-uptime",
  "graph-flow",
  "graph-tree",
  "graph-timeline",
  "graph-gantt",
  "graph-check",
  "graph-board",
  "graph-score",
  "graph-timer",
  "graph-countdown",
] as const

export type GraphFilterSlug = (typeof GRAPH_FILTER_SLUGS)[number]

function applyGraphFilter(
  slug: GraphFilterSlug,
  value: string,
  param: string | undefined,
  context?: GraphFilterContext
) {
  const resolved = resolveGraphProps(slug, value, param, context)
  if (!resolved) {
    warnFilter(
      context,
      `Could not read ${filterName(slug)} data`,
      "INVALID_FILTER_INPUT"
    )
    return value
  }

  const ascii = ASCII[slug]
  const useComark = resolved.format === "comark" || !ascii

  if (useComark) {
    return toComarkBlock(slug, resolved.props)
  }

  try {
    return fence(
      reframeAscii(ascii!(resolved.props as never), resolved.props.frame)
    )
  } catch {
    warnFilter(context, `Could not draw ${filterName(slug)}`)
    return value
  }
}

function makeFilter(slug: GraphFilterSlug): GraphFilter {
  const name = filterName(slug)
  const filter: GraphFilter = (value, param, context) =>
    applyGraphFilter(slug, value, param, context)
  filter.metadata = {
    example: ASCII[slug] ? `${name}:"TITLE"` : `${name}:"comark"`,
  }
  return filter
}

export const graphFilters = {
  graph_callout: makeFilter("callout"),
  graph_quote: makeFilter("quote"),
  graph_steps: makeFilter("steps"),
  graph_terminal: makeFilter("terminal"),
  graph_changelog: makeFilter("changelog"),
  graph_annotate: makeFilter("annotate"),
  graph_decision: makeFilter("decision"),
  graph_chat: makeFilter("chat"),
  graph_env: makeFilter("env"),
  graph_endpoint: makeFilter("endpoint"),
  graph_keys: makeFilter("keys"),
  graph_faq: makeFilter("faq"),
  graph_table: makeFilter("graph-table"),
  graph_sheet: makeFilter("graph-sheet"),
  graph_invoice: makeFilter("graph-invoice"),
  graph_spec: makeFilter("graph-spec"),
  graph_matrix: makeFilter("graph-matrix"),
  graph_compare: makeFilter("graph-compare"),
  graph_diff: makeFilter("graph-diff"),
  graph_stat: makeFilter("graph-stat"),
  graph_kpi: makeFilter("graph-kpi"),
  graph_spark: makeFilter("graph-spark"),
  graph_plot: makeFilter("graph-plot"),
  graph_bars: makeFilter("graph-bars"),
  graph_slope: makeFilter("graph-slope"),
  graph_cells: makeFilter("graph-cells"),
  graph_meter: makeFilter("graph-meter"),
  graph_waffle: makeFilter("graph-waffle"),
  graph_stack: makeFilter("graph-stack"),
  graph_funnel: makeFilter("graph-funnel"),
  graph_waterfall: makeFilter("graph-waterfall"),
  graph_rank: makeFilter("graph-rank"),
  graph_bullet: makeFilter("graph-bullet"),
  graph_heatmap: makeFilter("graph-heatmap"),
  graph_activity: makeFilter("graph-activity"),
  graph_calendar: makeFilter("graph-calendar"),
  graph_uptime: makeFilter("graph-uptime"),
  graph_flow: makeFilter("graph-flow"),
  graph_tree: makeFilter("graph-tree"),
  graph_timeline: makeFilter("graph-timeline"),
  graph_gantt: makeFilter("graph-gantt"),
  graph_check: makeFilter("graph-check"),
  graph_board: makeFilter("graph-board"),
  graph_score: makeFilter("graph-score"),
  graph_timer: makeFilter("graph-timer"),
  graph_countdown: makeFilter("graph-countdown"),
} as const

export type GraphFilterName = keyof typeof graphFilters

export const graphFilterNames = Object.keys(graphFilters) as GraphFilterName[]

export const graphFilterMetadata = Object.fromEntries(
  Object.entries(graphFilters).map(([name, filter]) => [
    name,
    filter.metadata ?? { example: name },
  ])
)

export function createGraphFilters(names: readonly GraphFilterName[]) {
  const out: Record<string, GraphFilter> = {}
  for (const name of names) {
    const filter = graphFilters[name]
    if (filter) out[name] = filter
  }
  return out
}
