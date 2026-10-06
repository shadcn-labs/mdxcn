"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { Cancel01Icon, MenuIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { HeaderButton } from "@/components/site/header-button"
import { LabsBanner } from "@/components/site/labs"
import { SiteSearch } from "@/components/site/search"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { GithubStarLink } from "@/components/site/github-star"
import { SiteCorners, SiteMark, SiteRule } from "@/components/site/corners"
import { Mark, MARK_THEME } from "@/lib/og/mark"
import { SITE_NAV } from "@/lib/site"
import { cn } from "@/lib/utils"

function SiteHeader({ stars }: { stars: number | null }) {
  const pathname = usePathname()
  const docs = pathname.startsWith("/docs")

  return (
    <header className="sticky top-0 z-40">
      {pathname === "/shadcn-labs" ? null : <LabsBanner />}
      <div className="relative bg-background/40 backdrop-blur-sm">
        <SiteRule className="bottom-0 z-20" />
        <div className="relative isolate mx-auto w-full max-w-6xl min-w-0 px-4 sm:px-6 lg:px-8">
          <SiteRule className="left-0 z-20" orientation="y" />
          <SiteRule className="right-0 z-20" orientation="y" />
          <SiteCorners />
          {docs ? (
            <SiteMark className="bottom-0 left-64 -translate-x-1/2 translate-y-1/2 max-lg:hidden" />
          ) : null}
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <Link
                aria-label="Homepage"
                className="flex shrink-0 items-center gap-2.5 text-foreground"
                href="/"
              >
                <Mark className="size-4" palette={MARK_THEME} size={16} />
                mdxcn
              </Link>

              <nav aria-label="Primary" className="max-lg:hidden">
                <ul className="flex items-center gap-4" role="list">
                  {SITE_NAV.map((item) => (
                    <li key={item.href}>
                      <Link
                        className="text-muted-foreground hover:text-foreground"
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <SiteSearch />
              <GithubStarLink className="max-lg:hidden" stars={stars} />
            </div>
          </div>
        </div>
        <Dialog.Root>
          <Dialog.Trigger
            nativeButton={false}
            render={<HeaderButton className="lg:hidden" label="Open menu" />}
          >
            <HugeiconsIcon
              className="size-5 shrink-0"
              icon={MenuIcon}
              size={20}
              strokeWidth={1.5}
            />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Popup
              className={cn(
                "graph-motion fixed inset-0 z-50 flex flex-col gap-10 bg-background p-4",
                "origin-top-right transition-[opacity,transform] duration-200 ease-out-cubic",
                "data-starting-style:scale-95 data-starting-style:opacity-0",
                "data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-150"
              )}
            >
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-foreground">menu</Dialog.Title>
                <Dialog.Close
                  nativeButton={false}
                  render={<HeaderButton label="Close menu" />}
                >
                  <HugeiconsIcon
                    className="size-5 shrink-0"
                    icon={Cancel01Icon}
                    size={20}
                    strokeWidth={1.5}
                  />
                </Dialog.Close>
              </div>
              <ul className="flex flex-col gap-6" role="list">
                {SITE_NAV.map((item) => (
                  <li key={item.href}>
                    <Dialog.Close
                      nativeButton={false}
                      render={
                        <Link
                          className="text-2xl text-foreground"
                          href={item.href}
                        />
                      }
                    >
                      {item.label}
                    </Dialog.Close>
                  </li>
                ))}

                <li>
                  <div className="text-2xl">
                    <GithubStarLink stars={stars} />
                  </div>
                </li>
              </ul>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  )
}

export { SiteHeader }
