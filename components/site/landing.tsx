import Link from "next/link"
import type { ReactNode } from "react"

import { HeroInstall } from "@/components/site/hero-install"
import { SiteContainer } from "@/components/site/container"
import { SiteRule } from "@/components/site/corners"
import { ProseLead, ProseMuted } from "@/components/site/prose"
import { addQueryParams } from "@/lib/url"
import { UTM_PARAMS } from "@/lib/site"
import { cn } from "@/lib/utils"

type LandingAction = {
  href: string
  label: string
}

function LandingHero({
  title,
  lead,
  item,
  command,
  actions,
  figure,
  split = false,
}: {
  title: string
  lead: ReactNode
  item?: string
  command?: string
  actions?: readonly LandingAction[]
  figure: ReactNode
  split?: boolean
}) {
  const copy = (
    <>
      <h1 className="max-w-[16ch] text-4xl font-medium tracking-tighter text-balance sm:text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h1>
      <ProseLead>{lead}</ProseLead>
      {command != null || item != null ? (
        <HeroInstall className="max-w-none" command={command} item={item} />
      ) : null}
      {actions && actions.length > 0 ? (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {actions.map((action) => (
            <LandingLink href={action.href} key={action.href}>
              {action.label}
            </LandingLink>
          ))}
        </div>
      ) : null}
    </>
  )

  return (
    <section>
      <SiteContainer
        borderTop={false}
        className="py-8 sm:py-16 md:py-24 lg:py-32"
      >
        {split ? (
          <div className="grid items-stretch gap-12 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] lg:gap-0">
            <div className="flex min-w-0 flex-col items-start gap-4 lg:pr-12">
              {copy}
            </div>
            <div
              aria-hidden="true"
              className="relative hidden min-h-48 lg:block"
            >
              <SiteRule className="inset-y-0 left-0" orientation="y" />
            </div>
            <div className="relative flex min-w-0 items-center pt-12 lg:pt-0 lg:pl-12">
              <SiteRule className="top-0 lg:hidden" />
              <div className="w-full">{figure}</div>
            </div>
          </div>
        ) : (
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex min-w-0 flex-col items-start gap-4">
              {copy}
            </div>
            <div className="min-w-0">{figure}</div>
          </div>
        )}
      </SiteContainer>
    </section>
  )
}

function LandingSection({
  title,
  lead,
  muted,
  id,
  children,
}: {
  title?: string
  lead?: ReactNode
  muted?: ReactNode
  id?: string
  children: ReactNode
}) {
  return (
    <section id={id}>
      <SiteContainer className="flex flex-col gap-8">
        {title || lead || muted ? (
          <div className="flex flex-col gap-4">
            {title ? (
              <h2 className="max-w-[35ch] text-2xl font-semibold tracking-tight text-balance">
                {title}
              </h2>
            ) : null}
            {lead}
            {muted ? <ProseMuted>{muted}</ProseMuted> : null}
          </div>
        ) : null}
        {children}
      </SiteContainer>
    </section>
  )
}

function LandingLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const cls = cn(
    "text-foreground underline-offset-4 hover:underline",
    className
  )

  if (href.startsWith("http") || href.startsWith("mailto:")) {
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

function LandingLinks({ items }: { items: readonly LandingAction[] }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((item) => (
        <LandingLink href={item.href} key={item.href}>
          {item.label}
        </LandingLink>
      ))}
    </div>
  )
}

export { LandingHero, LandingLink, LandingLinks, LandingSection }
export type { LandingAction }
