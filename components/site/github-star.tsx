"use client"

import { GithubIcon } from "../icons/github"
import { GITHUB_URL } from "@/lib/github"
import { addQueryParams } from "@/lib/url"
import { UTM_PARAMS } from "@/lib/site"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "../ui/button"

function GithubStarLink({
  stars,
  className,
}: {
  stars: number | null
  className?: string
}) {
  const count =
    stars === null ? null : new Intl.NumberFormat("en-US").format(stars)

  return (
    <Link
      aria-label={count ? `Star on GitHub, ${count} stars` : "Star on GitHub"}
      href={addQueryParams(GITHUB_URL, UTM_PARAMS)}
      rel="noreferrer"
      className="flex items-center gap-2"
    >
      <Button
        variant="ghost"
        className={cn(
          "group flex shrink-0 items-center gap-2 text-muted-foreground hover:text-foreground",
          "transition-all duration-300",
          className
        )}
      >
        <GithubIcon className="size-4 shrink-0 group-hover:text-yellow-500" />
        {count && (
          <span className="flex items-center gap-1 tabular-nums group-hover:text-yellow-500">
            [{count}]
          </span>
        )}
      </Button>
    </Link>
  )
}

export { GithubStarLink }
