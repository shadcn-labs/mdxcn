import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

import { addQueryParams } from "@/lib/url"
import { UTM_PARAMS } from "@/lib/site"
import { cn } from "@/lib/utils"

/** Body copy — Geist Sans, relaxed leading, readable contrast. */
export const proseBodyClass =
  "max-w-[56ch] text-pretty leading-relaxed text-foreground/88"

export const proseLeadClass =
  "max-w-[56ch] text-pretty text-base leading-relaxed text-foreground/85 sm:text-[1.0625rem]"

export const proseMutedClass =
  "max-w-[56ch] text-pretty leading-relaxed text-muted-foreground"

export const proseLinkClass =
  "text-foreground underline decoration-dashed decoration-graph-frame underline-offset-[0.2em] transition-[color,text-decoration-color] duration-200 ease-out hover:decoration-foreground/70"

/** Inline code — bold mono, no box. */
export const proseCodeClass = "font-mono font-semibold text-foreground"

function Prose({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-4", className)} {...props} />
}

function ProseP({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(proseBodyClass, className)} {...props} />
}

function ProseLead({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(proseLeadClass, className)} {...props} />
}

function ProseMuted({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(proseMutedClass, className)} {...props} />
}

type TextLinkProps = {
  href: string
  children: ReactNode
  className?: string
}

function TextLink({ href, children, className }: TextLinkProps) {
  const cls = cn(proseLinkClass, className)

  if (href.startsWith("http")) {
    return (
      <a
        className={cls}
        href={addQueryParams(href, UTM_PARAMS)}
        rel="noreferrer"
        target="_blank"
      >
        {children}
      </a>
    )
  }

  return (
    <Link className={cls} href={href}>
      {children}
    </Link>
  )
}

function InlineCode({ className, ...props }: ComponentProps<"code">) {
  return <code className={cn(proseCodeClass, className)} {...props} />
}

export { InlineCode, Prose, ProseLead, ProseMuted, ProseP, TextLink }
