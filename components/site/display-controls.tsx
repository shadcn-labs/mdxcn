"use client"

import type { ReactNode } from "react"

import { MonoLabel } from "@/components/docs/mono-label"
import { SegmentedTabs } from "@/components/docs/segmented-tabs"
import { GraphFrameProvider, type GraphFrame } from "@/components/graphs"
import { AccentPicker } from "@/components/site/accent-picker"
import { FRAMES, setSiteFrame, useSiteFrame } from "@/hooks/use-site-frame"
import { cn } from "@/lib/utils"

const FRAME_TABS = FRAMES.map((frame) => [frame, frame] as const)

const FRAME_HINTS: Record<GraphFrame, { text: string; drawing: string }> = {
  box: {
    text: "Dashed border, corner marks, title on the top edge.",
    drawing: "+--[ T ]--+\n| ▓▓▓▓░░░ |\n+---------+",
  },
  corners: {
    text: "Corner marks only. The title stays on the top edge.",
    drawing: "+  [ T ]  +\n  ▓▓▓▓░░░\n+         +",
  },
  rule: {
    text: "A line above and below. Sits well between paragraphs.",
    drawing: "---[ T ]---\n  ▓▓▓▓░░░\n-----------",
  },
  none: {
    text: "No border or padding. The title sits above the figure.",
    drawing: "[ T ]\n▓▓▓▓░░░",
  },
}

const FRAME_TOOLTIPS = Object.fromEntries(
  FRAMES.map((frame) => [
    frame,
    <span className="flex flex-col gap-1.5" key={frame}>
      <span>{FRAME_HINTS[frame].text}</span>
      <span
        aria-hidden="true"
        className="font-mono text-[11px] leading-[1.35] whitespace-pre opacity-70"
      >
        {FRAME_HINTS[frame].drawing}
      </span>
    </span>,
  ])
) as Record<GraphFrame, ReactNode>

/**
 * Sets the frame for example previews and demos. Graphs that are part of a
 * page's own content keep theirs. Saved across visits.
 */
function FramePicker({ className }: { className?: string }) {
  const frame = useSiteFrame()

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <MonoLabel>frame</MonoLabel>
      <SegmentedTabs
        className="flex-wrap"
        label="frame for previews"
        onValueChange={(value: GraphFrame) => setSiteFrame(value)}
        tabClassName="px-1.5 font-mono text-xs"
        tabs={FRAME_TABS}
        tooltips={FRAME_TOOLTIPS}
        value={frame}
      />
    </div>
  )
}

/** Accent and frame, the two choices that repaint every figure. */
function DisplayControls({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <AccentPicker layout="stacked" />
      <FramePicker />
    </div>
  )
}

/** Applies the picked frame to the graphs inside. A graph's own prop wins. */
function SiteFrameProvider({ children }: { children: ReactNode }) {
  const frame = useSiteFrame()
  return <GraphFrameProvider frame={frame}>{children}</GraphFrameProvider>
}

export { DisplayControls, FramePicker, SiteFrameProvider }
