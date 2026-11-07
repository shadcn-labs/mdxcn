import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Examples, examplesBySlug } from "@/components/docs/examples"
import { InstallCommand } from "@/components/docs/install"
import { ComponentGuide } from "@/components/docs/component-guide"
import { DocsPageHeader } from "@/components/docs/page-header"
import { DocsPager } from "@/components/docs/pager"
import { SectionHeading } from "@/components/docs/section-heading"
import { PropsTable } from "@/components/docs/props-table"
import { JsonLd } from "@/components/seo/json-ld"
import { components, getComponent } from "@/lib/docs/catalog"
import { componentJsonLd, pageMeta } from "@/lib/seo"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return components.map((item) => ({ slug: item.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = getComponent(slug)

  if (!item) {
    return {}
  }

  return pageMeta({
    title: item.title,
    description: item.description,
    path: `/docs/${slug}`,
  })
}

export default async function ComponentDocPage({ params }: PageProps) {
  const { slug } = await params
  const item = getComponent(slug)

  if (!item) {
    notFound()
  }

  const examples = examplesBySlug[slug] ?? []
  const exampleNotes = examples.map(({ title, description, code }) => ({
    title,
    description,
    code,
  }))

  return (
    <div className="flex flex-col gap-14 lg:gap-16">
      <JsonLd data={componentJsonLd(item)} />
      <DocsPageHeader
        copy={{
          description: item.description,
          doc: item,
          examples: exampleNotes,
          kicker: item.name,
          title: item.title,
        }}
        kicker={item.name}
        lead={item.description}
        title={item.title}
      >
        <ComponentGuide doc={item} />
      </DocsPageHeader>

      {examples[0] ? <Examples items={[examples[0]]} slug={slug} /> : null}

      <section className="flex flex-col gap-4">
        <SectionHeading id="install">install</SectionHeading>
        <InstallCommand
          doc={item}
          example={examples[0]?.code}
          name={item.registry}
        />
      </section>

      {examples.length > 1 ? (
        <Examples items={examples.slice(1)} slug={slug} />
      ) : null}

      <section className="flex flex-col gap-4" data-toc="props" id="props">
        <PropsTable rows={item.props} />
      </section>

      <DocsPager slug={slug} />
    </div>
  )
}
