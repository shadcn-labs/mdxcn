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
  COMARK_DEMO_REPO,
  COMARK_DEMO_SOURCE,
  COMARK_DEMO_URL,
  COMARK_DESCRIPTION,
  COMARK_URL,
} from "@/lib/docs/comark"
import { pageMeta, webPageJsonLd } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = pageMeta({
  title: "comark",
  description: COMARK_DESCRIPTION,
  path: "/comark",
})

const steps = [
  {
    name: "parse",
    detail: (
      <>
        <TextLink href={COMARK_URL}>comark</TextLink> turns the{" "}
        <InlineCode>.md</InlineCode> file into a{" "}
        <InlineCode>MarkdownDocument</InlineCode> on the server, in a worker, or
        as tokens stream in.
      </>
    ),
  },
  {
    name: "coerce",
    detail: (
      <>
        markdown attributes arrive as strings, so the adapter turns{" "}
        <InlineCode>value=&quot;0.86&quot;</InlineCode> into{" "}
        <InlineCode>0.86</InlineCode>, maps <InlineCode>class</InlineCode> to{" "}
        <InlineCode>className</InlineCode>, and holds off until required props
        exist so <InlineCode>rows.map</InlineCode> does not throw mid-stream.
      </>
    ),
  },
  {
    name: "render",
    detail: (
      <>
        each <InlineCode>::graph-*</InlineCode> tag is already on the allowlist,
        and the same react graph you copied from the registry draws the frame.
      </>
    ),
  },
]

function ComarkPipeline() {
  return (
    <PipelineFigure
      label="comark pipeline from a plain .md file to the same react graphs"
      stages={[
        {
          id: "source",
          name: "source",
          nodes: [
            { label: ".md file", hint: "commonmark" },
            { label: "::graph-*", hint: "yaml props" },
          ],
        },
        {
          id: "parse",
          name: "parse",
          fanIn: true,
          nodes: [
            { label: "MarkdownDocument", hint: "server / worker / stream" },
          ],
        },
        {
          id: "coerce",
          name: "coerce",
          nodes: [
            { label: "strings → numbers", hint: "value, ticks" },
            { label: "class → className", hint: "hold last good tree" },
          ],
        },
        {
          id: "render",
          name: "render",
          fanIn: true,
          nodes: [
            {
              label: "graphComponents",
              hint: "same react graphs, no mdx",
              accent: true,
              wide: true,
            },
          ],
        },
      ]}
      title="pipeline"
    />
  )
}

export default function ComarkPage() {
  return (
    <main id="main">
      <JsonLd
        data={webPageJsonLd({
          name: "Comark",
          description: COMARK_DESCRIPTION,
          path: "/comark",
        })}
      />
      <LandingHero
        actions={[
          { href: "/docs/comark", label: "read the wiring" },
          { href: COMARK_DEMO_URL, label: "open the demo" },
        ]}
        figure={<ComarkPipeline />}
        item="graph-comark"
        lead={
          <>
            put <InlineCode>::graph-*</InlineCode> blocks in a{" "}
            <InlineCode>.md</InlineCode> file.{" "}
            <TextLink href={COMARK_URL}>comark</TextLink> parses them and these
            graphs draw the frames. you do not need mdx or a compile step.{" "}
            <TextLink href={COMARK_DEMO_REPO}>
              sébastien chopin&apos;s demo
            </TextLink>{" "}
            is the reference; the adapter is{" "}
            <InlineCode>graph-comark</InlineCode>.
          </>
        }
        title="graphs inside a plain markdown file"
      />

      <LandingSection
        lead={
          <ProseP>
            the source is commonmark plus{" "}
            <TextLink href={COMARK_URL}>comark</TextLink> component blocks. the
            rendered side uses the same graphs as the docs. toggle to read the
            markdown that produced them.
          </ProseP>
        }
        title="source and rendered view of the same file"
      >
        <SourcePreview source={COMARK_DEMO_SOURCE}>
          <ProseMuted>
            p95 crossed 800ms at 14:02. rollback at 14:11.
          </ProseMuted>
          <GraphTimeline
            events={[
              { date: "14:02", label: "p95 crossed 800ms" },
              {
                date: "14:11",
                label: "rolled back the cache flag",
                state: "now",
              },
              {
                date: "14:40",
                label: "write the postmortem",
                state: "next",
              },
            ]}
            title="NIGHT"
          />
          <ProseMuted>
            same night. these are the two days users felt it.
          </ProseMuted>
          <GraphUptime
            days={[
              "ok",
              "ok",
              "ok",
              "ok",
              "ok",
              "degraded",
              "ok",
              "ok",
              "down",
              "down",
              "ok",
              "ok",
              "ok",
              "ok",
            ]}
            from="Aug 14"
            title="API"
            to="Aug 27"
          />
        </SourcePreview>
      </LandingSection>

      <LandingSection
        lead={
          <ProseP>
            you own three files: parsing stays in{" "}
            <TextLink href={COMARK_URL}>comark</TextLink>, the graphs stay
            copied via shadcn, and the adapter is the only new piece.
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
            use jsx in mdx, the fenced ascii on github and readmes, and{" "}
            <TextLink href={COMARK_URL}>comark</TextLink> when you need a plain{" "}
            <InlineCode>.md</InlineCode> file that can stream as it arrives.
          </ProseP>
        }
        title="where each format belongs"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <GraphCompare
            columns={["JSX", "ASCII", "Comark"]}
            rows={[
              { label: "MDX / React", values: [true, false, true] },
              { label: "App .md file", values: [false, false, true] },
              { label: "README / GitHub", values: [false, true, false] },
              { label: "Streaming tokens", values: [false, false, true] },
            ]}
            title="host"
          />
          <GraphCheck
            items={[
              { label: "auto-close dangling ::", done: true },
              { label: "YAML all-or-nothing", done: true },
              {
                label: "empty frame until props land",
                done: true,
              },
              {
                label: "incomplete YAML can throw",
                note: "hold last good tree",
              },
            ]}
            title="stream"
          />
        </div>
        <LandingLinks
          items={[
            { href: "/docs/comark", label: "wiring" },
            { href: "/docs/skill", label: "skill" },
            { href: COMARK_URL, label: "comark.dev" },
            { href: COMARK_DEMO_REPO, label: "atinux/comark-graphs-demo" },
          ]}
        />
      </LandingSection>
    </main>
  )
}
