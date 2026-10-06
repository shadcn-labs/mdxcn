import type { Metadata } from "next"

import { SourcePreview } from "@/components/comark/source-preview"
import {
  GraphCheck,
  GraphCompare,
  GraphTimeline,
  GraphUptime,
} from "@/components/graphs"
import { JsonLd } from "@/components/seo/json-ld"
import {
  LandingHero,
  LandingLinks,
  LandingSection,
} from "@/components/site/landing"
import { PipelineFigure } from "@/components/site/pipeline-figure"
import {
  InlineCode,
  ProseMuted,
  ProseP,
  proseMutedClass,
  TextLink,
} from "@/components/site/prose"
import {
  KNAP_API_URL,
  KNAP_DEMO_DATA,
  KNAP_DEMO_TEMPLATE,
  KNAP_DESCRIPTION,
  KNAP_REPO,
  KNAP_URL,
} from "@/lib/docs/knap"
import { pageMeta, webPageJsonLd } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = pageMeta({
  title: "knap",
  description: KNAP_DESCRIPTION,
  path: "/knap",
})

const steps = [
  {
    name: "data",
    detail: (
      <>
        pass plain json (or any variables{" "}
        <TextLink href={KNAP_API_URL}>knap</TextLink> can resolve). the filter
        reads the typed value, not a schema this library invented.
      </>
    ),
  },
  {
    name: "filter",
    detail: (
      <>
        pipe the graph props through <InlineCode>graph_timeline</InlineCode>,{" "}
        <InlineCode>graph_meter</InlineCode>, and the rest. a string param is
        the title. pass <InlineCode>comark</InlineCode> for a{" "}
        <InlineCode>::graph-*</InlineCode> block.
      </>
    ),
  },
  {
    name: "markdown",
    detail: (
      <>
        output is the official fenced ascii, the same drawing as the .md tab.
        obsidian, github, and a readme can open it. graphs with no ascii emit
        comark yaml instead.
      </>
    ),
  },
]

function KnapPipeline() {
  return (
    <PipelineFigure
      label="knap filter: props in, official fence or a ::graph-* block out"
      stages={[
        {
          id: "data",
          name: "data",
          nodes: [
            { label: "json", hint: "props object" },
            { label: "events[]", hint: "timeline" },
            { label: "days[]", hint: "uptime" },
            { label: "title", hint: "string param" },
          ],
        },
        {
          id: "filter",
          name: "filter",
          fanIn: true,
          nodes: [
            { label: "graph_timeline", hint: "createEngine" },
            { label: "graph_uptime", hint: "same api as react" },
          ],
        },
        {
          id: "emit",
          name: "emit",
          fanIn: true,
          nodes: [
            {
              label: "fenced ascii",
              hint: "readme / github / linear",
              accent: true,
            },
            {
              label: "::graph-*",
              hint: "pass comark · no ascii",
            },
          ],
        },
      ]}
      title="filter"
    />
  )
}

export default function KnapPage() {
  return (
    <main id="main">
      <JsonLd
        data={webPageJsonLd({
          name: "Knap",
          description: KNAP_DESCRIPTION,
          path: "/knap",
        })}
      />
      <LandingHero
        actions={[
          { href: "/docs/knap", label: "read the wiring" },
          { href: KNAP_URL, label: "knap.md" },
        ]}
        figure={<KnapPipeline />}
        item="graph-knap"
        lead={
          <>
            pipe a props object through a <InlineCode>graph_*</InlineCode>{" "}
            filter. <TextLink href={KNAP_URL}>knap</TextLink> renders markdown
            and these filters draw the framed code block. the knap cli does not
            load custom filters, so you add them in your own app.
          </>
        }
        title="graphs from a knap template"
      />

      <LandingSection
        lead={
          <ProseP>
            same incident as the comark landing. here the source is a{" "}
            <TextLink href={KNAP_URL}>knap</TextLink> template; the rendered
            side is the react graphs. toggle to read the template that emitted
            the fences.
          </ProseP>
        }
        title="template and the frames it produces"
      >
        <SourcePreview source={KNAP_DEMO_TEMPLATE}>
          <ProseMuted>
            p95 crossed 800ms at {KNAP_DEMO_DATA.start}. rollback at{" "}
            {KNAP_DEMO_DATA.rollback}.
          </ProseMuted>
          <GraphTimeline events={[...KNAP_DEMO_DATA.events]} title="NIGHT" />
          <ProseMuted>same night, and the two days users felt it.</ProseMuted>
          <GraphUptime
            days={[...KNAP_DEMO_DATA.uptime.days]}
            from={KNAP_DEMO_DATA.uptime.from}
            title={KNAP_DEMO_DATA.uptime.title}
            to={KNAP_DEMO_DATA.uptime.to}
          />
        </SourcePreview>
      </LandingSection>

      <LandingSection
        lead={
          <ProseP>
            you own three files: templating stays in{" "}
            <TextLink href={KNAP_URL}>knap</TextLink>, the graphs stay copied
            via shadcn if you also render react, and the filters are the only
            new piece.
          </ProseP>
        }
        title="how the pieces fit"
      >
        <dl className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {steps.map((entry) => (
            <div className="flex flex-col gap-2" key={entry.name}>
              <dt className="font-medium">{entry.name}</dt>
              <dd className={cn(proseMutedClass, "max-w-[40ch]")}>
                {entry.detail}
              </dd>
            </div>
          ))}
        </dl>
      </LandingSection>

      <LandingSection
        lead={
          <ProseP>
            knap is a generator. it writes the fence a readme can paste, or the{" "}
            <InlineCode>::graph-*</InlineCode> block a{" "}
            <TextLink href="/comark">comark</TextLink> app can render. it does
            not draw the react frame itself.
          </ProseP>
        }
        title="where each format belongs"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <GraphCompare
            columns={["JSX", "ASCII", "Comark", "Knap"]}
            rows={[
              { label: "MDX / React", values: [true, false, true, false] },
              { label: "App .md file", values: [false, false, true, true] },
              {
                label: "README / GitHub",
                values: [false, true, false, true],
              },
              {
                label: "Data in, Markdown out",
                values: [false, false, false, true],
              },
            ]}
            title="host"
          />
          <GraphCheck
            items={[
              { label: "same props as react", done: true },
              { label: "official fence, not homemade", done: true },
              { label: "comark param → ::graph-*", done: true },
              {
                label: "cli loads graph filters",
                note: "wire createEngine",
              },
            ]}
            title="filter"
          />
        </div>
        <LandingLinks
          items={[
            { href: "/docs/knap", label: "wiring" },
            { href: "/docs/skill", label: "skill" },
            { href: KNAP_URL, label: "knap.md" },
            { href: KNAP_API_URL, label: "api" },
            { href: KNAP_REPO, label: "obsidianmd/knap" },
          ]}
        />
      </LandingSection>
    </main>
  )
}
