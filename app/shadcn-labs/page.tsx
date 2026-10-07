import type { Metadata } from "next"

import { JsonLd } from "@/components/seo/json-ld"
import {
  LandingHero,
  LandingLinks,
  LandingSection,
} from "@/components/site/landing"
import { FrameBox } from "@/components/site/corners"
import { HeroInstall } from "@/components/site/hero-install"
import { LabsDirectory, LabsLogo } from "@/components/site/labs"
import { ProseP } from "@/components/site/prose"
import { LABS_ANNOUNCEMENT, LABS_INSTALL } from "@/lib/agent/copy"
import { GITHUB_URL } from "@/lib/github"
import { pageMeta, webPageJsonLd } from "@/lib/seo"
import { addQueryParams } from "@/lib/url"
import { UTM_PARAMS } from "@/lib/site"
import {
  SHADCN_LABS_URL,
  SHADCN_LABS_X,
  SHADCN_UI_URL,
  SHADCN_URL,
} from "@/lib/shadcn-labs"

const description = LABS_ANNOUNCEMENT.join(" ")

export const metadata: Metadata = pageMeta({
  title: "announcement",
  description,
  path: "/shadcn-labs",
})

export default function ShadcnLabsPage() {
  return (
    <main id="main">
      <JsonLd
        data={webPageJsonLd({
          name: "Shadcn Labs announcement",
          description,
          path: "/shadcn-labs",
        })}
      />
      <LandingHero
        actions={[
          { href: SHADCN_LABS_URL, label: "shadcn-labs.com" },
          { href: GITHUB_URL, label: "github" },
        ]}
        figure={
          <FrameBox className="flex items-center justify-center px-8 py-12 sm:px-12 sm:py-16">
            <a
              href={addQueryParams(SHADCN_LABS_URL, UTM_PARAMS)}
              rel="noreferrer"
              target="_blank"
            >
              <LabsLogo className="h-8 w-auto sm:h-9" />
            </a>
          </FrameBox>
        }
        lead={LABS_ANNOUNCEMENT[0]}
        split
        title="shadcn labs"
      />
      <LandingSection>
        {LABS_ANNOUNCEMENT.slice(1).map((para) => (
          <ProseP key={para}>{para}</ProseP>
        ))}
        <HeroInstall className="mt-0 max-w-xl" command={LABS_INSTALL} />
        <LabsDirectory />
        <LandingLinks
          items={[
            { href: SHADCN_LABS_URL, label: "shadcn-labs.com" },
            { href: SHADCN_LABS_X, label: "@shadcnlabs" },
            { href: SHADCN_UI_URL, label: "shadcn/ui" },
            { href: SHADCN_URL, label: "shadcn" },
          ]}
        />
      </LandingSection>
    </main>
  )
}
