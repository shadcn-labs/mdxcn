import type { ComponentProps } from "react"

import { SiteCorners, SiteRule, type Corner } from "@/components/site/corners"
import { cn } from "@/lib/utils"

function SiteContainer({
  containerClassName,
  className,
  borderTop = true,
  corners,
  ...props
}: ComponentProps<"div"> & {
  borderTop?: boolean
  corners?: readonly Corner[]
  containerClassName?: string
}) {
  const marks = corners ?? (borderTop ? (["tl", "tr"] as const) : [])

  return (
    <div className="relative">
      {borderTop ? <SiteRule className="top-0" /> : null}
      <div className={cn("relative isolate mx-auto w-full max-w-6xl min-w-0 px-4 sm:px-6 lg:px-8", containerClassName)}>
        <SiteRule className="left-0" orientation="y" />
        <SiteRule className="right-0" orientation="y" />
        <SiteCorners corners={marks} />
        <div className={cn("min-w-0 py-12 sm:py-16", className)} {...props} />
      </div>
    </div>
  )
}

export { SiteContainer }
