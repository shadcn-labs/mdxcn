import Link from "next/link"
import type { ReactNode } from "react"

import { proseLinkClass } from "@/components/site/prose"
import { components, type ComponentDoc } from "@/lib/docs/catalog"

/** "Bars" → graph-bars. Hints name other components in sentence case. */
const slugByName = new Map(
  components.map((item) => [
    item.title.charAt(0).toUpperCase() + item.title.slice(1),
    item.slug,
  ])
)

const namePattern = new RegExp(
  `\\b(${[...slugByName.keys()]
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "g"
)

/** Turn component names in a hint into links to their pages. */
function linkNames(text: string, self: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0

  for (const match of text.matchAll(namePattern)) {
    const name = match[0]
    const slug = slugByName.get(name)
    const at = match.index ?? 0

    if (!slug || slug === self) {
      continue
    }

    out.push(text.slice(last, at))
    out.push(
      <Link className={proseLinkClass} href={`/docs/${slug}`} key={at}>
        {name}
      </Link>
    )
    last = at + name.length
  }

  out.push(text.slice(last))
  return out
}

/** When to reach for this component, and what to use instead. */
function ComponentGuide({ doc }: { doc: ComponentDoc }) {
  const rows = [
    doc.when ? { label: "use it", text: doc.when } : null,
    doc.not ? { label: "instead", text: doc.not } : null,
  ].filter((row) => row !== null)

  if (rows.length === 0) {
    return null
  }

  return (
    <dl className="grid max-w-[60ch] grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 leading-relaxed sm:text-[0.9375rem]">
      {rows.map((row) => (
        <div className="contents" key={row.label}>
          <dt className="font-mono text-sm text-graph-muted">{row.label}</dt>
          <dd className="text-pretty text-foreground/88">
            {linkNames(row.text, doc.slug)}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export { ComponentGuide }
