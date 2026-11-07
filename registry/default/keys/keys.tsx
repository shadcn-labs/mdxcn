"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  Graph,
  GraphBody,
  hasHost,
  itemText,
  listItems,
  splitLabel,
  type GraphFrame,
} from "@/registry/default/graph-frame/graph-frame"
import {
  fadeUp,
  staggerList,
  toneClass,
  type GraphPalette,
  graphViewport,
} from "@/registry/default/graph-frame/graph-motion"

type KeyBinding = {
  /** `⌘K`, `Ctrl+Shift+P`, `g then d`. */
  keys: string
  action: string
  accent?: boolean
}

type KeysProps = {
  /** Default `keys`. */
  title?: string
  /** Data form. Or a Markdown list: `- ⌘K: search`. */
  bindings?: KeyBinding[]
  children?: ReactNode
  palette?: GraphPalette
  corner?: string
  frame?: GraphFrame
  className?: string
}

const MODIFIERS = new Set(["⌘", "⌥", "⇧", "⌃", "⎋", "↵", "⌫", "⇥"])

/** `⌘⇧P` → ⌘ ⇧ P. `Ctrl+Shift+P` → Ctrl Shift P. `g then d` → two chords. */
function chordsOf(keys: string): string[][] {
  return keys
    .split(/\s+then\s+/i)
    .map((chord) =>
      chord
        .split(/\s*\+\s*|\s+/)
        .filter(Boolean)
        .flatMap((token) => {
          const glyphs = [...token]
          const lead = glyphs.findIndex((glyph) => !MODIFIERS.has(glyph))
          if (lead <= 0) {
            return lead === -1 ? glyphs : [token]
          }
          return [...glyphs.slice(0, lead), glyphs.slice(lead).join("")]
        })
    )
    .filter((chord) => chord.length > 0)
}

function bindingsOf(children: ReactNode): KeyBinding[] {
  return listItems(children).map((item) => {
    const content = (item.props as { children?: ReactNode }).children
    const { label, rest } = splitLabel(itemText(item))
    return {
      keys: label,
      action: rest,
      accent: hasHost(content, ["strong", "b"]),
    }
  })
}

/**
 * Keyboard shortcuts. Markdown:
 *
 * ```mdx
 * <Keys title="SHORTCUTS">
 *
 * - ⌘K: search the docs
 * - Ctrl+Shift+P: command palette
 * - g then d: go to docs
 *
 * </Keys>
 * ```
 */
function Keys({
  title = "keys",
  bindings: bindingsProp,
  children,
  palette,
  corner,
  frame,
  className,
}: KeysProps) {
  const reduce = useReducedMotion()
  const item = fadeUp(reduce)
  const list = staggerList(reduce, 0.04)
  const bindings = bindingsProp ?? bindingsOf(children)

  return (
    <Graph className={className} corner={corner} frame={frame} title={title}>
      <GraphBody>
        <motion.dl
          className="flex flex-col gap-3"
          initial={reduce ? false : "hidden"}
          variants={list}
          viewport={graphViewport}
          whileInView="show"
        >
          {bindings.map((binding, index) => {
            const tone = binding.accent
              ? toneClass(palette, "primary")
              : "text-foreground"

            return (
              <motion.div
                className="grid grid-cols-[minmax(0,13rem)_minmax(0,1fr)] items-baseline gap-x-3 sm:gap-x-6"
                key={`${binding.keys}-${index}`}
                variants={item}
              >
                <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="sr-only">{binding.keys}</span>
                  {chordsOf(binding.keys).map((chord, chordIndex) => (
                    <span
                      aria-hidden="true"
                      className="flex items-baseline gap-x-2 select-none"
                      key={chordIndex}
                    >
                      {chordIndex > 0 ? (
                        <span className="text-graph-muted">then</span>
                      ) : null}
                      <span className="flex items-baseline">
                        {chord.map((key, keyIndex) => (
                          <span className="whitespace-nowrap" key={keyIndex}>
                            <span className="text-graph-frame">[</span>
                            <span className={tone}>{key}</span>
                            <span className="text-graph-frame">]</span>
                          </span>
                        ))}
                      </span>
                    </span>
                  ))}
                </dt>
                <dd className={tone}>{binding.action}</dd>
              </motion.div>
            )
          })}
        </motion.dl>
      </GraphBody>
    </Graph>
  )
}

export { Keys }
export type { KeyBinding, KeysProps }
