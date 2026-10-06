import type { Metadata } from "next"

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

The adapter is graph-comark. all.json already includes it.

## wire

${COMARK_WIRE}

## coerce

Markdown attributes are strings. {value=0.86} arrives as "0.86". arrays and objects survive YAML. coerceProps turns listed numeric props into numbers, maps class to className, and strips a leading colon from Vue-style keys.

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
            author figures as <InlineCode>::graph-*</InlineCode> blocks in plain
            markdown; <TextLink href={COMARK_URL}>comark</TextLink> parses the
            file and these graphs draw the frames. there is no mdx compile step.
          </ProseLead>
        }
        title="comark"
      >
        <ProseMuted>
          Landing and live pair: <TextLink href="/comark">/comark</TextLink>.
          Full catalog demo:{" "}
          <TextLink href={COMARK_DEMO_URL}>comark-demo</TextLink>.
        </ProseMuted>
      </DocsPageHeader>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">install</h2>
        <ProseP>
          copy the graphs first. <InlineCode>all.json</InlineCode> already
          includes the adapter. if the graphs are already in the repo, adding{" "}
          <InlineCode>graph-comark</InlineCode> alone is enough.
        </ProseP>
        <InstallCommand name="graph-comark" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">wire</h2>
        <ProseP>
          Parse on the server and pass the document, not the raw string, so the{" "}
          <TextLink href={COMARK_URL}>Comark</TextLink> parser stays out of the
          client bundle. The graphs are{" "}
          <InlineCode>&quot;use client&quot;</InlineCode> because they animate,
          and they arrive as client references.
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
        <h2 className="text-xl font-semibold tracking-tight">author</h2>
        <ProseP>
          Put YAML props on a <InlineCode>::graph-*</InlineCode> block. They
          match the React API. Nest figures in{" "}
          <InlineCode>::row{"{cols=2}"}</InlineCode>. Every docs page has a
          Comark tab with a copy-paste block.
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
        <h2 className="text-xl font-semibold tracking-tight">coerce</h2>
        <ProseP>
          <InlineCode>{"{value=0.86}"}</InlineCode> arrives as{" "}
          <InlineCode>&quot;0.86&quot;</InlineCode>. Arrays and objects in the
          YAML fence stay typed. <InlineCode>coerceProps</InlineCode> turns
          listed numeric props into numbers, maps <InlineCode>class</InlineCode>{" "}
          to <InlineCode>className</InlineCode>, and strips a leading colon from
          Vue-style keys. <InlineCode>adapters.ts</InlineCode> lists the numeric
          props for each tag, matching the <InlineCode>number</InlineCode> props
          in the catalog.
        </ProseP>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">stream</h2>
        <ProseP>
          Auto-close completes a dangling <InlineCode>::graph-table</InlineCode>
          , so a half-written tag does not swallow the rest of the page. YAML is
          all-or-nothing: a timeline grows an event at a time. A prefix that
          cuts mid-key can throw. Hold the last good tree. Missing required
          props render an empty frame instead of crashing. Graphs remount when
          data changes so <InlineCode>once: true</InlineCode> motion does not
          leave new rows at opacity 0.
        </ProseP>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">hosts</h2>
        <ProseP>
          GitHub, Linear, and a README do not run Comark, so they still get the
          code block from the .md tab.{" "}
          <TextLink href={COMARK_URL}>Comark</TextLink> is the renderer;{" "}
          <TextLink href={COMARK_DEMO_REPO}>the demo repo</TextLink> is the full
          catalog in one file.
        </ProseP>
      </section>
    </div>
  )
}
