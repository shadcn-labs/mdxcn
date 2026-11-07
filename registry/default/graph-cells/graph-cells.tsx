"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  childElements,
  childItems,
  defineItem,
  Graph,
  GraphBody,
  itemText,
  linesOf,
  listItems,
  splitLabel,
  textOf,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fillDelay,
  graphTransition,
  isMonoPalette,
  seriesClass,
  trackMarks,
  type Glyphs,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"
import { cn } from "@/lib/utils"

type CellGrid = {
  label: string
  cells: number[][]
}

type GridProps = {
  label: string
  cells?: number[][]
}

/** `<Grid label="fragments">1 0 1 0 0\n0 1 0 1 0</Grid>` */
const Grid = defineItem<GridProps>("Grid")

type GraphCellsProps = {
  title?: string
  /** Data form. Or write `<Grid>` children. */
  items?: CellGrid[]
  children?: ReactNode
  glyphs?: Glyphs
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

function parseRow(line: string): number[] {
  return line
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number)
    .filter((value) => Number.isFinite(value))
}

function gridCells(node: ReactNode): number[][] {
  const blocks = childElements(node)
  if (blocks.length > 1) {
    return blocks
      .map((block) => parseRow(textOf(block.element)))
      .filter((row) => row.length > 0)
  }

  const text = textOf(node).trim()
  if (text.includes("/")) {
    return text
      .split("/")
      .map(parseRow)
      .filter((row) => row.length > 0)
  }

  return linesOf(node)
    .map(parseRow)
    .filter((row) => row.length > 0)
}

function GraphCells({
  title,
  items: itemsProp,
  children,
  glyphs,
  palette,
  corner,
  frame,
  className,
}: GraphCellsProps) {
  const listed = listItems(children).map((item) => {
    const { label, rest } = splitLabel(itemText(item))
    return {
      label,
      cells: gridCells(rest),
    }
  })
  const tagged = childItems(children, Grid).map((entry) => ({
    label: entry.label,
    cells: entry.cells ?? gridCells(entry.children),
  }))
  const items = itemsProp ?? (listed.length > 0 ? listed : tagged)
  const reduce = useReducedMotion()
  const marks = trackMarks(glyphs, {
    empty: "·",
    rest: "░",
    fill: "█",
  })

  return (
    <Graph title={title} className={className} corner={corner} frame={frame}>
      <GraphBody>
        <div className="@container flex flex-col items-center gap-10 @min-[28rem]:flex-row @min-[28rem]:justify-center @min-[28rem]:gap-12">
          {items.map((item, itemIndex) => (
            <div className="flex flex-col items-center gap-4" key={item.label}>
              <div aria-hidden="true" className="flex flex-col gap-1">
                {item.cells.map((row, rowIndex) => (
                  <div className="flex gap-1" key={rowIndex}>
                    {row.map((cell, cellIndex) => {
                      const filled = cell === 1

                      return (
                        <motion.span
                          className={cn(
                            "w-[1ch] text-center select-none",
                            filled
                              ? isMonoPalette(palette)
                                ? "text-graph-accent"
                                : seriesClass(palette, itemIndex)
                              : "text-graph-frame"
                          )}
                          initial={reduce || !filled ? false : { opacity: 0 }}
                          key={cellIndex}
                          transition={graphTransition(reduce, {
                            delay: fillDelay(
                              reduce,
                              itemIndex * 8 + rowIndex * 5 + cellIndex
                            ),
                          })}
                          viewport={graphViewport}
                          whileInView={{ opacity: 1 }}
                        >
                          {filled ? marks.fill : marks.empty}
                        </motion.span>
                      )
                    })}
                  </div>
                ))}
              </div>
              <p
                className={
                  isMonoPalette(palette)
                    ? "text-graph-muted"
                    : seriesClass(palette, itemIndex)
                }
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </GraphBody>
    </Graph>
  )
}

export { GraphCells, Grid }
export type { CellGrid, GraphCellsProps, GridProps }
