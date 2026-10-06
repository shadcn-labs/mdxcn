"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react"
import { useRouter } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { HeaderButton } from "@/components/site/header-button"
import { SiteCorners } from "@/components/site/corners"
import { components, getStarted } from "@/lib/docs/catalog"
import { recipes } from "@/lib/docs/recipes"
import { cn } from "@/lib/utils"

type Hit = {
  href: string
  title: string
  detail: string
  group: string
  haystack: string
}

const HITS: Hit[] = [
  {
    href: "/developers",
    title: "mdxcn api",
    detail: "/developers",
    group: "get started",
    haystack:
      "mdxcn api developer openapi json catalog health rate limit deprecation",
  },
  {
    href: "/agents.md",
    title: "agents.md",
    detail: "/agents.md",
    group: "get started",
    haystack: "agents md markdown for agents skill llms machine readable",
  },
  {
    href: "/comark",
    title: "comark",
    detail: "/comark",
    group: "get started",
    haystack:
      "comark markdown component syntax yaml graph-table no mdx streaming atinux",
  },
  {
    href: "/knap",
    title: "knap",
    detail: "/knap",
    group: "get started",
    haystack:
      "knap template filter graph_timeline graph_meter data markdown obsidian kepano graph-knap",
  },
  {
    href: "/agents",
    title: "for agents",
    detail: "/agents",
    group: "get started",
    haystack:
      "for agents skill llms.txt cursor claude codex opencode mdx write read ascii fence recipes comark knap",
  },
  {
    href: "/about",
    title: "about",
    detail: "/about",
    group: "get started",
    haystack: "about mdxcn mdxcn keshav bagaade mit open source",
  },
  {
    href: "/shadcn-labs",
    title: "announcement",
    detail: "/shadcn-labs",
    group: "get started",
    haystack:
      "shadcn labs announcement termcn pdfcn startercn skills ecosystem registry",
  },
  {
    href: "/contact",
    title: "contact",
    detail: "/contact",
    group: "get started",
    haystack: "contact email hi@kshv.me github issues",
  },
  {
    href: "/privacy",
    title: "privacy",
    detail: "/privacy",
    group: "get started",
    haystack: "privacy analytics vercel github stars",
  },
  {
    href: "/openapi.json",
    title: "openapi",
    detail: "/openapi.json",
    group: "get started",
    haystack: "openapi swagger api json catalog function calling",
  },
  ...getStarted.map((item) => ({
    href: item.href,
    title: item.label,
    detail: item.href,
    group: "get started",
    haystack:
      item.href === "/docs/skill"
        ? "skill /docs/skill cursor claude codex opencode agent skill.md recipes"
        : item.href === "/docs/comark"
          ? "comark yaml graph-comark adapter streaming ::graph markdown"
          : item.href === "/docs/knap"
            ? "knap graph-knap filter graph_timeline createEngine template markdown"
            : `${item.label} ${item.href}`.toLowerCase(),
  })),
  ...recipes.map((item) => ({
    href: `/docs/examples#${item.slug}`,
    title: item.title,
    detail: item.blurb,
    group: "examples",
    haystack:
      `${item.title} ${item.blurb} ${item.story} ${item.tags.join(" ")}`.toLowerCase(),
  })),
  ...components.map((item) => ({
    href: `/docs/${item.slug}`,
    title: item.title,
    detail: item.name,
    group: "components",
    haystack:
      `${item.title} ${item.name} ${item.slug} ${item.description}`.toLowerCase(),
  })),
]

function SiteSearch() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [mod, setMod] = useState("Ctrl")

  useEffect(() => {
    const mac =
      /mac/i.test(navigator.platform) || /mac/i.test(navigator.userAgent)
    setTimeout(() => {
      setMod(mac ? "⌘" : "Ctrl")
    }, 0)
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.defaultPrevented) {
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) {
      return HITS
    }

    return HITS.filter((item) => item.haystack.includes(needle))
  }, [query])

  useEffect(() => {
    setTimeout(() => {
      setActive(0)
    }, 0)
  }, [query, open])

  useEffect(() => {
    if (!open) {
      return
    }

    requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    document
      .getElementById(`search-hit-${active}`)
      ?.scrollIntoView({ block: "nearest" })
  }, [active, open])

  function go(href: string) {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((index) => Math.min(index + 1, Math.max(results.length - 1, 0)))
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((index) => Math.max(index - 1, 0))
    }

    if (event.key === "Enter") {
      event.preventDefault()
      const hit = results[active]
      if (hit) {
        go(hit.href)
      }
    }
  }

  const groups = useMemo(() => {
    const seen: { label: string; items: { hit: Hit; index: number }[] }[] = []

    results.forEach((hit, index) => {
      const last = seen[seen.length - 1]
      if (last?.label === hit.group) {
        last.items.push({ hit, index })
        return
      }

      seen.push({ label: hit.group, items: [{ hit, index }] })
    })

    return seen
  }, [results])

  return (
    <Dialog.Root
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setQuery("")
          setActive(0)
        }
      }}
      open={open}
    >
      <Dialog.Trigger
        nativeButton={false}
        render={
          <HeaderButton
            aria-keyshortcuts="Meta+K Control+K"
            className="lg:w-auto lg:gap-2 lg:px-2"
            label="Search"
          />
        }
      >
        <HugeiconsIcon
          className="size-5 shrink-0 sm:size-4"
          icon={Search01Icon}
          size={20}
          strokeWidth={1.5}
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "graph-motion fixed inset-0 z-50 bg-background/80",
            "transition-opacity duration-200 ease-out-cubic",
            "data-ending-style:opacity-0 data-starting-style:opacity-0"
          )}
        />
        <Dialog.Popup
          className={cn(
            "graph-motion fixed inset-0 z-50 flex flex-col bg-background",
            "sm:inset-auto sm:top-[18%] sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2",
            "sm:site-rail",
            "origin-top transition-[opacity,transform] duration-200 ease-out-cubic",
            "data-starting-style:scale-95 data-starting-style:opacity-0",
            "data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-150"
          )}
        >
          <SiteCorners className="max-sm:hidden" />
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-dashed border-site-rail px-4">
            <HugeiconsIcon
              className="size-5 shrink-0 text-graph-muted sm:size-4"
              icon={Search01Icon}
              size={20}
              strokeWidth={1.5}
            />
            <input
              aria-activedescendant={
                results[active] ? `search-hit-${active}` : undefined
              }
              aria-autocomplete="list"
              aria-controls="search-results"
              aria-expanded={open}
              aria-label="Search"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none sm:h-12"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search"
              ref={inputRef}
              role="combobox"
              spellCheck={false}
              type="search"
              value={query}
            />
            <Dialog.Close className="relative shrink-0 py-2 text-muted-foreground hover:text-foreground sm:hidden">
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
              />
              Cancel
            </Dialog.Close>
          </div>
          <div
            className="scrollbar-graph min-h-0 flex-1 overflow-y-auto p-2 sm:max-h-[min(24rem,60vh)]"
            id="search-results"
            role="listbox"
          >
            {results.length === 0 ? (
              <p className="px-3 py-6 text-muted-foreground">
                Nothing matches.
              </p>
            ) : (
              groups.map((group) => (
                <div className="flex flex-col gap-1 py-2" key={group.label}>
                  <p className="px-3 font-mono tracking-wide text-graph-muted">
                    {group.label}
                  </p>
                  <ul className="flex flex-col" role="presentation">
                    {group.items.map(({ hit, index }) => {
                      const selected = index === active

                      return (
                        <li key={hit.href} role="presentation">
                          <button
                            aria-selected={selected}
                            className={cn(
                              "flex w-full flex-col gap-0.5 px-3 py-2.5 text-left sm:py-2",
                              selected
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                            id={`search-hit-${index}`}
                            onClick={() => go(hit.href)}
                            onMouseEnter={() => setActive(index)}
                            role="option"
                            type="button"
                          >
                            <span className="text-foreground">{hit.title}</span>
                            <span className="font-mono text-graph-muted">
                              {hit.detail}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { SiteSearch }
