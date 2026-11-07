import type { Metadata } from "next"

import { SectionHeading } from "@/components/docs/section-heading"
import { Command, CopyBlock, InstallCommand } from "@/components/docs/install"
import { DocsPageHeader } from "@/components/docs/page-header"
import {
  InlineCode,
  ProseLead,
  ProseMuted,
  ProseP,
  TextLink,
} from "@/components/site/prose"
import { JsonLd } from "@/components/seo/json-ld"
import {
  COMARK_DEMO_REPO,
  COMARK_DEMO_URL,
  COMARK_DESCRIPTION,
  COMARK_URL,
  COMARK_WIRE,
} from "@/lib/docs/comark"
import { pageMeta, webPageJsonLd } from "@/lib/seo"

const extra = `## install

pnpm dlx shadcn@latest add @mdxcn/all

The adapter is graph-comark. If you installed all.json, you already have it.

## wire

${COMARK_WIRE}

## coerce

Markdown attributes are always strings, so {value=0.86} arrives as "0.86". Arrays and objects in YAML keep their types. coerceProps turns listed numeric props into numbers, maps class to className, and strips a leading colon from Vue-style keys.

## stream

Auto-close completes a dangling ::graph-table. YAML is all-or-nothing, but a timeline grows one event at a time. A prefix that cuts off mid-key can throw YAMLException, so keep the last tree that parsed. If required props are missing, the graph renders an empty frame instead of calling rows.map on undefined.

## hosts

GitHub, Linear, and a README still get the fenced ASCII. They do not run Comark.`

export const metadata: Metadata = pageMeta({
  title: "comark",
  description: COMARK_DESCRIPTION,
  path: "/docs/comark",
})

export default function ComarkDocsPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <JsonLd
        data={webPageJsonLd({
          name: "Comark",
          description: COMARK_DESCRIPTION,
          path: "/docs/comark",
        })}
      />
      <DocsPageHeader
        copy={{
          description: COMARK_DESCRIPTION,
          extra,
          registry: "graph-comark",
          title: "comark",
        }}
        kicker="graph-comark"
        lead={
          <ProseLead>
            Write figures as <InlineCode>::graph-*</InlineCode> blocks in plain
            Markdown. <TextLink href={COMARK_URL}>Comark</TextLink> parses the
            file and these graphs draw the frames, so there&apos;s no MDX
            compile step anywhere.
          </ProseLead>
        }
        title="comark"
      >
        <ProseMuted>
          For a side-by-side of source and output, see{" "}
          <TextLink href="/comark">/comark</TextLink>. Every graph rendered
          through Comark is in the{" "}
          <TextLink href={COMARK_DEMO_URL}>comark demo</TextLink>.
        </ProseMuted>
      </DocsPageHeader>

      <section className="flex flex-col gap-4">
        <SectionHeading id="install">install</SectionHeading>
        <ProseP>
          Install the graphs first. <InlineCode>all.json</InlineCode> includes
          the Comark adapter, so if you used it you&apos;re done. If the graphs
          are already in your repo, add <InlineCode>graph-comark</InlineCode> on
          its own.
        </ProseP>
        <InstallCommand name="graph-comark" />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="wire">wire</SectionHeading>
        <ProseP>
          Parse on the server and pass the parsed document to the client, not
          the raw string. That keeps the{" "}
          <TextLink href={COMARK_URL}>Comark</TextLink> parser out of your
          client bundle. The graphs themselves are client components because
          they animate.
        </ProseP>
        <CopyBlock label="server" value={COMARK_WIRE} />
        <Command
          label="subset"
          value={`import { createGraphComponents } from "@/registry/default/graph-comark/graph-comark"
import { GraphTable } from "@/registry/default/graph-table/graph-table"

const graphComponents = createGraphComponents({
  "graph-table": GraphTable,
})`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="author">author</SectionHeading>
        <ProseP>
          Props go in YAML at the top of a <InlineCode>::graph-*</InlineCode>{" "}
          block, with the same names as the React props. To put figures side by
          side, nest them in <InlineCode>::row{"{cols=2}"}</InlineCode>. Every
          component page has a Comark tab with a block you can copy.
        </ProseP>
        <CopyBlock
          label="markdown"
          value={`::graph-meter
---
title: COVERAGE
value: 0.86
ticks: 28
caption: 86% of statements
---
::`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="coerce">coerce</SectionHeading>
        <ProseP>
          Inline Markdown attributes are always strings, so{" "}
          <InlineCode>{"{value=0.86}"}</InlineCode> arrives as{" "}
          <InlineCode>&quot;0.86&quot;</InlineCode>. Arrays and objects in the
          YAML block keep their types. <InlineCode>coerceProps</InlineCode>{" "}
          converts the known numeric props back to numbers, renames{" "}
          <InlineCode>class</InlineCode> to <InlineCode>className</InlineCode>,
          and drops the leading colon from Vue-style keys. The list of numeric
          props for each graph lives in <InlineCode>adapters.ts</InlineCode>.
        </ProseP>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="stream">stream</SectionHeading>
        <ProseP>
          Graphs work with streamed Markdown, like an LLM response arriving a
          token at a time. Comark closes an unfinished{" "}
          <InlineCode>::graph-table</InlineCode> block for you, so it
          doesn&apos;t swallow the rest of the page. YAML only parses once a
          value is complete, so a timeline grows one event at a time. If the
          stream cuts off mid-key the parse can throw, so keep the last tree
          that parsed. A graph missing a required prop draws an empty frame
          instead of crashing, and graphs remount when their data changes so new
          rows still animate in.
        </ProseP>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="hosts">hosts</SectionHeading>
        <ProseP>
          GitHub, Linear and READMEs don&apos;t run Comark, so use the
          plain-text figure from the .md tab there. For a working setup, the{" "}
          <TextLink href={COMARK_DEMO_REPO}>demo repo</TextLink> renders every
          graph from a single file.
        </ProseP>
      </section>
    </div>
  )
}
