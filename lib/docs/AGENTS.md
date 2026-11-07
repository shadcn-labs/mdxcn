# Docs catalog

Sidenav, `/docs/[slug]`, install copy, and props tables all read from here. Adding a catalog row is what creates the page.

## Files

| File                                  | Role                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| `catalog.ts`                          | `components[]` — slug, title, name, description, registry, props                |
| `grammar.ts`                          | The Markdown rules every component reads. `/docs/grammar`, `/llms.txt`, skill   |
| `mdx-wiring.ts`                       | `withMdxcn` copy for `/docs/mdx`                                                |
| `files.ts`                            | Source paths shown on the Manual / GitHub install tabs                          |
| `new.ts`                              | `NEW_SLUGS` — which sidenav links get a **new** mark                            |
| `recipes.ts`                          | Composed write-ups on `/docs/examples` and `/llms.txt`                          |
| `skill.ts`                            | Agent skill copy, chooser table, example prompts, curl install on `/docs/skill` |
| `skill-files.ts`                      | Reads `skills/mdxcn` for `/skill.md` and the docs page                   |
| `ascii.ts`                            | Fenced ASCII examples for the MDX install tab and `/llms.txt` `## MDX`          |
| `comark.ts` / `comark-props.ts`       | `::graph-*` YAML for the Comark tab, `/llms.txt` `## Comark`, `/comark`         |
| `knap.ts`                             | `graph_*` templates for the Knap tab, `/llms.txt` `## Knap`, `/knap`            |
| `components/docs/examples.tsx`        | `examplesBySlug[slug]`                                                          |
| `components/docs/recipe-card.tsx`     | Live previews for recipes                                                       |
| `components/docs/nav.tsx`             | Renders `isNewSlug(item.slug)`                                                  |
## New marks

`NEW_SLUGS` is the **current drop**, not a changelog.

When you ship new graphs:

```ts
export const NEW_SLUGS = ["graph-this-drop", "graph-also-this-drop"] as const
```

Replace the array. Do not append last drop’s slugs. Empty the list if nothing in this change is new.

Marks are sidenav-only (desktop + mobile). Tiny mono `new` in `text-graph-accent`. No pill chrome. Do not badge the `/docs` component grid unless asked.

`nav.tsx` already calls `isNewSlug`. Don’t hardcode slugs there.

## Palette prop

Drawing graphs take `palette?: "mono" | "duo" | "multi"`. Don't paste it into every catalog row. `PALETTE_SLUGS` + `paletteProp` in `catalog.ts` inject it before `corner`. `frameProp` is injected after `corner` on every item; don't add it by hand. Skip table, sheet, invoice, spec, stat, tree, frame.

`when` / `not` live in `lib/docs/chooser.ts`. They feed the agent prompt, docs blurb, and `/llms.txt`. Update that map when you add a graph. Composed examples live in `recipes.ts` — add a recipe there and a preview in `recipe-card.tsx`.

## MDX (ASCII)

Graphs that are a character grid get a fenced ASCII. Renderers live in `registry/default/graph-knap/graphs.ts` (`lib/ascii` re-exports). Markdown bodies are parsed by `graph-knap/markdown.ts` (`drawMarkdown`) — the docs `.md` tab, content Knap filters, and `MDX_SLUGS` content entries all go through it. Example tabs: `.mdx` is the source, `.md` the fenced figure, `.tsx` the React. Example props for the docs tab live in `ascii.ts`. Add the slug to `MDX_SLUGS` when the figure survives a `<pre>` without wrapping. Skip flow, plot, activity, heatmap, calendar, timer, countdown, and frame (`MDX_SKIP_SLUGS`). Fenced ASCII also ships in `/llms.txt` under `## MDX` so agents can paste them into README / GitHub / Linear instead of JSX.

## Comark

`::graph-*` blocks for [Comark](https://comark.dev). Content tags (`::callout`, `::steps`, …) take a Markdown body; graph blocks take YAML or the same Markdown body. A `body` key in `COMARK_PROPS` is written inside the block. Example YAML in `lib/docs/comark-props.ts` → docs **Comark** tab and `/llms.txt` `## Comark`. Adapter: `registry/default/graph-comark/` (`coerce.ts`, `adapters.ts`, `from-markdown.tsx`, `layout.tsx`, `graph-comark.tsx` tag map). Landing `/comark`, wiring `/docs/comark`. No catalog row.

## Knap

`graph_*` filters for [Knap](https://knap.md). Same example props as Comark. Filters: `registry/default/graph-knap/` (`frame.ts`, `graphs.ts`, `yaml.ts`, `props.ts`, `filters.ts`, `graph-knap.ts`). Landing `/knap`, wiring `/docs/knap`. No catalog row. The Knap CLI does not load custom filters — wire `graphFilters` in `createEngine`.
