import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** `"box, untitled"` → `box-untitled`. Stable ids for docs section links. */
function sectionId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * A docs section title you can link to. The `#` sits in the left gutter on
 * wide screens and shows on hover or focus, so headings stay aligned.
 */
function SectionHeading({
  id,
  children,
  className,
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  // The link sits beside the heading, not inside it, so the heading's
  // accessible name stays the title alone.
  return (
    <div className="group/heading relative">
      <a
        aria-label={`Link to ${typeof children === "string" ? children : id}`}
        className="absolute top-0 -left-5 hidden font-mono text-xl leading-7 text-graph-muted opacity-0 transition-opacity duration-150 ease-out group-hover/heading:opacity-100 hover:text-graph-accent focus-visible:opacity-100 sm:block"
        href={`#${id}`}
      >
        #
      </a>
      <h2
        className={cn(
          "text-xl font-semibold tracking-tight text-balance",
          className
        )}
        id={id}
      >
        {children}
      </h2>
    </div>
  )
}

export { SectionHeading, sectionId }
