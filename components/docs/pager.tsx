import Link from "next/link"

import { components } from "@/lib/docs/catalog"
import { cn } from "@/lib/utils"

function PagerLink({
  slug,
  direction,
}: {
  slug: string
  direction: "previous" | "next"
}) {
  const item = components.find((entry) => entry.slug === slug)

  if (!item) {
    return <span />
  }

  const next = direction === "next"

  return (
    <Link
      className={cn(
        "group flex min-w-0 flex-col gap-1 py-4 transition-colors duration-150 ease-out",
        next ? "col-start-2 items-end text-right" : "items-start"
      )}
      href={`/docs/${item.slug}`}
      rel={next ? "next" : "prev"}
    >
      <span className="font-mono text-sm text-graph-muted">
        {next ? "next →" : "← previous"}
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground underline decoration-transparent decoration-dashed underline-offset-[0.2em] transition-[text-decoration-color] duration-150 ease-out group-hover:decoration-graph-frame">
        {item.title}
      </span>
    </Link>
  )
}

/** Previous and next component, in sidebar order. */
function DocsPager({ slug }: { slug: string }) {
  const index = components.findIndex((item) => item.slug === slug)

  if (index === -1) {
    return null
  }

  const previous = components[index - 1]
  const next = components[index + 1]

  return (
    <nav
      aria-label="Previous and next component"
      className="relative grid grid-cols-2 gap-x-8"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 site-rule" />
      {previous ? (
        <PagerLink direction="previous" slug={previous.slug} />
      ) : null}
      {next ? <PagerLink direction="next" slug={next.slug} /> : null}
    </nav>
  )
}

export { DocsPager }
