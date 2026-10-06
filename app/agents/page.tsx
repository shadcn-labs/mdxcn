import type { Metadata } from "next"

import { CopyBlock } from "@/components/docs/install"
import { SkillInstall } from "@/components/docs/skill-install"
import {
  GraphCheck,
  GraphCompare,
  GraphFlow,
  GraphTree,
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
  ProseP,
  proseMutedClass,
  TextLink,
} from "@/components/site/prose"
import { components } from "@/lib/docs/catalog"
import { COMARK_URL } from "@/lib/docs/comark"
import { KNAP_URL } from "@/lib/docs/knap"
import { skillExamples } from "@/lib/docs/skill"
import { agentsJsonLd, pageMeta } from "@/lib/seo"
import { AGENTS_DESCRIPTION } from "@/lib/site"
import { cn } from "@/lib/utils"

const tries = skillExamples.filter((item) =>
  ["Refactor", "Comark", "Knap", "README"].includes(item.label)
)

const kit = [
  {
    name: "skill",
    detail:
      "when to use a figure, which one, and whether to write jsx, a ::graph-* block, a graph_* filter, or the official fence. the same two files work in cursor, claude code, codex, or opencode.",
  },
  {
    name: "recipes",
    detail:
      "worked write-ups with real props: copy the jsx, swap the labels, keep at most two graphs with prose between them.",
  },
  {
    name: "comark",
    detail:
      "::graph-* blocks with yaml props for the same graphs without mdx; github still gets the fence.",
  },
  {
    name: "knap",
    detail:
      "graph_* filters that turn a props object into the official fence, or a ::graph-* block when you pass comark.",
  },
  {
    name: "fenced ascii",
    detail:
      "code blocks that render the same in github, linear, and pr comments. change the labels, keep the frame, and do not draw a new figure.",
  },
  {
    name: "llms.txt",
    detail:
      "chooser plus ascii, comark, and knap blocks in one file when the skill is not installed.",
  },
]

export const metadata: Metadata = pageMeta({
  title: "for agents",
  description: AGENTS_DESCRIPTION,
  path: "/agents",
})

function AgentsPipeline() {
  return (
    <PipelineFigure
      label="agent loop: pick a graph for the write-up, emit it, then edit the labels in the file"
      stages={[
        {
          id: "write",
          name: "write",
          nodes: [
            { label: "refactor", hint: "path" },
            { label: "incident", hint: "night" },
            { label: "pr", hint: "diff" },
            { label: "readme", hint: "fence" },
          ],
        },
        {
          id: "choose",
          name: "choose",
          fanIn: true,
          nodes: [
            { label: "skill.md", hint: "chooser" },
            { label: "llms.txt", hint: "ascii + yaml" },
          ],
        },
        {
          id: "emit",
          name: "emit",
          nodes: [
            { label: "jsx", hint: "mdx" },
            { label: "::graph-*", hint: "comark" },
            { label: "graph_*", hint: "knap" },
            { label: "ascii", hint: "github" },
          ],
        },
        {
          id: "read",
          name: "read",
          fanIn: true,
          nodes: [
            {
              label: "edit the labels",
              hint: "the figure is still characters in the file",
              accent: true,
              wide: true,
            },
          ],
        },
      ]}
      title="loop"
    />
  )
}

export default function AgentsPage() {
  return (
    <main id="main">
      <JsonLd data={agentsJsonLd()} />
      <LandingHero
        actions={[
          { href: "#install", label: "install the skill" },
          { href: "/llms.txt", label: "fetch llms.txt" },
        ]}
        figure={<AgentsPipeline />}
        item="all"
        lead={
          <>
            when a write-up needs a figure, the skill picks which graph to use.
            emit jsx in mdx, a <InlineCode>::graph-*</InlineCode> block in a{" "}
            <TextLink href={COMARK_URL}>comark</TextLink> app, a{" "}
            <InlineCode>graph_*</InlineCode> filter in{" "}
            <TextLink href={KNAP_URL}>knap</TextLink>, or the official fence in
            a readme, pr, or linear note.
          </>
        }
        title="write a figure your agent can edit"
      />

      <LandingSection
        lead={
          <ProseP>
            on write, the agent emits at most two graphs next to the claim. on
            read, the figure is still characters in the file, so opening the mdx
            shows labels and values instead of a screenshot.
          </ProseP>
        }
        muted="github, linear, and a readme still get the official fence. they do not run comark."
        title="writing and reading the same figure"
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
              { label: "Edit the labels", values: [true, true, true, true] },
            ]}
            title="host"
          />
          <GraphFlow
            rows={[
              {
                nodes: [
                  { label: "write-up" },
                  { label: "chooser" },
                  { label: "JSX / YAML / filter", tone: "accent" },
                ],
              },
              {
                nodes: [
                  { label: "open the file" },
                  { label: "read the frame" },
                  { label: "edit labels", tone: "accent" },
                ],
              },
            ]}
            title="loop"
          />
        </div>
      </LandingSection>

      <LandingSection
        lead={
          <ProseP>
            there are {components.length} graphs; most ship an official fenced
            ascii for hosts that cannot run react. the skill should pick at most
            two per write-up.
          </ProseP>
        }
        title="what goes in the agent's folder"
      >
        <dl className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {kit.map((entry) => (
            <div className="flex flex-col gap-2" key={entry.name}>
              <dt className="font-medium">{entry.name}</dt>
              <dd className={cn(proseMutedClass, "max-w-[40ch]")}>
                {entry.detail}
              </dd>
            </div>
          ))}
        </dl>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <GraphTree
            nodes={[
              {
                label: "skills/mdxcn",
                accent: true,
                children: [
                  { label: "SKILL.md", meta: "chooser" },
                  { label: "recipes.md", meta: "jsx" },
                ],
              },
              {
                label: "fetch",
                children: [
                  { label: "/llms.txt", meta: "ascii + yaml" },
                  { label: "/docs/examples", meta: "write-ups" },
                ],
              },
            ]}
            title="kit"
          />
          <GraphCheck
            items={[
              { label: "at most two graphs", done: true },
              { label: "prose between them", done: true },
              { label: "official fence, not homemade", done: true },
              { label: "no svg", done: true },
            ]}
            title="rules"
          />
        </div>
      </LandingSection>

      <LandingSection
        id="install"
        lead={
          <ProseP>
            a project copy travels with the repo; a personal copy stays on this
            machine. if the host is react,{" "}
            <TextLink href="/docs/installation">
              install the components
            </TextLink>{" "}
            first. the graphs have to be in the project to render.
          </ProseP>
        }
        muted={
          <>
            the chooser table and full skill file are on{" "}
            <TextLink href="/docs/skill">skill</TextLink>.
          </>
        }
        title="install the skill"
      >
        <SkillInstall />
      </LandingSection>

      <LandingSection
        lead={
          <ProseP>
            paste one of these after install. each should pick two graphs and
            put prose between them.
          </ProseP>
        }
        title="try a prompt"
      >
        <div className="flex flex-col gap-6">
          {tries.map((item) => (
            <CopyBlock
              key={item.label}
              label={`${item.label} · ${item.hint}`}
              value={item.prompt}
            />
          ))}
        </div>
        <LandingLinks
          items={[
            { href: "/docs/skill", label: "all prompts" },
            { href: "/docs/examples", label: "examples" },
            { href: "/docs", label: "library" },
            { href: "/comark", label: "comark" },
            { href: "/knap", label: "knap" },
          ]}
        />
      </LandingSection>
    </main>
  )
}
