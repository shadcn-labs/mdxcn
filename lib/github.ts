export const GITHUB_REPO = "shadcn-labs/mdxcn"
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`
export const GITHUB_TREE = `${GITHUB_URL}/tree/main`

async function getGithubStars() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(4000),
      }
    )

    if (!response.ok) {
      return null
    }

    const data: unknown = await response.json()

    if (
      typeof data !== "object" ||
      data === null ||
      !("stargazers_count" in data) ||
      typeof data.stargazers_count !== "number"
    ) {
      return null
    }

    return data.stargazers_count
  } catch {
    return null
  }
}

export { getGithubStars }
