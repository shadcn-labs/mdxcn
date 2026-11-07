const MIN_INNER = 48

function widthOf(text: string) {
  return text.length
}

function padEnd(text: string, size: number) {
  const extra = size - widthOf(text)
  if (extra > 0) {
    return text + " ".repeat(extra)
  }

  return text.slice(0, size)
}

function padStart(text: string, size: number) {
  const extra = size - widthOf(text)
  if (extra > 0) {
    return " ".repeat(extra) + text
  }

  return text.slice(-size)
}

function dash(count: number) {
  return "-".repeat(Math.max(0, count))
}

function wrapText(text: string, width = 56): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 0) {
    return []
  }

  const lines: string[] = []
  let current = ""

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (current && next.length > width) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }

  if (current) {
    lines.push(current)
  }

  return lines
}

function frameAscii(
  title: string | undefined,
  lines: string[],
  minInner = MIN_INNER
) {
  const caption = title?.trim() ? `[ ${title.trim().toUpperCase()} ]` : ""
  const contentWidth = Math.max(0, ...lines.map(widthOf))
  const inner = Math.max(
    minInner,
    contentWidth,
    caption ? caption.length + 4 : 0
  )
  const span = inner + 2
  const empty = `| ${" ".repeat(inner)} |`
  const body = lines.map((line) => `| ${padEnd(line, inner)} |`)
  const top = caption
    ? (() => {
        const label = ` ${caption} `
        const leftover = Math.max(0, span - label.length)
        const left = Math.floor(leftover / 2)
        const right = leftover - left
        return `+${dash(left)}${label}${dash(right)}+`
      })()
    : `+${dash(span)}+`

  return [top, empty, ...body, empty, `+${dash(span)}+`].join("\n")
}

type AsciiFrame = "box" | "corners" | "rule" | "none"

/**
 * Redraw a `frameAscii` box as another frame, matching the React `frame`
 * prop. Anything that is not a full box comes back unchanged.
 */
function reframeAscii(ascii: string, frame?: unknown): string {
  if (frame !== "corners" && frame !== "rule" && frame !== "none") {
    return ascii
  }

  const rows = ascii.split("\n")
  const top = rows[0] ?? ""
  const bottom = rows[rows.length - 1] ?? ""
  const middle = rows.slice(1, -1)
  const boxed =
    rows.length >= 4 &&
    /^\+-.*\+$/.test(top) &&
    /^\+-+\+$/.test(bottom) &&
    middle.every((row) => row.startsWith("| ") && row.endsWith(" |"))

  if (!boxed) {
    return ascii
  }

  const inner = middle.map((row) => row.slice(2, -2))
  const lines = inner.slice(1, -1).map((line) => line.trimEnd())

  if (frame === "none") {
    const open = top.indexOf("[ ")
    const close = top.lastIndexOf(" ]")
    const caption =
      open !== -1 && close > open ? top.slice(open, close + 2) : ""
    return [...(caption ? [caption, ""] : []), ...lines].join("\n")
  }

  if (frame === "rule") {
    const edge = (row: string) => `-${row.slice(1, -1)}-`
    return [edge(top), "", ...lines, "", edge(bottom)].join("\n")
  }

  const open = (row: string) => row.replace(/-/g, " ")
  const caption = top.indexOf("[ ")
  const close = top.lastIndexOf(" ]")
  const corners =
    caption !== -1 && close > caption
      ? open(top.slice(0, caption)) +
        top.slice(caption, close + 2) +
        open(top.slice(close + 2))
      : open(top)

  return [
    corners,
    ...inner.map((line) => `  ${line}`.trimEnd()),
    open(bottom),
  ].join("\n")
}

function rule(size: number) {
  return dash(size)
}

function fillTrack(filled: number, total: number, on = "=", off = "-") {
  const count = Math.min(total, Math.max(0, filled))
  return on.repeat(count) + off.repeat(total - count)
}

function col(text: string, size: number, align: "left" | "right" = "left") {
  return align === "right" ? padStart(text, size) : padEnd(text, size)
}

function colWidth(values: string[]) {
  return Math.max(0, ...values.map(widthOf))
}

function fence(ascii: string) {
  return `\`\`\`\n${ascii}\n\`\`\``
}

export {
  col,
  colWidth,
  dash,
  fence,
  fillTrack,
  frameAscii,
  padEnd,
  padStart,
  reframeAscii,
  rule,
  widthOf,
  wrapText,
}
export { MIN_INNER }
export type { AsciiFrame }
