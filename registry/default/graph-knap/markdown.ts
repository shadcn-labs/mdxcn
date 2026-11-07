import { reframeAscii } from "@/registry/default/graph-knap/frame"
import {
  asciiAnnotate,
  asciiBars,
  asciiBoard,
  asciiBullet,
  asciiCallout,
  asciiCells,
  asciiChangelog,
  asciiChat,
  asciiCheck,
  asciiCompare,
  asciiDecision,
  asciiDiff,
  asciiEndpoint,
  asciiEnv,
  asciiFaq,
  asciiFlow,
  asciiFunnel,
  asciiGantt,
  asciiInvoice,
  asciiKeys,
  asciiKpi,
  asciiMatrix,
  asciiMeter,
  asciiQuote,
  asciiRank,
  asciiScore,
  asciiSheet,
  asciiSlope,
  asciiSpark,
  asciiSpec,
  asciiStack,
  asciiStat,
  asciiSteps,
  asciiTable,
  asciiTerminal,
  asciiTimeline,
  asciiTree,
  asciiUptime,
  asciiWaffle,
  asciiWaterfall,
} from "@/registry/default/graph-knap/graphs"

/*
 * Markdown children → the official ASCII figure. The same grammar the React
 * components read, parsed from a string: `**bold**` is now, `*italic*` is
 * next, `label: value`, `— note`, `a → b`, `- [x]`, `### section`, tables,
 * fences, and `x*n` runs. Used by the docs MDX tab and by Knap filters that
 * receive a Markdown `body`.
 */

function unwrapFence(body: string) {
  return body
    .trim()
    .replace(/^```(?:\w*)\n?/, "")
    .replace(/\n?```$/, "")
    .trim()
}

/**
 * Bold anywhere is now, italic anywhere is next — same as the React side,
 * which looks for `<strong>` / `<em>` inside the item. Paired marks come out
 * of the text. A lone `*` (a run like `0*5`) stays.
 */
function marks(text: string) {
  const trimmed = text.trim()
  const strong = /(\*\*|__)(?=\S)[\s\S]*?\S\1/.test(trimmed)
  const em =
    !strong && /(^|[^\w*])([*_])(?=\S)[^*_]*?\S\2(?![\w*])/.test(trimmed)
  return {
    text: trimmed
      .replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, "$2")
      .replace(/(^|[^\w*])([*_])(?=\S)([^*_]*?\S)\2(?![\w*])/g, "$1$3")
      .trim(),
    strong,
    em,
  }
}

type Bullet = {
  indent: number
  text: string
  strong: boolean
  em: boolean
}

function bullets(body: string): Bullet[] {
  const items: Bullet[] = []

  for (const line of body.split("\n")) {
    const match = line.match(/^(\s*)[-*]\s+(.*)$/)
    if (!match) {
      continue
    }
    items.push({ indent: (match[1] ?? "").length, ...marks(match[2] ?? "") })
  }

  return items
}

function nest(items: Bullet[]) {
  type Node = {
    label: string
    meta?: string
    accent?: boolean
    children?: Node[]
  }

  const root: Node[] = []
  const stack: { indent: number; children: Node[] }[] = [
    { indent: -1, children: root },
  ]

  for (const item of items) {
    while (stack.length > 1 && item.indent <= (stack.at(-1)?.indent ?? 0)) {
      stack.pop()
    }
    const [label, meta] = item.text.split(/\s+[—–]\s+/)
    const node: Node = {
      label: label || item.text,
      meta,
      accent: item.strong,
      children: [],
    }
    stack.at(-1)?.children.push(node)
    stack.push({ indent: item.indent, children: node.children ?? [] })
  }

  const clean = (nodes: Node[]): Node[] =>
    nodes.map((node) => ({
      ...node,
      children:
        node.children && node.children.length > 0
          ? clean(node.children)
          : undefined,
    }))

  return clean(root)
}

function splitLabel(text: string) {
  const match = text.match(/^(.+?):\s+(.+)$/)
  if (!match) {
    return { label: text, rest: "" }
  }
  return { label: (match[1] ?? text).trim(), rest: (match[2] ?? "").trim() }
}

function firstToken(text: string) {
  const match = text.match(/^(\S+)\s*(.*)$/)
  return { token: match?.[1] ?? text, rest: match?.[2] ?? "" }
}

/** `ok*40` → forty `ok`s. `×` works too. */
function runs(value: string | undefined): string[] {
  return (value ?? "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .flatMap((token) => {
      const match = token.match(/^(.+?)[*×](\d{1,4})$/)
      return match
        ? Array.from(
            { length: Math.min(5000, Number(match[2])) },
            () => match[1] ?? token
          )
        : [token]
    })
}

function numbers(value: string | undefined) {
  return runs(value)
    .map(Number)
    .filter((entry) => Number.isFinite(entry))
}

/** Inline Markdown out: `**a**`, `*a*`, `` `a` ``, `[a](url)` → `a`. */
function plain(text: string) {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|~~|`)/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function splitDash(text: string) {
  const parts = text.split(/\s+[—–]\s+/)
  return {
    label: (parts[0] ?? text).trim(),
    rest: parts.slice(1).join(" — ").trim(),
  }
}

type ListBlock = Bullet & {
  ordered: boolean
  /** Indented lines under the item: its body paragraphs. */
  body: string[]
}

/** List items with their indented body lines. A flush line ends the list. */
function listBlocks(body: string): ListBlock[] {
  const out: ListBlock[] = []
  let open = false

  for (const line of body.split("\n")) {
    const match = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/)
    if (match) {
      out.push({
        indent: (match[1] ?? "").length,
        ordered: /\d/.test(match[2] ?? ""),
        body: [],
        ...marks(match[3] ?? ""),
      })
      open = true
      continue
    }
    if (!line.trim()) {
      continue
    }
    if (/^\s+/.test(line) && open) {
      out.at(-1)?.body.push(line.trim())
      continue
    }
    open = false
  }

  return out
}

/** Paragraph text that is not a list, heading, table, or fence. */
function paragraphs(body: string): string[] {
  return body
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(
      (block) =>
        block &&
        !/^([-*+]|\d+[.)])\s/.test(block) &&
        !block.startsWith("#") &&
        !block.startsWith("|")
    )
    .map((block) => plain(block))
}

function fences(body: string) {
  return [...body.matchAll(/```([\w-]*)[^\n]*\n([\s\S]*?)\n?```/g)].map(
    (match) => ({ language: match[1] || undefined, code: match[2] ?? "" })
  )
}

function sections(body: string) {
  const out: { title: string; lines: string[] }[] = []
  for (const line of body.split("\n")) {
    const heading = line.match(/^#{1,6}\s+(.*)$/)
    if (heading) {
      out.push({ title: heading[1] ?? "", lines: [] })
      continue
    }
    out.at(-1)?.lines.push(line)
  }
  return out
}

/** `KEY=value` with the comments above it. */
function envVars(source: string) {
  const vars: {
    name: string
    value?: string
    note?: string
    required?: boolean
  }[] = []
  let notes: string[] = []
  const required = /\(?\brequired\b\)?[.:]?/i

  for (const raw of source.split("\n")) {
    const line = raw.trim()
    if (!line) {
      notes = []
      continue
    }
    if (line.startsWith("#")) {
      notes.push(line.replace(/^#+\s*/, ""))
      continue
    }
    const match = line.match(/^(?:export\s+)?([A-Za-z_][\w.]*)\s*=\s*(.*)$/)
    if (!match) {
      continue
    }
    const [value = "", inline = ""] = (match[2] ?? "").split(/\s+#\s*/)
    const all = [...notes, inline].filter(Boolean)
    vars.push({
      name: match[1] ?? "",
      value: value.trim().replace(/^(['"])([\s\S]*)\1$/, "$2"),
      note:
        all
          .map((note) => note.replace(required, "").replace(/\s+/g, " ").trim())
          .filter(Boolean)
          .join(" ") || undefined,
      required: all.some((note) => required.test(note)),
    })
    notes = []
  }

  return vars
}

function fraction(value: string | undefined, fallback = 0) {
  if (!value) {
    return fallback
  }
  const text = value.trim()
  const percent = text.endsWith("%")
  const parsed = Number.parseFloat(text)
  if (!Number.isFinite(parsed)) {
    return fallback
  }
  return percent ? parsed / 100 : parsed
}

function isSeparator(line: string) {
  return /^\s*\|[\s:|-]+\|\s*$/.test(line)
}

function splitRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim())
}

function parseGfm(body: string) {
  const rows = body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
  if (rows.length < 2) {
    return null
  }

  const sep = rows.find(isSeparator)
  const data = rows.filter((row) => !isSeparator(row)).map(splitRow)
  const headers = data[0]
  if (!headers) {
    return null
  }

  const align = sep
    ? splitRow(sep).map((cell) =>
        cell.endsWith(":") && !cell.startsWith(":") ? "right" : "left"
      )
    : undefined
  const rest = data.slice(1)
  const last = rest.at(-1)
  const footer =
    last &&
    rest.length > 1 &&
    (/^total$/i.test(last[0] ?? "") || /^\*\*.+\*\*$/.test(last[0] ?? ""))
      ? rest.pop()?.map((cell) => cell.replace(/^\*\*(.+)\*\*$/, "$1"))
      : undefined

  return { headers, rows: rest, footer, align }
}

function parseLabeled(body: string) {
  const table = parseGfm(body)
  if (!table || table.headers.length < 2) {
    return null
  }
  const labeled =
    table.headers[0] === "" ||
    table.headers[0] === "—" ||
    table.headers[0] === "-"
  const columns = labeled ? table.headers.slice(1) : table.headers
  const rows = table.rows.map((row) => ({
    label: labeled ? (row[0] ?? "") : (row[0] ?? ""),
    values: labeled ? row.slice(1) : row.slice(1),
  }))
  if (!labeled) {
    return {
      columns: table.headers,
      rows: table.rows.map((row) => ({
        label: row[0] ?? "",
        values: row.slice(1),
      })),
    }
  }
  return { columns, rows }
}

function parseOrdered(body: string) {
  const chunks = body.trim().split(/\n(?=\s*\d+\.\s+)/)
  return chunks.flatMap((chunk) => {
    const match = chunk.match(/^\s*\d+\.\s+([\s\S]*)$/)
    if (!match) {
      return []
    }
    const lines = (match[1] ?? "").split("\n")
    const head = marks((lines[0] ?? "").trim())
    const rest = lines
      .slice(1)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ")
    return [{ title: head.text, body: rest || undefined }]
  })
}

function compareCell(value: string) {
  const key = value.trim().toLowerCase()
  if (key === "yes" || key === "true") {
    return true
  }
  if (key === "no" || key === "false") {
    return false
  }
  return value
}

/** `2 3 5 8 — caption`, or `- Mon: 4` rows. */
function series(body: string) {
  const listed = bullets(body)
  if (listed.length > 0) {
    return {
      data: listed
        .map((item) => {
          const { label, rest } = splitLabel(plain(item.text))
          return Number.parseFloat((rest || label).replace(/,/g, ""))
        })
        .filter((value) => Number.isFinite(value)),
      caption: undefined,
    }
  }
  const { label, rest } = splitDash(body.replace(/\s+/g, " ").trim())
  return { data: numbers(label), caption: rest || undefined }
}

type CheckNode = {
  label: string
  done: boolean
  note?: string
  items?: CheckNode[]
}

function checkTree(body: string): CheckNode[] {
  const root: CheckNode[] = []
  const stack: { indent: number; items: CheckNode[] }[] = [
    { indent: -1, items: root },
  ]

  for (const item of bullets(body)) {
    while (stack.length > 1 && item.indent <= (stack.at(-1)?.indent ?? 0)) {
      stack.pop()
    }
    const done = /^\[[xX]\]/.test(item.text)
    const rest = item.text.replace(/^\[[ xX]\]\s*/, "")
    const { label, rest: note } = splitDash(rest)
    const node: CheckNode = {
      label: label || rest,
      done,
      note: note || undefined,
      items: [],
    }
    stack.at(-1)?.items.push(node)
    stack.push({ indent: item.indent, items: node.items ?? [] })
  }

  const clean = (nodes: CheckNode[]): CheckNode[] =>
    nodes.map((node) => ({
      ...node,
      items: node.items?.length ? clean(node.items) : undefined,
    }))
  return clean(root)
}

function drawMarkdown(
  name: string,
  props: Record<string, string>,
  body: string,
  title: string | undefined = props.title
) {
  return reframeAscii(drawBoxed(name, props, body, title), props.frame)
}

function drawBoxed(
  name: string,
  props: Record<string, string>,
  body: string,
  title: string | undefined
) {
  switch (name) {
    case "Callout":
      return asciiCallout({
        type: props.type,
        title: title ?? props.type,
        body,
      })
    case "Quote":
      return asciiQuote({
        title,
        by: props.by,
        source: props.source,
        body,
      })
    case "Steps":
      return asciiSteps({ title, steps: parseOrdered(body) })
    case "Terminal":
      return asciiTerminal({
        title: title ?? "SHELL",
        lines: unwrapFence(body).split("\n"),
      })
    case "Changelog": {
      const items = bullets(body).map((item) => {
        const { label, rest } = splitLabel(item.text)
        const type =
          label === "added"
            ? "add"
            : label === "changed"
              ? "change"
              : label === "fixed"
                ? "fix"
                : label === "removed"
                  ? "remove"
                  : "change"
        return { type, text: rest || item.text }
      })
      return asciiChangelog({
        title,
        version: props.version,
        date: props.date,
        items,
      })
    }
    case "GraphTable": {
      const table = parseGfm(body)
      return asciiTable({
        title: title ?? "",
        headers: table?.headers ?? [],
        rows: table?.rows ?? [],
        footer: table?.footer,
        align: table?.align as ("left" | "right")[] | undefined,
      })
    }
    case "GraphSheet": {
      const sections: { title: string; rows: string[][] }[] = []
      let current: { title: string; rows: string[][] } | null = null
      let headers: string[] = []
      for (const line of body.split("\n")) {
        const heading = line.match(/^#{1,6}\s+(.*)$/)
        if (heading) {
          current = { title: heading[1] ?? "", rows: [] }
          sections.push(current)
          continue
        }
        if (!line.trim().startsWith("|") || isSeparator(line)) {
          continue
        }
        const cells = splitRow(line)
        if (!current) {
          continue
        }
        if (headers.length === 0) {
          headers = cells
          continue
        }
        if (cells[0] && cells[0] === headers[0]) {
          continue
        }
        current.rows.push(cells)
      }
      return asciiSheet({
        title: title ?? "",
        headers: headers.length > 0 ? headers : ["Item"],
        sections,
      })
    }
    case "GraphTree":
      return asciiTree({
        title: title ?? "",
        nodes: nest(bullets(body)),
      })
    case "GraphTimeline":
      return asciiTimeline({
        title: title ?? "",
        events: listBlocks(body).map((item) => {
          const { label, rest } = splitLabel(item.text)
          const { label: what, rest: aside } = splitDash(rest || label)
          return {
            date: rest ? label : item.text,
            label: what,
            note:
              item.body.length > 0
                ? plain(item.body.join(" "))
                : aside || undefined,
            state: item.strong ? "now" : item.em ? "next" : "done",
          }
        }),
      })
    case "GraphCheck":
      return asciiCheck({
        title: title ?? "",
        items: checkTree(body),
      })
    case "GraphFlow":
      return asciiFlow({
        title: title ?? "",
        rows: body
          .split(/\n+/)
          .map((line) => line.replace(/\*+/g, "").trim())
          .filter(Boolean),
      })
    case "GraphBars": {
      const series = bullets(body).map((item) => {
        const { label, rest } = splitLabel(item.text)
        return {
          label: rest ? label : item.text,
          values: numbers(rest),
          size: (item.strong ? "lg" : "sm") as "sm" | "lg",
        }
      })
      return asciiBars({
        title: title ?? "",
        from: series[0] ?? { label: "from", values: [] },
        to: series[1] ?? { label: "to", values: [] },
        processor: props.processor,
      })
    }
    case "GraphRank":
      return asciiRank({
        title: title ?? "",
        items: bullets(body).map((item) => {
          const { token, rest } = firstToken(item.text)
          return {
            label: rest || token,
            value: Number.parseFloat(token.replace(/,/g, "")) || 0,
          }
        }),
        max: props.max ? Number(props.max) : undefined,
      })
    case "GraphCells":
      return asciiCells({
        title: title ?? "",
        items: bullets(body).map((item) => {
          const { label, rest } = splitLabel(item.text)
          const cells = (rest || item.text).split("/").map((row) =>
            row
              .trim()
              .split(/\s+/)
              .map((cell) => Number.parseInt(cell, 10) || 0)
          )
          return { label: rest ? label : item.text, cells }
        }),
      })
    case "GraphMeter": {
      const written = firstToken(plain(body))
      return asciiMeter({
        title: title ?? "",
        value: fraction(props.value ?? written.token),
        ticks: props.ticks ? Number(props.ticks) : 14,
        caption:
          props.caption ??
          (props.value
            ? undefined
            : written.rest.replace(/^[—–-]\s*/, "") || undefined),
      })
    }
    case "GraphSpark": {
      const written = series(body)
      return asciiSpark({
        title: title ?? "",
        data: props.data ? numbers(props.data) : written.data,
        caption: props.caption ?? written.caption,
      })
    }
    case "GraphStack":
      return asciiStack({
        title: title ?? "",
        rows: bullets(body).map((item) => {
          const { label, rest } = splitLabel(item.text)
          const segs = (rest || item.text)
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part) => {
              const { token, rest: name } = firstToken(part)
              return {
                label: name || token,
                value: Number.parseFloat(token.replace(/,/g, "")) || 0,
              }
            })
          return { label: rest ? label : item.text, segments: segs }
        }),
        ticks: props.ticks ? Number(props.ticks) : undefined,
      })
    case "GraphFunnel":
      return asciiFunnel({
        title: title ?? "",
        steps: bullets(body).map((item) => {
          const { token, rest } = firstToken(item.text)
          return {
            value: Number.parseFloat(token.replace(/,/g, "")) || 0,
            label: rest || token,
          }
        }),
      })
    case "GraphGantt":
      return asciiGantt({
        title: title ?? "",
        columns: props.columns ? Number(props.columns) : 24,
        ticks: props.ticks ? props.ticks.split(/\s+/) : undefined,
        items: bullets(body).map((item) => {
          const { label, rest } = splitLabel(item.text)
          const nums = (rest || item.text).match(/[\d.]+/g) ?? []
          return {
            label: rest ? label : item.text.replace(/[\d.]+/g, "").trim(),
            start: Number(nums[0] ?? 0),
            end: Number(nums[1] ?? nums[0] ?? 0),
            complete: nums[2] != null ? Number(nums[2]) : undefined,
          }
        }),
      })
    case "GraphDiff":
      return asciiDiff({
        title: title ?? "",
        rows: bullets(body).flatMap((item) => {
          const strike = item.text.match(/^(.*?)~~(.+?)~~(.*)$/)
          if (strike) {
            const before = plain(strike[1] ?? "")
            const join = (text: string) => plain(`${before} ${text}`)
            return [
              {
                label: join(strike[2] ?? ""),
                value: "",
                sign: "remove" as const,
              },
              ...(plain(strike[3] ?? "")
                ? [
                    {
                      label: join(strike[3] ?? ""),
                      value: "",
                      sign: "add" as const,
                    },
                  ]
                : []),
            ]
          }
          const { label, rest } = splitLabel(item.text)
          const sign: "add" | "remove" | undefined = /^\+/.test(rest)
            ? "add"
            : /^[−\-]/.test(rest)
              ? "remove"
              : undefined
          return [
            {
              label: rest ? label : item.text,
              value: rest.replace(/^[+\-−]\s*/, "") || rest,
              sign,
            },
          ]
        }),
      })
    case "GraphInvoice": {
      const table = parseGfm(body)
      const meta = bullets(body)
        .map((item) => splitLabel(item.text))
        .filter((item) => item.rest)
        .map((item) => ({ label: item.label, value: item.rest }))
      const totals = body.split("\n").flatMap((line) => {
        const match = line
          .trim()
          .match(/^\*\*(.+?)\*\*\s+([\d,]+(?:\.\d+)?)\s*$/)
        if (!match) {
          return []
        }
        return [{ label: match[1] ?? "", value: match[2] ?? "" }]
      })
      const note = body
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .find(
          (block) =>
            block &&
            !block.startsWith("|") &&
            !block.startsWith("-") &&
            !block.startsWith("**")
        )
      const headers = table?.headers.map((header) => header.toLowerCase()) ?? []
      const qtyAt = headers.findIndex((header) => /qty|quantity/.test(header))
      const rateAt = headers.findIndex((header) => /rate|price/.test(header))
      const amountAt = headers.findIndex((header) =>
        /amount|total|sum/.test(header)
      )
      return asciiInvoice({
        title: title ?? "",
        from: props.from ? { name: props.from } : undefined,
        to: props.to ? { name: props.to } : undefined,
        meta,
        items: (table?.rows ?? []).map((row) => {
          const last = row.length - 1
          return {
            description: row[0] ?? "",
            qty: qtyAt >= 0 ? row[qtyAt] : row.length >= 4 ? row[1] : undefined,
            rate:
              rateAt >= 0 ? row[rateAt] : row.length >= 4 ? row[2] : undefined,
            amount: row[amountAt >= 0 ? amountAt : last] ?? "",
          }
        }),
        totals,
        note,
      })
    }
    case "GraphCompare": {
      const labeled = parseLabeled(body)
      return asciiCompare({
        title: title ?? "",
        columns: labeled?.columns ?? props.columns?.split(/\s+/) ?? [],
        rows: (labeled?.rows ?? []).map((row) => ({
          label: row.label,
          values: row.values.map(compareCell),
        })),
      })
    }
    case "GraphMatrix":
    case "GraphHeatmap": {
      const labeled = parseLabeled(body)
      return asciiMatrix({
        title: title ?? name.replace("Graph", "").toUpperCase(),
        columns: labeled?.columns ?? [],
        rows: (labeled?.rows ?? []).map((row) => ({
          label: row.label,
          values: row.values.map((value) => {
            const parsed = Number(value)
            return Number.isFinite(parsed) ? parsed : value
          }),
        })),
      })
    }
    case "GraphStat":
      return asciiStat({
        title: title ?? "",
        items: bullets(body).map((item) => {
          const { token, rest } = firstToken(item.text)
          const [label, hint] = rest.split(/\s+[—–]\s+/)
          return { value: token, label: label || rest, hint }
        }),
      })
    case "GraphKpi": {
      const [head = "", ...tail] = body
        .split("\n")
        .map((line) => plain(line))
        .filter(Boolean)
      const { token, rest } = firstToken(head)
      const written = splitDash(rest)
      return asciiKpi({
        title: title ?? "",
        value: props.value ?? token,
        label: props.label ?? written.label,
        hint: props.hint ?? (written.rest || undefined),
        data: numbers(props.data ?? tail.join(" ")),
      })
    }
    case "GraphSpec":
      return asciiSpec({
        title: title ?? "",
        rows: listBlocks(body).map((item) => {
          const { label, rest } = splitLabel(plain(item.text))
          return {
            label: rest ? label : item.text,
            value: rest,
            note: item.body.length > 0 ? plain(item.body.join(" ")) : undefined,
          }
        }),
      })
    case "GraphWaterfall":
      return asciiWaterfall({
        title: title ?? "",
        items: bullets(body).map((item) => {
          const { label, rest } = splitLabel(item.text)
          return {
            label: rest ? label : item.text.replace(/[+\-−\d.,]+/g, "").trim(),
            value:
              Number.parseFloat((rest || item.text).replace(/[^\d.+-]/g, "")) ||
              0,
          }
        }),
      })
    case "GraphUptime":
      return asciiUptime({
        title: title ?? "",
        from: props.from,
        to: props.to,
        days: runs(props.days ?? body.replace(/\\\*/g, "*")).filter(
          (day): day is "ok" | "degraded" | "down" | "empty" =>
            ["ok", "degraded", "down", "empty"].includes(day)
        ),
      })
    case "GraphSlope":
      return asciiSlope({
        title: title ?? "",
        fromLabel: props.fromLabel ?? "",
        toLabel: props.toLabel ?? "",
        items: bullets(body).map((item) => {
          const { label, rest } = splitLabel(item.text)
          const [from, to] = rest.split(/\s*(?:→|->)\s*/)
          return {
            label: rest ? label : item.text,
            from: Number(from) || 0,
            to: Number(to) || 0,
          }
        }),
      })
    case "GraphBullet":
      return asciiBullet({
        title: title ?? "",
        items: bullets(body).map((item) => {
          const { label, rest } = splitLabel(item.text)
          const nums = (rest || item.text).match(/[\d.]+/g) ?? []
          return {
            label: rest ? label : item.text,
            value: Number(nums[0] ?? 0),
            target: nums[1] != null ? Number(nums[1]) : undefined,
            max: nums[2] != null ? Number(nums[2]) : undefined,
          }
        }),
      })
    case "GraphWaffle": {
      const written = firstToken(plain(body))
      return asciiWaffle({
        title: title ?? "",
        value: fraction(props.value ?? written.token),
        caption:
          props.caption ??
          (props.value
            ? undefined
            : written.rest.replace(/^[—–-]\s*/, "") || undefined),
      })
    }
    case "GraphPlot": {
      const written = series(body)
      return asciiSpark({
        title: title ?? "",
        data: props.data ? numbers(props.data) : written.data,
        caption: props.caption ?? written.caption,
      })
    }
    case "GraphBoard":
      return asciiBoard({
        title: title ?? "",
        columns: sections(body).map((section) => ({
          title: plain(section.title),
          items: bullets(section.lines.join("\n")).map((item) => {
            const { label, rest } = splitDash(plain(item.text))
            return {
              label,
              note: rest || undefined,
              state: item.strong ? "now" : item.em ? "next" : "done",
            }
          }),
        })),
      })
    case "Annotate": {
      const fence = fences(body)[0]
      const marker =
        /\s*(?:\/\/|#|--|;|%|\/\*|<!--|\{\/\*)\s*\((\d{1,2})\)\s*(?:\*\/\}|\*\/|-->)?\s*$/
      const outside = body.replace(/```[\s\S]*?```/g, "")
      return asciiAnnotate({
        title: title ?? fence?.language ?? "code",
        lines: (fence?.code ?? "").split("\n").map((line) => {
          const match = line.match(marker)
          return match && match.index != null
            ? { text: line.slice(0, match.index), mark: Number(match[1]) }
            : { text: line }
        }),
        notes: listBlocks(outside)
          .filter((item) => item.indent === 0)
          .map((item) => plain([item.text, ...item.body].join(" "))),
      })
    }
    case "Decision":
      return asciiDecision({
        title: title ?? "decision",
        status: props.status,
        date: props.date,
        options: bullets(body).map((item) => {
          const { label, rest } = splitDash(plain(item.text))
          return {
            label,
            reason: rest || undefined,
            state: item.strong ? "chosen" : item.em ? "rejected" : "open",
          }
        }),
        body: paragraphs(body).join("\n") || undefined,
      })
    case "GraphScore":
      return asciiScore({
        title: title ?? "",
        max: props.max ? Number(props.max) : undefined,
        items: bullets(body).map((item) => {
          const { label, rest } = splitLabel(plain(item.text))
          const [value = "", out] = rest.split("/")
          return {
            label,
            value: Number.parseFloat(value) || 0,
            max: out ? Number.parseFloat(out) : undefined,
          }
        }),
      })
    case "Chat":
      return asciiChat({
        title: title ?? "chat",
        you: props.you,
        prompt: props.prompt,
        turns: listBlocks(body).flatMap((item) => {
          const { label, rest } = splitLabel(plain(item.text))
          return rest
            ? [{ by: label, text: plain([rest, ...item.body].join(" ")) }]
            : []
        }),
      })
    case "Env": {
      const fence = fences(body)[0]
      const listed = bullets(body)
      return asciiEnv({
        title: title ?? ".env",
        vars: fence
          ? envVars(fence.code)
          : listed.length > 0
            ? listed.map((item) => {
                const { label, rest } = splitLabel(plain(item.text))
                const { label: value, rest: note } = splitDash(rest)
                return {
                  name: label,
                  value,
                  note: note || undefined,
                  required: /^\*\*/.test(item.text) || item.strong,
                }
              })
            : envVars(body),
      })
    }
    case "Endpoint": {
      const route =
        /^\s*(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|QUERY)\s+(\S+)\s*$/i
      const blocks = paragraphs(body)
      const hit = blocks.map((block) => block.match(route)).find(Boolean)
      const table = parseGfm(body)
      return asciiEndpoint({
        title: title ?? "endpoint",
        method: props.method ?? hit?.[1] ?? "GET",
        path: props.path ?? hit?.[2] ?? "/",
        about:
          blocks.filter((block) => !route.test(block)).join(" ") || undefined,
        params: (table?.rows ?? []).map((row) => ({
          name: plain(row[0] ?? ""),
          type: plain(row[1] ?? "") || undefined,
          description: plain(row[2] ?? "") || undefined,
          required: /^\*\*/.test(row[0] ?? ""),
        })),
        blocks: fences(body).map((fence) => ({
          label: /^\s*(\$ |curl\b)/.test(fence.code)
            ? "request"
            : fence.language,
          code: fence.code,
        })),
      })
    }
    case "Keys":
      return asciiKeys({
        title: title ?? "keys",
        bindings: bullets(body).map((item) => {
          const { label, rest } = splitLabel(plain(item.text))
          return { keys: label, action: rest }
        }),
      })
    case "Faq":
      return asciiFaq({
        title: title ?? "faq",
        entries: sections(body).map((section) => ({
          question: plain(section.title),
          answer: paragraphs(section.lines.join("\n")).join("\n") || undefined,
        })),
      })
    case "Graph":
      return asciiFlow({
        title: title ?? "",
        rows: body
          .replace(/<\/?GraphBody>/g, "")
          .replace(/<\/?p>/g, "")
          .split(/\n+/)
          .map((line) => line.trim())
          .filter(Boolean),
      })
    default:
      return asciiFlow({
        title: title ?? name,
        rows: body
          ? body
              .split(/\n/)
              .map((line) => line.replace(/\*+/g, "").trim())
              .filter(Boolean)
          : Object.entries(props)
              .filter(([key, value]) => value && key !== "title")
              .map(([key, value]) => `${key}: ${value}`),
      })
  }
}

export { drawMarkdown, fences, listBlocks, parseGfm, plain, runs, unwrapFence }
