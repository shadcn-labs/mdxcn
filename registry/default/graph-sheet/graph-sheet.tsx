"use client"

import type { ReactNode } from "react"

import { motion, useReducedMotion } from "motion/react"

import {
  alignsOf,
  Cell,
  cellsOf,
  childItems,
  defineItem,
  Foot,
  Graph,
  GraphBody,
  GraphRule,
  Head,
  headingSections,
  Row,
  tableOf,
  words,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  staggerList,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type GraphAlign = "left" | "right"

type SheetSection = {
  title: string
  rows: ReactNode[][]
}

type SectionProps = {
  title: string
  rows?: ReactNode[][]
}

/** `<Section title="Scope"><Row>CLI copies files | priya | done</Row></Section>` */
const Section = defineItem<SectionProps>("Section")

type GraphSheetProps = {
  title?: string
  /** Data form. Or write `<Head>Item | Owner | Status</Head>`. */
  headers?: string[] | string
  /** Data form. Or write `<Section>` children. */
  sections?: SheetSection[]
  footer?: ReactNode[]
  align?: GraphAlign[] | string
  children?: ReactNode
  corner?: string
  frame?: GraphFrame
  className?: string
}

function side(align: GraphAlign[] | undefined, index: number): GraphAlign {
  return align?.[index] ?? (index === 0 ? "left" : "right")
}

function RuleY() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 graph-rule-y"
    />
  )
}

function GraphSheet({
  title,
  headers: headersProp,
  sections: sectionsProp,
  footer: footerProp,
  align: alignProp,
  children,
  corner,
  frame,
  className,
}: GraphSheetProps) {
  const markdownSections = headingSections(children).map((section) => {
    const table = tableOf(section.children)
    return {
      title: section.title,
      rows: table?.rows ?? [],
      headers: table?.headers,
      align: table?.align,
    }
  })
  const head = childItems(children, Head)[0]
  const headers = (
    headersProp == null
      ? head
        ? cellsOf(undefined, head?.children)
        : (markdownSections[0]?.headers ?? [])
      : cellsOf(headersProp)
  ).map((cell) => String(cell ?? ""))
  const taggedSections = childItems(children, Section).map((section) => ({
    title: section.title,
    rows:
      section.rows ??
      childItems(section.children, Row).map((row) =>
        cellsOf(row.cells, row.children)
      ),
  }))
  const sections =
    sectionsProp ??
    (taggedSections.length > 0 ? taggedSections : markdownSections)
  const foot = childItems(children, Foot)[0]
  const footer =
    footerProp ?? (foot ? cellsOf(foot.cells, foot.children) : undefined)
  const align =
    (typeof alignProp === "string"
      ? (words(alignProp) as GraphAlign[])
      : alignProp) ??
    alignsOf(head?.children) ??
    markdownSections[0]?.align
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.04)
  const columns = headers.length

  function cellClass(index: number, extra?: string) {
    return cn(
      "relative px-3 py-2.5",
      side(align, index) === "right" ? "text-right tabular-nums" : "text-left",
      extra
    )
  }

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody className="px-3 py-6 sm:px-6 sm:py-8">
        <div className="@container overflow-x-auto overflow-y-hidden">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={header}
                    className={cn(
                      "relative px-3 pb-3 font-normal whitespace-nowrap text-foreground",
                      side(align, index) === "right"
                        ? "text-right"
                        : "text-left"
                    )}
                  >
                    {index > 0 ? <RuleY /> : null}
                    {header}
                  </th>
                ))}
              </tr>
              <tr>
                <th colSpan={columns} className="p-0">
                  <GraphRule />
                </th>
              </tr>
            </thead>
            {sections.map((section, sectionIndex) => (
              <motion.tbody
                initial={reduce ? false : "hidden"}
                key={section.title}
                variants={list}
                viewport={graphViewport}
                whileInView="show"
              >
                {sectionIndex > 0 ? (
                  <tr>
                    <td colSpan={columns} className="pt-4 pb-1">
                      <GraphRule />
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td
                    className="px-3 pt-3 pb-1 text-graph-muted"
                    colSpan={columns}
                  >
                    {section.title}
                  </td>
                </tr>
                {section.rows.map((row, rowIndex) => (
                  <motion.tr key={rowIndex} variants={item}>
                    {row.map((cell, cellIndex) => (
                      <td
                        className={cellClass(cellIndex, "whitespace-nowrap")}
                        key={cellIndex}
                      >
                        {cellIndex > 0 ? <RuleY /> : null}
                        {cell}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </motion.tbody>
            ))}
            {footer ? (
              <tfoot>
                <tr>
                  <td colSpan={columns} className="pt-3 pb-3">
                    <GraphRule />
                  </td>
                </tr>
                <tr>
                  {footer.map((cell, cellIndex) => (
                    <td
                      className={cellClass(cellIndex, "whitespace-nowrap")}
                      key={cellIndex}
                    >
                      {cellIndex > 0 ? <RuleY /> : null}
                      {cell}
                    </td>
                  ))}
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </GraphBody>
    </Graph>
  )
}

export { Cell, Foot, GraphSheet, Head, Row, Section }
export type { GraphAlign, GraphSheetProps, SectionProps, SheetSection }
