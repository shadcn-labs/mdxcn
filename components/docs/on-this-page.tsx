"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { MonoLabel } from "@/components/docs/mono-label"
import { cn } from "@/lib/utils"

type Section = { id: string; label: string }

/** Sections are `h2[id]` and anything marked `data-toc`, in page order. */
const SECTION_SELECTOR = "main h2[id], main [data-toc][id]"

/** Matches `scroll-padding-top` on `html`, plus a little slack. */
const ACTIVE_OFFSET = 96

function labelOf(element: Element) {
  const marked = element.getAttribute("data-toc")
  if (marked) {
    return marked
  }

  return [...element.childNodes]
    .filter((node) => !(node instanceof HTMLAnchorElement))
    .map((node) => node.textContent ?? "")
    .join("")
    .trim()
}

function readSections(): Section[] {
  const seen = new Set<string>()
  const sections: Section[] = []

  for (const element of document.querySelectorAll(SECTION_SELECTOR)) {
    if (seen.has(element.id)) {
      continue
    }
    seen.add(element.id)
    sections.push({ id: element.id, label: labelOf(element) })
  }

  return sections
}

/** The last section whose heading has scrolled past the top. */
function activeSection(sections: Section[]) {
  const atBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2
  if (atBottom) {
    return sections.at(-1)?.id
  }

  let current = sections[0]?.id
  for (const section of sections) {
    const element = document.getElementById(section.id)
    if (element && element.getBoundingClientRect().top <= ACTIVE_OFFSET) {
      current = section.id
    }
  }
  return current
}

/**
 * The current page's sections, nested under its sidebar link. Renders
 * nothing on pages with fewer than two sections.
 */
function OnThisPage({
  onNavigate,
  variant = "nested",
  className,
}: {
  onNavigate?: () => void
  /** `nested` sits under the sidebar link; `rail` stands alone with a label. */
  variant?: "nested" | "rail"
  className?: string
}) {
  const pathname = usePathname()
  const [sections, setSections] = useState<Section[]>([])
  const [active, setActive] = useState<string>()
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    // The page can stream in after the sidebar hydrates, so read again
    // whenever the main column's structure changes.
    // A short timer, not a frame: it batches bursts of mutations and still
    // runs in a background tab.
    let timer: ReturnType<typeof setTimeout> | undefined
    let key = ""
    const read = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const found = readSections()
        const next = found.map((section) => section.id).join(" ")
        if (next === key) {
          return
        }

        key = next
        setSections(found)
        setActive(activeSection(found))
      }, 50)
    }

    read()
    // A read can land mid-navigation while the old page is still in the
    // DOM; one more pass after it settles drops any leftovers.
    const settle = setTimeout(read, 400)
    const observer = new MutationObserver(read)
    observer.observe(document.getElementById("main") ?? document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(timer)
      clearTimeout(settle)
      observer.disconnect()
    }
  }, [pathname])

  useEffect(() => {
    if (sections.length < 2) {
      return
    }

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setActive(activeSection(sections)))
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [sections])

  useEffect(() => {
    const list = listRef.current
    const scroller = list?.closest<HTMLElement>("[data-docs-scroller]")
    const link = list?.querySelector<HTMLElement>('[aria-current="location"]')
    if (!scroller || !link) {
      return
    }

    const box = scroller.getBoundingClientRect()
    const item = link.getBoundingClientRect()
    if (item.bottom > box.bottom - 48) {
      scroller.scrollTop += item.bottom - box.bottom + 48
    } else if (item.top < box.top + 48) {
      scroller.scrollTop -= box.top + 48 - item.top
    }
  }, [active])

  if (sections.length < 2) {
    return null
  }

  const list = (
    <ul
      ref={listRef}
      aria-label="On this page"
      className={cn(
        "relative flex flex-col py-1",
        variant === "nested" && "ml-4",
        variant === "nested" && className
      )}
      role="list"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 site-rule-y"
      />
      {sections.map((section) => {
        const current = section.id === active

        return (
          <li className="relative" key={section.id}>
            {current ? (
              <span
                aria-hidden="true"
                className="absolute inset-y-1 left-0 w-px bg-graph-accent"
              />
            ) : null}
            <a
              aria-current={current ? "location" : undefined}
              className={cn(
                variant === "rail" ? "py-1" : "py-1.5",
                "block truncate pr-4 pl-4 text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground",
                current && "text-foreground"
              )}
              href={`#${section.id}`}
              onClick={onNavigate}
            >
              {section.label}
            </a>
          </li>
        )
      })}
    </ul>
  )

  if (variant === "nested") {
    return list
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <MonoLabel>on this page</MonoLabel>
      {list}
    </div>
  )
}

export { OnThisPage }
