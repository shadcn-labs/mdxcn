import type { Metadata } from "next"

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
            every component reads the same markdown, so the rules carry over.
            bold is now, italic is next, <InlineCode>label: value</InlineCode>{" "}
            is a row, and <InlineCode>— note</InlineCode> is a side note.
          </ProseLead>
        }
        title="grammar"
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">rules</h2>
        <ProseP>
          write markdown inside the tag. the component reads it as data. the
          muted line under each rule is who reads it.
        </ProseP>
        <GraphSpec rows={rows(GRAMMAR)} title="GRAMMAR" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">every host</h2>
        <ProseP>
          the same list is mdx children, the body of a{" "}
          <TextLink href="/docs/comark">comark</TextLink> block, and the{" "}
          <InlineCode>body</InlineCode> of a{" "}
          <TextLink href="/docs/knap">knap</TextLink> content filter. it draws
          the same fenced ascii for github.
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
        <h2 className="text-xl font-semibold tracking-tight">upgrades</h2>
        <ProseP>
          with <TextLink href="/docs/mdx">withMdxcn</TextLink>, plain markdown
          that github already renders becomes a frame on your site.
        </ProseP>
        <GraphSpec rows={rows(UPGRADES)} title="UPGRADES" />
      </section>
    </div>
  )
}
