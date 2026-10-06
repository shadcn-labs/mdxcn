import type { Metadata } from "next"
import Link from "next/link"

import { CopyBlock } from "@/components/docs/install"
import { DocsPageHeader } from "@/components/docs/page-header"
import { SkillInstall } from "@/components/docs/skill-install"
import { JsonLd } from "@/components/seo/json-ld"
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
  "A SKILL.md that tells the agent which graph to put next to the prose. Same files in Cursor, Claude Code, Codex, OpenCode, or any agent that loads Agent Skills."

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
    "Same two files. Put them in the skills folder your agent already reads.",
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
    "When the agent is explaining a path, an incident, a tradeoff, or a PR, it puts at most two framed graphs next to the prose. MDX gets markdown children inside the tag. A Comark app gets a ::graph-* block. A Knap template gets a graph_* filter. A README, GitHub comment, or Linear note gets the official fence from /llms.txt.",
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
          Write vs read, and why this exists:{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/agents"
          >
            for agents
          </Link>
          . The graphs themselves still need to be in the project.{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/docs/installation"
          >
            install the components
          </Link>{" "}
          first if they are missing.
        </p>
      </DocsPageHeader>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">install</h2>
        <p className="max-w-prose text-pretty text-muted-foreground">
          Project copy travels with the repo. Personal copy is this machine
          only. The agent picks it up from the description when the writing
          would scan faster with a figure. If yours watches some other folder,
          drop the same two files there.
        </p>
        <SkillInstall />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">try it</h2>
        <p className="max-w-prose text-pretty text-muted-foreground">
          Paste one of these after install. Each should pick two graphs from the
          chooser and put prose between them.
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
        <h2 className="text-xl font-semibold tracking-tight">when to use</h2>
        <p className="max-w-prose text-pretty text-muted-foreground">
          Before a wall of bullets, the skill asks if a framed figure would scan
          faster. Skip it if the whole point is one sentence.
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
          Worked write-ups with JSX:{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/docs/examples"
          >
            Examples
          </Link>
          . Plain <code className="font-mono">.md</code> in a Comark app:{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/comark"
          >
            Comark
          </Link>
          . Data into Markdown with{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/knap"
          >
            Knap
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">rules</h2>
        <ul
          className="flex max-w-prose flex-col gap-2 text-pretty text-muted-foreground"
          role="list"
        >
          {skillRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <p className="max-w-prose text-pretty text-muted-foreground">
          Do not draw the chart in SVG. Copy the framed figure from the docs MDX
          tab into Notion or a README. Keep the fence. Wrap markdown children in
          the parent tag in MDX. In a Comark app, paste a ::graph-* block. In a
          Knap template, pipe props through a graph_* filter. Do not invent
          ASCII. Do not restyle the frame. Do not dump every graph into one
          reply.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">the file</h2>
        <p className="max-w-prose text-pretty text-muted-foreground">
          This is what the agent loads.{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/skill.md"
          >
            /skill.md
          </Link>{" "}
          and{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/skill/recipes.md"
          >
            /skill/recipes.md
          </Link>{" "}
          stay in sync with the repo.{" "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/llms.txt"
          >
            /llms.txt
          </Link>{" "}
          is the chooser plus the MDX ASCII blocks, the Comark blocks, and the
          Knap filters if the skill is not installed.
        </p>
        <CopyBlock label="skill.md" value={source} />
      </section>
    </div>
  )
}
