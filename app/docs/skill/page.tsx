import type { Metadata } from "next"
import Link from "next/link"

import { SectionHeading } from "@/components/docs/section-heading"
import { CopyBlock } from "@/components/docs/install"
import { DocsPageHeader } from "@/components/docs/page-header"
import { SkillInstall } from "@/components/docs/skill-install"
import { JsonLd } from "@/components/seo/json-ld"
import { TextLink } from "@/components/site/prose"
import {
  SKILL_INSTALL,
  skillAgents,
  skillChooser,
  skillExamples,
  skillRules,
} from "@/lib/docs/skill"
import { readSkillFile } from "@/lib/docs/skill-files"
import { skillJsonLd, pageMeta } from "@/lib/seo"

const description =
  "A skill file that tells your agent when a figure would help and which graph to use. The same two files work in Cursor, Claude Code, Codex, OpenCode and any other agent that supports Agent Skills."

export const metadata: Metadata = pageMeta({
  title: "skill",
  description,
  path: "/docs/skill",
})

export default async function SkillPage() {
  const source = await readSkillFile("SKILL.md")
  const extra = [
    "## install",
    "",
    "The same two files work everywhere. Put them in the skills folder your agent already reads.",
    "",
    ...skillAgents.flatMap((item) => [
      `${item.name}: ${item.project}/${SKILL_INSTALL} (project) or ${item.personal}/${SKILL_INSTALL} (personal)`,
    ]),
    "",
    `curl -fsSL $ORIGIN/skill.md -o <dir>/${SKILL_INSTALL}/SKILL.md`,
    `curl -fsSL $ORIGIN/skill/recipes.md -o <dir>/${SKILL_INSTALL}/recipes.md`,
    "",
    "## what it does",
    "",
    "When the agent is explaining a request path, an incident, a tradeoff or a pull request, it adds at most two framed graphs next to the prose. In MDX it writes Markdown inside the tag, in a Comark app a ::graph-* block, in a Knap template a graph_* filter, and in a README, GitHub comment or Linear note the plain-text figure from /llms.txt.",
    "",
    "## files",
    "",
    source,
  ].join("\n")

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <JsonLd data={skillJsonLd()} />
      <DocsPageHeader
        copy={{
          description,
          extra,
          title: "skill",
        }}
        lead={description}
        title="skill"
      >
        <p className="max-w-prose text-pretty text-muted-foreground">
          For the bigger picture of how agents write and read these figures, see{" "}
          <TextLink href="/agents">for agents</TextLink>. The skill doesn&apos;t
          include the graphs themselves, so{" "}
          <TextLink href="/docs/installation">install the components</TextLink>{" "}
          first if your project doesn&apos;t have them yet.
        </p>
      </DocsPageHeader>

      <section className="flex flex-col gap-4">
        <SectionHeading id="install">install</SectionHeading>
        <p className="max-w-prose text-pretty text-muted-foreground">
          A project copy is committed with the repo, so everyone on the team
          gets it. A personal copy lives only on your machine. Your agent loads
          the skill when its description matches the task, which is usually when
          a figure would explain something faster than prose. If your agent
          reads skills from a different folder, put the same two files there.
        </p>
        <SkillInstall />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="try-it">try it</SectionHeading>
        <p className="max-w-prose text-pretty text-muted-foreground">
          After installing, paste one of these prompts. A good result uses two
          graphs from the guide, with prose in between.
        </p>
        <div className="flex flex-col gap-6">
          {skillExamples.map((item) => (
            <CopyBlock
              key={item.label}
              label={`${item.label} · ${item.hint}`}
              value={item.prompt}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="when-to-use">when to use</SectionHeading>
        <p className="max-w-prose text-pretty text-muted-foreground">
          Before writing a long list of bullets, the skill checks whether a
          figure would be quicker to read. If the whole point fits in one
          sentence, it skips the figure.
        </p>
        <div className="-mx-4 graph-scroll-x sm:-mx-6 lg:-mx-8">
          <div className="min-w-full px-4 sm:px-6 lg:px-8">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="border-b border-dashed border-site-rail px-3 py-3 text-left font-medium text-foreground">
                    The writing is
                  </th>
                  <th className="border-b border-dashed border-site-rail px-3 py-3 text-left font-medium text-foreground">
                    Use
                  </th>
                </tr>
              </thead>
              <tbody>
                {skillChooser.map((row) => (
                  <tr key={row.writing}>
                    <td className="border-b border-dashed border-site-rail px-3 py-3 text-muted-foreground">
                      {row.writing}
                    </td>
                    <td className="border-b border-dashed border-site-rail px-3 py-3 font-mono text-muted-foreground">
                      {row.graphs.map((graph, index) => (
                        <span key={graph.slug}>
                          {index > 0 ? ", then " : null}
                          <Link
                            className="text-foreground hover:underline"
                            href={`/docs/${graph.slug}`}
                          >
                            {graph.name}
                          </Link>
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="max-w-prose text-pretty text-muted-foreground">
          For complete write-ups, see{" "}
          <TextLink href="/docs/examples">examples</TextLink>. To render plain{" "}
          <code className="font-mono">.md</code> in a Comark app, see{" "}
          <TextLink href="/comark">Comark</TextLink>, and to turn data into
          Markdown, see <TextLink href="/knap">Knap</TextLink>.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="rules">rules</SectionHeading>
        <ul
          className="flex max-w-prose flex-col gap-2 text-pretty text-muted-foreground"
          role="list"
        >
          {skillRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <p className="max-w-prose text-pretty text-muted-foreground">
          These are written for the agent, so they read like a checklist. The
          short version: never draw a chart as SVG, never make up a text figure,
          don&apos;t restyle the frame, and keep each section to two graphs at
          most.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading id="the-file">the file</SectionHeading>
        <p className="max-w-prose text-pretty text-muted-foreground">
          This is exactly what the agent loads.{" "}
          <TextLink href="/skill.md">/skill.md</TextLink> and{" "}
          <TextLink href="/skill/recipes.md">/skill/recipes.md</TextLink> always
          match the repo. If the skill isn&apos;t installed,{" "}
          <TextLink href="/llms.txt">/llms.txt</TextLink> has the same guide
          along with every format.
        </p>
        <CopyBlock label="skill.md" value={source} />
      </section>
    </div>
  )
}
