/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"

import { SiteRule } from "@/components/site/corners"
import { Button } from "@/components/ui/button"
import { SHADCN_LABS_GROUPS, SHADCN_LABS_NOTE } from "@/lib/shadcn-labs"
import { cn } from "@/lib/utils"

const footerLinkClass =
  "font-normal text-muted-foreground hover:text-foreground"

function LabsLogo({ className }: { className?: string }) {
  return (
    <img
      alt="Shadcn Labs"
      className={cn("h-6 w-auto dark:invert", className)}
      height={60}
      src="/shadcn-labs-brand/shadcn-labs-logotype.svg"
      width={554}
    />
  )
}

function LabsBanner() {
  return (
    <div
      aria-label="Announcement"
      className="relative bg-background"
      role="region"
    >
      <div className="px-4 py-2 text-center sm:px-6">
        <div className="mx-auto max-w-6xl text-sm text-muted-foreground">
          <img
            alt=""
            className="mr-2 inline size-3.5 align-text-bottom dark:invert"
            height={14}
            src="/shadcn-labs-brand/shadcn-labs-logomark.svg"
            width={14}
          />
          <span className="text-foreground">mdxcn has joined shadcn labs.</span>{" "}
          <Button
            className="ml-1 align-middle"
            nativeButton={false}
            render={<Link href={SHADCN_LABS_NOTE} />}
            size="xs"
            variant="outline"
          >
            details
          </Button>
        </div>
      </div>
      <SiteRule className="bottom-0" />
    </div>
  )
}

function LabsDirectory() {
  return (
    <div className="flex flex-col gap-6">
      {SHADCN_LABS_GROUPS.map((group) => (
        <div className="flex flex-col gap-3" key={group.label}>
          <p className="text-foreground">{group.label}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2" role="list">
            {group.projects.map((project) => (
              <li key={project.href}>
                <a
                  className={footerLinkClass}
                  href={project.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {project.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export { LabsBanner, LabsDirectory, LabsLogo }
