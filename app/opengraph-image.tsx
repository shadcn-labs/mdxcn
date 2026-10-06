import { openGraphImageResponse, OG_SIZE } from "@/lib/og/opengraph"

export const runtime = "nodejs"
export const alt = "mdxcn: markdown-friendly components"
export const size = OG_SIZE
export const contentType = "image/png"

export default function OpenGraphImage() {
  return openGraphImageResponse()
}
