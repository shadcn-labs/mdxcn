import type { Metadata } from "next"
import Link from "next/link"

import { RecipeList } from "@/components/docs/recipe-card"
import { DocsPageHeader } from "@/components/docs/page-header"
import { JsonLd } from "@/components/seo/json-ld"
import { Callout } from "@/components/graphs"
import { ProseLead } from "@/components/site/prose"
import { recipes, recipeCopy } from "@/lib/docs/recipes"
import { pageMeta } from "@/lib/seo"
import { SITE_AUTHOR, SITE_NAME_SHORT, SITE_URL } from "@/lib/site"

const description =
  "short write-ups with two graphs each. a refactor, an incident, a tradeoff, a pull request."

export const metadata: Metadata = pageMeta({
  title: "examples",
  description,
  path: "/docs/examples",
})

const extra = [
  "## examples",
  "",
  ...recipes.flatMap((item) => [
    `### ${item.title}`,
    "",
    item.story,
    "",
    recipeCopy(item),
    "",
  ]),
].join("\n")

export default function ExamplesPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "mdxcn examples",
          description,
          url: `${SITE_URL}/docs/examples`,
          author: {
            "@type": "Person",
            name: SITE_AUTHOR.name,
            url: SITE_AUTHOR.url,
          },
          isPartOf: {
            "@type": "SoftwareSourceCode",
            name: SITE_NAME_SHORT,
            url: SITE_URL,
          },
        }}
      />
      <DocsPageHeader
        copy={{
          description,
          extra,
          title: "examples",
        }}
        lead={
          <ProseLead>
            short write-ups with two graphs each. the .md tab is the framed
            figure, and it looks the same pasted into notion or a readme. each
            graph has its own page with its props.
          </ProseLead>
        }
        title="examples"
      >
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
          {recipes.map((item) => (
            <li key={item.slug}>
              <a
                className="hover:text-foreground hover:underline"
                href={`#${item.slug}`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </DocsPageHeader>

      <Callout type="tip">
        copy is the framed figure from the .md tab. paste it into notion or a
        readme and the drawing is still there.
      </Callout>

      <RecipeList />

      <p className="max-w-[56ch] text-pretty text-muted-foreground">
        Give this to an agent:{" "}
        <Link
          className="text-foreground underline-offset-4 hover:underline"
          href="/agents"
        >
          for agents
        </Link>
        . Install:{" "}
        <Link
          className="text-foreground underline-offset-4 hover:underline"
          href="/docs/skill"
        >
          skill
        </Link>
        . Every graph in one file, including the fenced ASCII blocks:{" "}
        <Link
          className="text-foreground underline-offset-4 hover:underline"
          href="/llms.txt"
        >
          /llms.txt
        </Link>
        .
      </p>
    </div>
  )
}
