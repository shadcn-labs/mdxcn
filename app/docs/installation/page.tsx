import type { Metadata } from "next"

import { SectionHeading } from "@/components/docs/section-heading"
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
    "Install mdxcn components with the shadcn CLI, register them for MDX, and set up the @mdxcn namespace.",
  path: "/docs/installation",
})

const description =
  "There's no npm package to install. The shadcn CLI copies each component's source into your project, and the only dependency it adds is motion. After that, you write ordinary Markdown inside the component's tag. Where MDX doesn't render, like a README, you paste the plain-text version instead."

const extra = `## mdx

Register each component once in mdx-components.tsx. After that, the lists and tables you write inside its tag need no imports. On every docs page, the .mdx tab shows what you write and the .md tab shows the plain-text figure for Notion or a README.

## agents

$ORIGIN/agents explains how an agent writes figures and reads them back: Markdown inside the tag in MDX, the plain-text figure in a README, ::graph-* blocks in Comark, and graph_* filters in Knap. $ORIGIN/docs/skill has the skill file. $ORIGIN/llms.txt puts the graph guide and every format in one file.

## one component

The shadcn CLI copies the component into your project. You can also copy the files from GitHub by hand.

pnpm dlx shadcn@latest add $ORIGIN/r/graph-table.json

## everything

Installs every graph and the shared frame code into registry/default.

pnpm dlx shadcn@latest add $ORIGIN/r/all.json

## namespace

Add the registry to components.json once, then install components by name.

pnpm dlx shadcn@latest registry add @mdxcn=$ORIGIN/r/{name}.json

Then:

pnpm dlx shadcn@latest add @mdxcn/graph-table

## import

Components land under @/registry. If the import path feels long, add a barrel file that re-exports the ones you use.

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
            There&apos;s no npm package to install. The{" "}
            <TextLink href="https://ui.shadcn.com">shadcn</TextLink> CLI copies
            each component&apos;s source into your project, and the only
            dependency it adds is <InlineCode>motion</InlineCode>. After that,
            you write ordinary Markdown inside the component&apos;s tag. Where
            MDX doesn&apos;t render, like a README, you paste the plain-text
            version instead.
          </ProseLead>
        }
        title="installation"
      />

      <div className="flex flex-col gap-6 lg:gap-8">
        <section className="flex flex-col gap-4">
          <SectionHeading id="mdx">mdx</SectionHeading>
          <ProseP>
            Register each component once in{" "}
            <InlineCode>mdx-components.tsx</InlineCode>. After that, the lists
            and tables you write inside its tag need no imports. On every docs
            page, the .mdx tab shows what you write and the .md tab shows the
            plain-text figure for Notion or a README.
          </ProseP>
          <Callout type="tip">
            Wrap your component map in{" "}
            <TextLink href="/docs/mdx">withMdxcn</TextLink>. Some docs
            frameworks replace tags like <InlineCode>ul</InlineCode> and{" "}
            <InlineCode>table</InlineCode> with their own components, and the
            wrapper lets mdxcn read those too.
          </Callout>
          <Steps title="mdx">
            <ol>
              <li>
                <p>copy the files</p>
                <p>Run the CLI command below, or copy them from GitHub.</p>
              </li>
              <li>
                <p>
                  <strong>register the component</strong>
                </p>
                <p>Add it to mdx-components.tsx. You only do this once.</p>
              </li>
              <li>
                <p>
                  <em>write Markdown inside the tag</em>
                </p>
                <p>
                  The .mdx tab on each docs page shows exactly what to type.
                </p>
              </li>
            </ol>
          </Steps>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading id="agents">agents</SectionHeading>
          <ProseP>
            With the skill installed, an agent drops in a figure instead of
            drawing an SVG. It writes Markdown inside the tag in MDX, the
            plain-text figure in a README, a <InlineCode>::graph-*</InlineCode>{" "}
            block in <TextLink href={COMARK_URL}>Comark</TextLink>, and a{" "}
            <InlineCode>graph_*</InlineCode> filter in{" "}
            <TextLink href={KNAP_URL}>Knap</TextLink>.
          </ProseP>
          <ProseP>
            <TextLink href="/agents">For agents</TextLink> explains how writing
            and reading back work. <TextLink href="/docs/skill">Skill</TextLink>{" "}
            covers installing it, and{" "}
            <TextLink href="/llms.txt">/llms.txt</TextLink> puts the graph guide
            and every format in a single file.
          </ProseP>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading id="one-component">one component</SectionHeading>
          <ProseP>
            The CLI copies the component and the shared frame code into{" "}
            <InlineCode>registry/default</InlineCode>. If you&apos;d rather do
            it by hand, the manual tab lists every file to copy from GitHub.
          </ProseP>
          <InstallCommand doc={table} name="graph-table" />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading id="everything">everything</SectionHeading>
          <ProseP>
            Installs every graph and the shared frame code into{" "}
            <InlineCode>registry/default</InlineCode>. That includes{" "}
            <InlineCode>graph-comark</InlineCode> and{" "}
            <InlineCode>graph-knap</InlineCode>, the adapters for Comark and
            Knap.
          </ProseP>
          <InstallCommand name="all" />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading id="namespace">namespace</SectionHeading>
          <ProseP>
            Add the registry to <InlineCode>components.json</InlineCode> once.
            From then on you can install components by name, like{" "}
            <InlineCode>@mdxcn/graph-table</InlineCode>.
          </ProseP>
          <NamespaceSetup />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading id="import">import</SectionHeading>
          <ProseP>
            Components land under <InlineCode>@/registry</InlineCode>. If the
            import path feels long, add a barrel file that re-exports the ones
            you use.
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
