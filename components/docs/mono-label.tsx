import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * A small label that names a group. It stays quiet so the content
 * under it leads; the accent is kept for figures and the current item.
 */
function MonoLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn("text-xs font-medium text-muted-foreground", className)}>
      {children}
    </p>
  )
}

export { MonoLabel }
