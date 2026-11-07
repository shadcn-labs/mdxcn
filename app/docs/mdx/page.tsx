import type { Metadata } from "next"

import { SectionHeading } from "@/components/docs/section-heading"
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

If you installed all.json, you already have it.

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
            Wrap your MDX components once with{" "}
            <InlineCode>withMdxcn</InlineCode>. Graphs keep working even when
            your docs framework replaces standard tags, and ordinary Markdown
            alerts, quotes, shell sessions and footnotes get drawn in a frame.
            GitHub still shows the plain Markdown.
          </ProseLead>
        }
        title="mdx"
      />

      <section className="flex flex-col gap-4">
        <SectionHeading id="install">install</SectionHeading>
        <ProseP>
          If you installed <InlineCode>all.json</InlineCode>, you already have
          it. Installed on its own, it also brings in Callout, Quote and
          Terminal.
        </ProseP>
        <InstallCommand name="mdx" />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="wire">wire</SectionHeading>
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
        <SectionHeading id="upgrades">upgrades</SectionHeading>
        <ProseP>
          Write Markdown that already looks right on GitHub. On your site, it
          renders as the frames below. The full list is on the{" "}
          <TextLink href="/docs/grammar">grammar</TextLink> page.
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
        <SectionHeading id="overrides">overrides</SectionHeading>
        <ProseP>{MDX_WHY}</ProseP>
        <CopyBlock label="mdx-components.tsx" value={MDX_OVERRIDE} />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="options">options</SectionHeading>
        <ProseP>
          Every upgrade is on by default. Turn off any you&apos;d rather style
          yourself.
        </ProseP>
        <CopyBlock label="options" value={MDX_OPTIONS} />
      </section>
    </div>
  )
}
