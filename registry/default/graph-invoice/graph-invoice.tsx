"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childItems,
  defineItem,
  Graph,
  GraphBody,
  GraphRule,
  hasHost,
  itemText,
  linesOf,
  listItems,
  paragraphsOf,
  splitLabel,
  tableOf,
  textOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  staggerList,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type InvoiceParty = {
  name: string
  lines?: string[]
}

type InvoiceMeta = {
  label: string
  value: string
}

type InvoiceItem = {
  description: string
  qty?: string
  rate?: string
  amount: string
}

type InvoiceTotal = {
  label: string
  value: string
  accent?: boolean
}

type GraphInvoiceProps = {
  title?: string
  from?: InvoiceParty | string
  to?: InvoiceParty | string
  meta?: InvoiceMeta[]
  /** Data form. Or a markdown table of line items. */
  items?: InvoiceItem[]
  totals?: InvoiceTotal[]
  note?: string
  children?: ReactNode
  corner?: string
  frame?: GraphFrame
  className?: string
}

const From = defineItem<InvoiceParty>("From")
const To = defineItem<InvoiceParty>("To")
const Meta = defineItem<{ label: string; value?: string }>("Meta")
const Item = defineItem<
  Omit<InvoiceItem, "description"> & { description?: string }
>("Item")
const Total = defineItem<{
  label?: string
  value?: string
  accent?: boolean
}>("Total")

function partyOf(
  value: InvoiceParty | string | undefined,
  entry?: InvoiceParty & { children?: ReactNode }
): InvoiceParty | undefined {
  if (typeof value === "string") {
    const [name, ...lines] = value
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean)
    if (!name) {
      return undefined
    }
    return {
      name,
      lines: lines.length > 0 ? lines : undefined,
    }
  }

  if (value) {
    return value
  }

  if (!entry) {
    return undefined
  }

  const lines = entry.lines ?? linesOf(entry.children)
  return {
    name: entry.name,
    lines: lines.length > 0 ? lines : undefined,
  }
}

function moneyLine(text: string): { label: string; value: string } | null {
  const match = text.match(/^(.*?)\s+([+\-−]?[\d,]+(?:\.\d+)?)\s*$/)
  if (!match) {
    return null
  }
  return { label: match[1]?.trim() ?? "", value: match[2] ?? "" }
}

function itemsFromTable(children: ReactNode): InvoiceItem[] {
  const table = tableOf(children)
  if (!table || table.rows.length === 0) {
    return []
  }

  const headers = table.headers.map((header) => header.toLowerCase())
  const qtyAt = headers.findIndex((header) => /qty|qty\.|quantity/.test(header))
  const rateAt = headers.findIndex((header) => /rate|price/.test(header))
  const amountAt = headers.findIndex((header) =>
    /amount|total|sum/.test(header)
  )

  return table.rows.map((row) => {
    const last = row.length - 1
    const amountIndex = amountAt >= 0 ? amountAt : last
    const description = row[0] ?? ""
    const qty =
      qtyAt >= 0
        ? row[qtyAt]
        : row.length >= 4
          ? row[1]
          : row.length === 3 && rateAt < 0
            ? row[1]
            : undefined
    const rate =
      rateAt >= 0 ? row[rateAt] : row.length >= 4 ? row[2] : undefined
    return {
      description,
      qty: qty || undefined,
      rate: rate || undefined,
      amount: row[amountIndex] ?? "",
    }
  })
}

function Party({ label, party }: { label: string; party: InvoiceParty }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono tracking-wide text-graph-muted uppercase">
        {label}
      </p>
      <p className="text-foreground">{party.name}</p>
      {party.lines?.map((line) => (
        <p className="text-graph-muted" key={line}>
          {line}
        </p>
      ))}
    </div>
  )
}

function GraphInvoice({
  title,
  from: fromProp,
  to: toProp,
  meta: metaProp,
  items: itemsProp,
  totals: totalsProp,
  note: noteProp,
  children,
  corner,
  frame,
  className,
}: GraphInvoiceProps) {
  const from = partyOf(fromProp, childItems(children, From)[0])
  const to = partyOf(toProp, childItems(children, To)[0])
  const taggedMeta = childItems(children, Meta).map((entry) => ({
    label: entry.label,
    value: entry.value ?? textOf(entry.children),
  }))
  const listedMeta = listItems(children)
    .map((entry) => splitLabel(itemText(entry)))
    .filter((entry) => entry.rest)
    .map((entry) => ({ label: entry.label, value: entry.rest }))
  const meta = metaProp ?? (taggedMeta.length > 0 ? taggedMeta : listedMeta)
  const taggedItems = childItems(children, Item).map((entry) => ({
    ...entry,
    description: entry.description ?? textOf(entry.children),
  }))
  const items = (
    itemsProp ??
    (taggedItems.length > 0 ? taggedItems : itemsFromTable(children))
  ).map((entry) => ({ ...entry, description: entry.description ?? "" }))
  const taggedTotals = childItems(children, Total).map((entry) => ({
    ...entry,
    label: entry.label ?? textOf(entry.children),
    value: entry.value ?? textOf(entry.children),
  }))
  const paragraphTotals = paragraphsOf(children).flatMap((paragraph) => {
    const content = (paragraph.props as { children?: ReactNode }).children
    const parsed = moneyLine(textOf(content).trim())
    if (!parsed) {
      return []
    }
    return [
      {
        ...parsed,
        accent: hasHost(content, ["strong", "b"]),
      },
    ]
  })
  const totals =
    totalsProp ?? (taggedTotals.length > 0 ? taggedTotals : paragraphTotals)
  const note =
    noteProp ??
    paragraphsOf(children)
      .map((paragraph) =>
        textOf((paragraph.props as { children?: ReactNode }).children).trim()
      )
      .find((text) => text && !moneyLine(text))
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.04)
  const showQty = items.some((row) => row.qty != null)
  const showRate = items.some((row) => row.rate != null)
  const columns = 1 + Number(showQty) + Number(showRate) + 1

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="flex flex-col gap-8">
        {from || to ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {from ? <Party label="From" party={from} /> : null}
            {to ? <Party label="Bill to" party={to} /> : null}
          </div>
        ) : null}

        {meta && meta.length > 0 ? (
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            {meta.map((entry) => (
              <div className="flex flex-col gap-1" key={entry.label}>
                <dt className="font-mono tracking-wide text-graph-muted uppercase">
                  {entry.label}
                </dt>
                <dd className="text-foreground tabular-nums">{entry.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="@container overflow-x-auto overflow-y-hidden">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="px-0 pb-3 text-left font-normal text-graph-muted">
                  Description
                </th>
                {showQty ? (
                  <th className="px-3 pb-3 text-right font-normal text-graph-muted">
                    Qty
                  </th>
                ) : null}
                {showRate ? (
                  <th className="px-3 pb-3 text-right font-normal text-graph-muted">
                    Rate
                  </th>
                ) : null}
                <th className="px-0 pb-3 text-right font-normal text-graph-muted">
                  Amount
                </th>
              </tr>
              <tr>
                <th colSpan={columns} className="p-0">
                  <GraphRule />
                </th>
              </tr>
            </thead>
            <motion.tbody
              initial={reduce ? false : "hidden"}
              variants={list}
              viewport={graphViewport}
              whileInView="show"
            >
              {items.map((row) => (
                <motion.tr key={row.description} variants={item}>
                  <td className="px-0 py-2.5 text-left">{row.description}</td>
                  {showQty ? (
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {row.qty ?? ""}
                    </td>
                  ) : null}
                  {showRate ? (
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {row.rate ?? ""}
                    </td>
                  ) : null}
                  <td className="px-0 py-2.5 text-right tabular-nums">
                    {row.amount}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        {totals && totals.length > 0 ? (
          <div className="flex flex-col gap-3">
            <GraphRule />
            <motion.dl
              className="ml-auto flex w-full max-w-[22rem] flex-col gap-2"
              initial={reduce ? false : "hidden"}
              variants={list}
              viewport={graphViewport}
              whileInView="show"
            >
              {totals.map((entry) => (
                <motion.div
                  className="grid grid-cols-[minmax(0,1fr)_8rem] items-baseline gap-x-4"
                  key={entry.label}
                  variants={item}
                >
                  <dt
                    className={cn(
                      entry.accent ? "text-foreground" : "text-graph-muted"
                    )}
                  >
                    {entry.label}
                  </dt>
                  <dd
                    className={cn(
                      "text-right tabular-nums",
                      entry.accent ? "text-graph-accent" : "text-foreground"
                    )}
                  >
                    {entry.value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        ) : null}

        {note ? (
          <p className="max-w-[48ch] text-pretty text-graph-muted">{note}</p>
        ) : null}
      </GraphBody>
    </Graph>
  )
}

export { From, GraphInvoice, Item, Meta, To, Total }
export type {
  GraphInvoiceProps,
  InvoiceItem,
  InvoiceMeta,
  InvoiceParty,
  InvoiceTotal,
}
