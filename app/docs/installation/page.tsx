import type { Metadata } from "next"

import { Callout, Steps } from "@/components/graphs"
import { Command, InstallCommand } from "@/components/docs/install"
import { DocsPageHeader } from "@/components/docs/page-header"
import { NamespaceSetup } from "@/components/docs/namespace"
import { JsonLd } from "@/components/seo/json-ld"
import {
  InlineCode,
  ProseLead,
  ProseP,
  TextLink,
} from "@/components/site/prose"
import { COMARK_URL } from "@/lib/docs/comark"
import { KNAP_URL } from "@/lib/docs/knap"
import { getComponent } from "@/lib/docs/catalog"
import { installationJsonLd, pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta({
  title: "installation",
  description:
    "write markdown children in mdx. paste the fence when the file cannot render. the cli copies the tags.",
  path: "/docs/installation",
})

const description =
  "write markdown children inside the tag. paste the fence when the file cannot render mdx. the cli copies the source into your project so the tags exist. there is no npm package. you need motion."

const extra = `## mdx

register the parent once in mdx-components.tsx. the .mdx tab is what you write. the .md tab is the framed figure, for notion or a readme.

## agents

$ORIGIN/agents covers writing and reading: markdown inside the tag in mdx, the code block in a readme, ::graph-* in comark, graph_* in knap. $ORIGIN/docs/skill is the skill.md. $ORIGIN/llms.txt is the chooser, the fences, the comark blocks, and the knap filters.

## one component

the shadcn cli copies the source, or copy the files from github.

pnpm dlx shadcn@latest add $ORIGIN/r/graph-table.json

## everything

installs every graph and the shared frame code into registry/default.

pnpm dlx shadcn@latest add $ORIGIN/r/all.json

## namespace

add the registry once in components.json, then install components by name.

pnpm dlx shadcn@latest registry add @mdxcn=$ORIGIN/r/{name}.json

then:

pnpm dlx shadcn@latest add @mdxcn/graph-table

## import

files land under @/registry. add your own barrel export if you want a shorter import path.

import { GraphTable } from "@/registry/default/graph-table/graph-table"`

export default function InstallationPage() {
  const table = getComponent("graph-table")

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <JsonLd data={installationJsonLd()} />
      <DocsPageHeader
        copy={{
          description,
          extra,
          registry: "all",
          title: "installation",
        }}
        lead={
          <ProseLead>
            write markdown children inside the tag. paste the fence when the
            file cannot render mdx. the{" "}
            <TextLink href="https://ui.shadcn.com">shadcn</TextLink> cli copies
            the source into your project so the tags exist. there is no npm
            package. you need <InlineCode>motion</InlineCode>.
          </ProseLead>
        }
        title="installation"
      />

      <div className="flex flex-col gap-6 lg:gap-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">mdx</h2>
          <ProseP>
            register the parent once. lists and tables inside the tag do not
            need extra imports. the .mdx tab is what you write. the .md tab is
            the framed figure, for notion or a readme.
          </ProseP>
          <Callout type="tip">
            register the parent once in{" "}
            <InlineCode>mdx-components.tsx</InlineCode> and wrap the map in{" "}
            <TextLink href="/docs/mdx">withMdxcn</TextLink> so tags your docs
            framework swaps out still parse.
          </Callout>
          <Steps title="mdx">
            <ol>
              <li>
                <p>
                  <strong>write</strong>
                </p>
                <p>
                  markdown children inside the tag. the .mdx tab. the .md tab is
                  the fence for notion or a readme.
                </p>
              </li>
              <li>
                <p>register the parent</p>
                <p>
                  once in mdx-components.tsx. lists and tables inside do not
                  need their own imports.
                </p>
              </li>
              <li>
                <p>
                  <em>copy the files</em>
                </p>
                <p>if the app does not have the tags yet. cli or github.</p>
              </li>
            </ol>
          </Steps>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">agents</h2>
          <ProseP>
            a skill file so the agent pastes a figure instead of drawing svg.
            markdown children in mdx. the fence in a readme. a{" "}
            <InlineCode>::graph-*</InlineCode> block in{" "}
            <TextLink href={COMARK_URL}>comark</TextLink>. a{" "}
            <InlineCode>graph_*</InlineCode> filter in{" "}
            <TextLink href={KNAP_URL}>knap</TextLink>.{" "}
            <TextLink href="/agents">for agents</TextLink> is the write and read
            story. <TextLink href="/docs/skill">skill</TextLink> is the install.{" "}
            <TextLink href="/llms.txt">/llms.txt</TextLink> is the chooser plus
            the fences, comark, and knap blocks, in one file.
          </ProseP>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">
            one component
          </h2>
          <ProseP>
            the cli copies the source, or copy the files from github. they land
            under <InlineCode>registry/default</InlineCode>.
          </ProseP>
          <InstallCommand doc={table} name="graph-table" />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">everything</h2>
          <ProseP>
            installs every graph and the shared frame code into{" "}
            <InlineCode>registry/default</InlineCode>.{" "}
            <InlineCode>graph-comark</InlineCode> and{" "}
            <InlineCode>graph-knap</InlineCode> are already in{" "}
            <InlineCode>all.json</InlineCode>.
          </ProseP>
          <InstallCommand name="all" />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">namespace</h2>
          <ProseP>
            add the registry once in <InlineCode>components.json</InlineCode>,
            then install components by name as{" "}
            <InlineCode>@mdxcn/graph-table</InlineCode>.
          </ProseP>
          <NamespaceSetup />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">import</h2>
          <ProseP>
            files land under <InlineCode>@/registry</InlineCode>. add your own
            barrel export if you want a shorter import path.
          </ProseP>
          <Command
            label="import"
            value={`import { GraphTable } from "@/registry/default/graph-table/graph-table"`}
          />
        </section>
      </div>
    </div>
  )
}
