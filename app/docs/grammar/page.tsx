import type { Metadata } from "next"

import { SectionHeading } from "@/components/docs/section-heading"
import { CopyBlock } from "@/components/docs/install"
import { DocsPageHeader } from "@/components/docs/page-header"
import { GraphSpec, GraphTimeline } from "@/components/graphs"
import {
  InlineCode,
  ProseLead,
  ProseP,
  TextLink,
} from "@/components/site/prose"
import { JsonLd } from "@/components/seo/json-ld"
import {
  GRAMMAR,
  GRAMMAR_DESCRIPTION,
  GRAMMAR_SAMPLE,
  grammarMarkdown,
  UPGRADES,
} from "@/lib/docs/grammar"
import { toMdxCopy } from "@/lib/docs/mdx"
import { pageMeta, webPageJsonLd } from "@/lib/seo"

export const metadata: Metadata = pageMeta({
  title: "grammar",
  description: GRAMMAR_DESCRIPTION,
  path: "/docs/grammar",
})

function rows(rules: typeof GRAMMAR) {
  return rules.map((rule) => ({
    label: rule.write,
    value: rule.means.replaceAll("`", ""),
    note: rule.read,
  }))
}

export default function GrammarPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <JsonLd
        data={webPageJsonLd({
          name: "Grammar",
          description: GRAMMAR_DESCRIPTION,
          path: "/docs/grammar",
        })}
      />
      <DocsPageHeader
        copy={{
          description: GRAMMAR_DESCRIPTION,
          extra: grammarMarkdown(),
          title: "grammar",
        }}
        kicker="markdown"
        lead={
          <ProseLead>
            Every component reads the same handful of Markdown rules, so once
            you know them you can write any graph. Bold marks what&apos;s
            current, italics mark what&apos;s next,{" "}
            <InlineCode>label: value</InlineCode> makes a row, and{" "}
            <InlineCode>— note</InlineCode> adds a side note.
          </ProseLead>
        }
        title="grammar"
      />

      <section className="flex flex-col gap-4">
        <SectionHeading id="rules">rules</SectionHeading>
        <ProseP>
          Write Markdown inside the tag and the component reads it as data. The
          muted line under each rule lists the components that use it.
        </ProseP>
        <GraphSpec rows={rows(GRAMMAR)} title="GRAMMAR" />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="every-host">every host</SectionHeading>
        <ProseP>
          The same list works everywhere: as MDX children, as the body of a{" "}
          <TextLink href="/docs/comark">Comark</TextLink> block, and as the{" "}
          <InlineCode>body</InlineCode> of a{" "}
          <TextLink href="/docs/knap">Knap</TextLink> content filter. It also
          produces the same plain-text figure for GitHub.
        </ProseP>
        <GraphTimeline title="NIGHT">
          <ul>
            <li>14:02: p95 crossed 800ms — paged the on-call</li>
            <li>
              <strong>14:11: rolled back the cache flag</strong>
            </li>
            <li>
              <em>14:40: write the postmortem</em>
            </li>
          </ul>
        </GraphTimeline>
        <CopyBlock label="page.mdx" value={GRAMMAR_SAMPLE.mdx} />
        <CopyBlock label="comark" value={GRAMMAR_SAMPLE.comark} />
        <CopyBlock label="readme.md" value={toMdxCopy(GRAMMAR_SAMPLE.mdx)} />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="upgrades">upgrades</SectionHeading>
        <ProseP>
          With <TextLink href="/docs/mdx">withMdxcn</TextLink>, some plain
          Markdown that GitHub already understands, like alerts, quotes and
          footnotes, gets drawn in a frame on your site.
        </ProseP>
        <GraphSpec rows={rows(UPGRADES)} title="UPGRADES" />
      </section>
    </div>
  )
}
