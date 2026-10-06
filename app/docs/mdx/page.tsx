import type { Metadata } from "next"

import { CopyBlock, InstallCommand } from "@/components/docs/install"
import { DocsPageHeader } from "@/components/docs/page-header"
import {
  Annotate,
  Callout,
  Footnotes,
  Quote,
  Terminal,
} from "@/components/graphs"
import {
  InlineCode,
  ProseLead,
  ProseP,
  TextLink,
} from "@/components/site/prose"
import { JsonLd } from "@/components/seo/json-ld"
import {
  MDX_BEFORE,
  MDX_DESCRIPTION,
  MDX_OPTIONS,
  MDX_OVERRIDE,
  MDX_WHY,
  MDX_WIRE,
} from "@/lib/docs/mdx-wiring"
import { pageMeta, webPageJsonLd } from "@/lib/seo"

const extra = `## install

pnpm dlx shadcn@latest add @mdxcn/mdx

all.json already includes it.

## wire

${MDX_WIRE}

## upgrades

${MDX_BEFORE}

## overrides

${MDX_WHY}

${MDX_OVERRIDE}

## options

${MDX_OPTIONS}`

export const metadata: Metadata = pageMeta({
  title: "mdx",
  description: MDX_DESCRIPTION,
  path: "/docs/mdx",
})

export default function MdxDocsPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <JsonLd
        data={webPageJsonLd({
          name: "MDX",
          description: MDX_DESCRIPTION,
          path: "/docs/mdx",
        })}
      />
      <DocsPageHeader
        copy={{
          description: MDX_DESCRIPTION,
          extra,
          registry: "mdx",
          title: "mdx",
        }}
        kicker="withMdxcn"
        lead={
          <ProseLead>
            wrap your mdx components once. tags you swap still parse, and plain
            markdown alerts, bylines, shell sessions, and footnotes get a frame.
            github still renders the original.
          </ProseLead>
        }
        title="mdx"
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">install</h2>
        <ProseP>
          <InlineCode>all.json</InlineCode> already includes it. alone it brings
          callout, quote, and terminal with it.
        </ProseP>
        <InstallCommand name="mdx" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">wire</h2>
        <Annotate title="mdx-components.tsx">
          <pre>
            <code className="language-tsx">{`import { withMdxcn } from "@/registry/default/mdx/mdx" // (1)
import { GraphTimeline } from "@/registry/default/graph-timeline/graph-timeline"

export function useMDXComponents(components) {
  return withMdxcn({ ...components, GraphTimeline }) // (2)
}`}</code>
          </pre>
          <ol>
            <li>
              Runs on the server. The file has no &quot;use client&quot;; the
              frames it swaps in are client components.
            </li>
            <li>
              Register the parents you use. Lists and tables inside them need no
              imports.
            </li>
          </ol>
        </Annotate>
        <CopyBlock label="mdx-components.tsx" value={MDX_WIRE} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">upgrades</h2>
        <ProseP>
          write markdown that already reads right on github. on your site it
          becomes the frame below. the full list is on{" "}
          <TextLink href="/docs/grammar">grammar</TextLink>.
        </ProseP>
        <CopyBlock label="page.mdx" value={MDX_BEFORE} />
        <Callout type="warning">
          <p>The CLI copies files. Edit the source.</p>
        </Callout>
        <Quote by="Dieter Rams">
          <p>Less, but better.</p>
        </Quote>
        <Terminal prompt="$">{`$ pnpm dlx shadcn@latest add @mdxcn/mdx
✓ 7 files written`}</Terminal>
        <Footnotes>
          <h2 className="sr-only" id="footnote-label">
            Footnotes
          </h2>
          <ol>
            <li id="user-content-fn-1">
              <p>SVG does not survive a README.</p>
            </li>
          </ol>
        </Footnotes>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">overrides</h2>
        <ProseP>{MDX_WHY}</ProseP>
        <CopyBlock label="mdx-components.tsx" value={MDX_OVERRIDE} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">options</h2>
        <ProseP>
          each upgrade is on by default. turn off the ones you style yourself.
        </ProseP>
        <CopyBlock label="options" value={MDX_OPTIONS} />
      </section>
    </div>
  )
}
