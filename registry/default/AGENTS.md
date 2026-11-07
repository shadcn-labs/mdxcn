# Registry graphs

Each item is a folder `graph-<name>/graph-<name>.tsx`. Users copy these files via shadcn; keep them self-contained aside from `graph-frame`.

## Frame

```tsx
<Graph title={title} className={className} corner={corner} frame={frame}>
  <GraphBody>{/* ... */}</GraphBody>
</Graph>
```

Horizontal tracks that represent a range (meter, stack, activity, bullet, rank) must span the frame. Use `GraphTrack` + `GraphTick` (`flex-1`), not 1ch-wide ticks with empty `1fr`. Spark, bars, cells, and uptime stay packed at 1ch, centered in the frame, with a small gap — don't stretch those glyphs edge to edge. Don't pad short uptime rows out to `columns`.

No SVG. Glyphs draw the chart. Borders are dashes.

Import primitives from `@/registry/default/graph-frame/...`, never from the site barrel.

## Glyphs and color

```ts
glyphs?: Glyphs // "shade" | "ascii" | "hash" | "bar" | readonly string[]
palette?: GraphPalette // "mono" | "duo" | "multi", default "mono"
corner?: string // default "+"
frame?: GraphFrame // "box" | "corners" | "rule" | "none", default "box"
```

Resolve with `resolveGlyphs(glyphs)`. Intensity: `intensityLevel` / `intensityGlyph` / `intensityClass(level, palette)`. Series: `seriesClass` / `seriesDim` / `toneClass`. Default is one accent. Mute with `text-graph-muted` / opacity. `palette="duo"` paints the second series with `--graph-accent-2`. `palette="multi"` cycles three accents. Don't invent extra hues.

No CSS-box charts. No nested radius demos. No type-specimen / contrast-token graphs.

## Comark adapter

Not a graph. After `all.json`, import `graphComponents` from `graph-comark/graph-comark.tsx` and pass it to Comark — same as [comark-graphs-demo](https://github.com/atinux/comark-graphs-demo). New graph: add `numeric` / `required` in `adapters.ts` and YAML in `comark-props.ts`.

## Knap filters

Not a graph. After `all.json`, spread `graphFilters` from `graph-knap/graph-knap.ts` into Knap's `createEngine`. New graph: add an ASCII renderer in `graphs.ts` if it is a character grid, then `GRAPH_VALUE_KEY` / `ASCII` / `GRAPH_FILTER_SLUGS`. Graphs with no ASCII emit `::graph-*` YAML.

## Motion

`fadeUp` + `staggerList` + `graphTransition` from `graph-motion.ts`. Stagger rows/weeks, not every cell. `viewport={{ once: true }}`.

## A11y

Visible glyphs can be `aria-hidden` if a single `sr-only` sentence states the figure. Don’t dump extra `sr-only` nodes into grid tracks.

## After the source file

Wire catalog / examples / **New** slugs — see [`lib/docs/AGENTS.md`](../../lib/docs/AGENTS.md). Then `pnpm registry:build`.
