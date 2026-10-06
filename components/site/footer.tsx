import type { ReactNode } from "react"
import Link from "next/link"
import { SiteContainer } from "@/components/site/container"
import { SiteCorners, SiteRule } from "@/components/site/corners"
import { cn } from "@/lib/utils"
import { LabsDirectory, LabsLogo } from "@/components/site/labs"
import { Mark, MARK_THEME } from "@/lib/og/mark"
import { GITHUB_URL } from "@/lib/github"
import {
  SHADCN_LABS_NOTE,
  SHADCN_LABS_URL,
  SHADCN_LABS_X,
  SHADCN_URL,
} from "@/lib/shadcn-labs"

function FooterBlock({
  children,
  className,
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16",
        className
      )}
      id={id}
    >
      <SiteRule className="top-0" />
      <SiteRule className="bottom-0" />
      <SiteCorners />
      {children}
    </div>
  )
}

function SiteFooter() {
  return (
    <footer>
      <SiteContainer
        className="py-0 sm:py-0"
        containerClassName="px-0 sm:px-0 lg:px-0"
        corners={[]}
      >
        <FooterBlock>
          <Link
            aria-label="Homepage"
            className="flex items-center gap-2.5 text-foreground"
            href="/"
          >
            <Mark className="size-4" palette={MARK_THEME} size={16} />
            mdxcn
          </Link>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-6" role="list">
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  href="/developers"
                  prefetch={false}
                >
                  developer api
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/agents"
                >
                  for agents
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/comark"
                >
                  comark
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/knap"
                >
                  knap
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/docs"
                >
                  docs
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/docs/examples"
                >
                  examples
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/docs/installation"
                >
                  installation
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/docs/skill"
                >
                  skill
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/about"
                >
                  about
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  href={SHADCN_LABS_NOTE}
                  prefetch={false}
                >
                  shadcn labs
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/contact"
                >
                  contact
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/privacy"
                >
                  privacy
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/llms.txt"
                >
                  llms.txt
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  href="/openapi.json"
                >
                  openapi
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  href={GITHUB_URL}
                  rel="noreferrer"
                >
                  source
                </Link>
              </li>
              <li>
                <Link
                  className="font-normal text-muted-foreground hover:text-foreground"
                  href={`${GITHUB_URL}/blob/main/LICENSE`}
                  rel="noreferrer"
                >
                  MIT
                </Link>
              </li>
            </ul>
          </nav>
        </FooterBlock>

        <FooterBlock id="shadcn-labs">
          <div className="flex flex-col gap-4">
            <a href={SHADCN_LABS_URL} rel="noreferrer" target="_blank">
              <LabsLogo />
            </a>
            <p className="max-w-[62ch] text-pretty text-muted-foreground">
              A Shadcn Labs project.{" "}
              <Link
                className="text-foreground hover:text-foreground"
                href={SHADCN_LABS_NOTE}
              >
                announcement
              </Link>
              .
            </p>
            <p className="text-pretty text-muted-foreground">
              not endorsed by or affiliated with{" "}
              <a
                className="text-foreground hover:text-foreground"
                href={SHADCN_URL}
                rel="noreferrer"
                target="_blank"
              >
                shadcn
              </a>
              .
            </p>
          </div>
          <LabsDirectory />
        </FooterBlock>

        <FooterBlock>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-pretty text-muted-foreground">
              © {new Date().getFullYear()}{" "}
              <a
                className="text-foreground hover:text-foreground"
                href={SHADCN_LABS_URL}
                rel="noreferrer"
                target="_blank"
              >
                Shadcn Labs
              </a>
              . mit license.
            </p>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-pretty text-muted-foreground">
              <a
                className="text-foreground hover:text-foreground"
                href={SHADCN_LABS_X}
                rel="noreferrer"
                target="_blank"
              >
                @shadcnlabs
              </a>
              <Link
                className="text-foreground hover:text-foreground"
                href="https://x.com/kshvbgde"
              >
                @kshvbgde
              </Link>
            </p>
          </div>
        </FooterBlock>
      </SiteContainer>
    </footer>
  )
}

export { SiteFooter }
