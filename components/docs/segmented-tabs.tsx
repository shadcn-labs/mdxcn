"use client"

import type { KeyboardEvent, ReactNode } from "react"

import { HitArea } from "@/components/site/hit-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const NEXT_KEYS: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }

function SegmentedTabs<T extends string>({
  label,
  tabs,
  value,
  onValueChange,
  className,
  tabClassName,
  tooltips,
}: {
  label: string
  tabs: readonly (readonly [T, string])[]
  value: T
  onValueChange: (value: T) => void
  className?: string
  tabClassName?: string
  /** Optional hint per tab, shown on hover and keyboard focus. */
  tooltips?: Partial<Record<T, ReactNode>>
}) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex(([id]) => id === value)
    const target =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : event.key in NEXT_KEYS
            ? (index + NEXT_KEYS[event.key] + tabs.length) % tabs.length
            : null

    if (target === null) {
      return
    }

    event.preventDefault()
    onValueChange(tabs[target][0])
    const buttons =
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")
    buttons[target]?.focus()
  }

  const list = (
    <div
      aria-label={label}
      className={cn("flex flex-wrap items-center gap-1", className)}
      onKeyDown={onKeyDown}
      role="tablist"
    >
      {tabs.map(([id, name]) => {
        const tab = (
          <button
            aria-selected={value === id}
            className={cn(
              "relative px-2 py-1 text-muted-foreground hover:text-foreground aria-selected:bg-muted aria-selected:text-foreground",
              tabClassName
            )}
            key={id}
            onClick={() => onValueChange(id)}
            role="tab"
            tabIndex={value === id ? 0 : -1}
            type="button"
          >
            <HitArea />
            {name}
          </button>
        )

        const tip = tooltips?.[id]
        if (!tip) {
          return tab
        }

        return (
          <Tooltip key={id}>
            <TooltipTrigger render={tab} />
            <TooltipContent side="bottom">{tip}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )

  // One provider per row: after the first tooltip opens, moving to the next
  // tab shows its hint without waiting again.
  return tooltips ? <TooltipProvider delay={300}>{list}</TooltipProvider> : list
}

export { SegmentedTabs }
