import { SiteContainer } from "@/components/site/container"
import { HeroInstall } from "@/components/site/hero-install"
import { ProseLead } from "@/components/site/prose"

function Hero() {
  return (
    <section>
      <SiteContainer
        borderTop={false}
        className="mx-auto w-full max-w-4xl py-8 sm:py-16 md:py-24 lg:py-32"
      >
        <div className="flex min-w-0 flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-4xl font-medium tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            markdown-friendly components for mdx
          </h1>
          <ProseLead>
            callouts, timelines, tables, and charts drawn with text. in an mdx
            file you write them as markdown inside a tag. in a readme or a pr,
            you paste the same drawing as a code block.
          </ProseLead>
          <HeroInstall />
        </div>
      </SiteContainer>
    </section>
  )
}

export { Hero }
