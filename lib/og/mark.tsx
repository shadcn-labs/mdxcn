/**
 * Site mark: a dashed frame with `+` corners and three glyph bars, the same
 * vocabulary as the graphs. Drawn on a 32-unit grid so it stays crisp at 16px.
 *
 * Used by `app/icon.svg` (static, color-scheme aware), `app/icon.tsx`,
 * `app/apple-icon.tsx` (PNG via Satori), and the header/footer wordmark.
 */

type MarkPalette = {
  tile: string
  ink: string
  accent: string
}

/** Light tile — reads on dark browser chrome, like the Comark favicon. */
export const MARK_LIGHT: MarkPalette = {
  tile: "#ededed",
  ink: "#1c1c1c",
  accent: "#3b7fb0",
}

/** Dark tile used for the Apple touch icon. */
export const MARK_DARK: MarkPalette = {
  tile: "#1c1c1c",
  ink: "#e6e6e6",
  accent: "#7eadd4",
}

/** Live site theme — follows background / foreground / accent picker. */
export const MARK_THEME: MarkPalette = {
  tile: "var(--background)",
  ink: "var(--foreground)",
  accent: "var(--graph-accent)",
}

function Mark({
  size,
  palette = MARK_LIGHT,
  className,
}: {
  size: number
  palette?: MarkPalette
  className?: string
}) {
  const { tile, ink, accent } = palette

  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      viewBox="0 0 32 32"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill={tile} height="32" width="32" />
      <rect
        fill="none"
        height="23"
        stroke={ink}
        strokeDasharray="2 2"
        strokeWidth="1"
        width="23"
        x="4.5"
        y="4.5"
      />
      <g fill={tile}>
        <rect height="5" width="5" x="2" y="2" />
        <rect height="5" width="5" x="25" y="2" />
        <rect height="5" width="5" x="2" y="25" />
        <rect height="5" width="5" x="25" y="25" />
      </g>
      <path
        d="M4.5 2v5M2 4.5h5M27.5 2v5M25 4.5h5M4.5 25v5M2 27.5h5M27.5 25v5M25 27.5h5"
        fill="none"
        stroke={ink}
        strokeWidth="1"
      />
      <rect fill={ink} height="6" width="4" x="8" y="18" />
      <rect fill={ink} height="11" width="4" x="14" y="13" />
      <rect fill={accent} height="16" width="4" x="20" y="8" />
    </svg>
  )
}

export { Mark }
export type { MarkPalette }
