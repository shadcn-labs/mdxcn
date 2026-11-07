import type { Metadata } from "next"

import { SectionHeading } from "@/components/docs/section-heading"
import { Command, CopyBlock, InstallCommand } from "@/components/docs/install"
import { DocsPageHeader } from "@/components/docs/page-header"
import {
  InlineCode,
  ProseLead,
  ProseP,
  TextLink,
} from "@/components/site/prose"
import { JsonLd } from "@/components/seo/json-ld"
import {
  KNAP_API_URL,
  KNAP_DESCRIPTION,
  KNAP_REPO,
  KNAP_SUBSET,
  KNAP_URL,
  KNAP_WIRE,
} from "@/lib/docs/knap"
import { pageMeta, webPageJsonLd } from "@/lib/seo"

const extra = `## install

pnpm dlx shadcn@latest add @mdxcn/all

The filters ship as graph-knap. If you installed all.json, you already have them. Knap itself is a separate package:

pnpm add knap

## wire

${KNAP_WIRE}

## filters

graph_table, graph_timeline, graph_meter, …, one per graph except Frame. Piped value is the React props object. A string param is the title. Pass comark to emit a ::graph-* block. Graphs with no fenced ASCII (flow, plot, activity, heatmap, calendar, timer, countdown) emit Comark YAML by default.

## cli

npx knap render uses standardFilters only. Custom graph filters exist in createEngine, not in the CLI.

## hosts

The output is plain Markdown, so GitHub and READMEs show the text figure as is. If you asked for comark output, a Comark app renders the ::graph-* block.`

export const metadata: Metadata = pageMeta({
  title: "knap",
  description: KNAP_DESCRIPTION,
  path: "/docs/knap",
})

export default function KnapDocsPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <JsonLd
        data={webPageJsonLd({
          name: "Knap",
          description: KNAP_DESCRIPTION,
          path: "/docs/knap",
        })}
      />
      <DocsPageHeader
        copy={{
          description: KNAP_DESCRIPTION,
          extra,
          registry: "graph-knap",
          title: "knap",
        }}
        kicker="graph-knap"
        lead={
          <ProseLead>
            Turn data into figures inside a{" "}
            <TextLink href={KNAP_URL}>Knap</TextLink> template. Pipe your data
            through a <InlineCode>graph_*</InlineCode> filter and it prints the
            plain-text figure, or a <InlineCode>::graph-*</InlineCode> block if
            you&apos;re rendering with Comark.
          </ProseLead>
        }
        title="knap"
      />

      <section className="flex flex-col gap-4">
        <SectionHeading id="install">install</SectionHeading>
        <ProseP>
          Three names are involved. <TextLink href={KNAP_URL}>Knap</TextLink> is
          the templating language, installed from npm.{" "}
          <InlineCode>graph-knap</InlineCode> is the set of filters you copy
          from this registry, and <InlineCode>graph_*</InlineCode> is what you
          type in templates. Install the graphs first;{" "}
          <InlineCode>all.json</InlineCode> already includes the filters.
        </ProseP>
        <InstallCommand name="graph-knap" />
        <Command label="knap" value="pnpm add knap" />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="wire">wire</SectionHeading>
        <ProseP>
          Add <InlineCode>graphFilters</InlineCode> to{" "}
          <InlineCode>createEngine</InlineCode> alongside{" "}
          <InlineCode>standardFilters</InlineCode>. The filters run
          synchronously and read <InlineCode>context.rawValue</InlineCode>, so
          arrays reach them as arrays rather than strings. The{" "}
          <TextLink href={KNAP_URL}>Knap</TextLink> CLI doesn&apos;t load custom
          filters, so this only works through the engine.
        </ProseP>
        <CopyBlock label="engine" value={KNAP_WIRE} />
        <Command label="subset" value={KNAP_SUBSET} />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="author">author</SectionHeading>
        <ProseP>
          The value you pipe in is the same props object the React component
          takes, and a string argument sets the title. Every component page has
          a Knap tab with a template, sample JSON, and the Markdown it produces.
        </ProseP>
        <CopyBlock
          label="template"
          value={`{{ events | graph_timeline:"NIGHT" }}

{{ coverage | graph_meter:"SHIPPED" }}

{{ night | graph_timeline:"comark" }}`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="format">format</SectionHeading>
        <ProseP>
          By default a filter prints the plain-text figure in a code block. Pass{" "}
          <InlineCode>comark</InlineCode> to get a{" "}
          <InlineCode>::graph-*</InlineCode> block instead. Flow, Plot,
          Activity, Heatmap, Calendar, Timer and Countdown have no plain-text
          version, so they always print Comark YAML. If you need text output,
          pick a different graph.
        </ProseP>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="validate">validate</SectionHeading>
        <ProseP>
          Pass <InlineCode>graphFilterMetadata</InlineCode> to{" "}
          <InlineCode>validateFilters</InlineCode> and a misspelled{" "}
          <InlineCode>graph_*</InlineCode> name is reported just like an unknown
          standard filter. Limits, resolvers and{" "}
          <InlineCode>allowRegex</InlineCode> are configured in{" "}
          <TextLink href={KNAP_API_URL}>Knap</TextLink> as usual.
        </ProseP>
        <CopyBlock
          label="editor"
          value={`import { parse, standardFilterMetadata, validateFilters } from "knap"
import { graphFilterMetadata } from "@/registry/default/graph-knap/graph-knap"

const parsed = parse(template)
const filterErrors = validateFilters(parsed.ast, {
  ...standardFilterMetadata,
  ...graphFilterMetadata,
})`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="hosts">hosts</SectionHeading>
        <ProseP>
          The output is plain Markdown, so GitHub, Linear, Obsidian and READMEs
          all show the text figure as is. If you asked for Comark output, a
          Comark app renders the <InlineCode>::graph-*</InlineCode> block. Knap
          itself lives at <TextLink href={KNAP_REPO}>obsidianmd/knap</TextLink>.
        </ProseP>
      </section>
    </div>
  )
}
