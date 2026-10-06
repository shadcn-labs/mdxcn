# Contributing to mdxcn

mdxcn is part of [Shadcn Labs](https://www.shadcn-labs.com/). It ships React component source through a shadcn registry, not an npm package.

## Prerequisites and setup

- Node.js 22+
- pnpm 10.28.2 (the version used in CI)

```bash
git clone https://github.com/shadcn-labs/mdxcn.git
cd mdxcn
pnpm install
pnpm dev
```

The documentation site runs at http://localhost:3000.

## Checks

```bash
pnpm lint
pnpm test
pnpm build
pnpm typecheck
```

`pnpm build` builds the registry and the Next.js site. CI runs these checks on pull requests and pushes to `main`. Build before typechecking to include generated Next.js types.

Use the repository's Prettier configuration (no semicolons, double quotes, Tailwind class sorting). Avoid formatting unrelated files.

## Before opening a pull request

Search existing [issues](https://github.com/shadcn-labs/mdxcn/issues), [discussions](https://github.com/shadcn-labs/mdxcn/discussions), and pull requests. Link an issue for your change. Discuss non-trivial changes before implementing them.

Keep each PR focused on one concrete bug or use case. Do not bundle unrelated refactors, broad rewrites, or style-only changes. Comment on an issue before starting work so contributors do not duplicate it.

## Component changes

Component source lives in `registry/default`. Site imports use `components/graphs`. Documentation pages are generated from `lib/docs/catalog.ts`; there is no per-component route.

When adding a graph:

1. Add `registry/default/graph-<name>/graph-<name>.tsx` and its item in `registry.json`, including files on the `all` item.
2. Export it from `registry/default/index.ts` and `components/graphs/index.ts`.
3. Update `lib/docs/catalog.ts` and `lib/docs/files.ts`.
4. Add examples in `components/docs/examples.tsx` and register them in `examplesBySlug`. MDX code must match the preview; JS-only examples use `source: "tsx"`.
5. Replace `NEW_SLUGS` in `lib/docs/new.ts` with this drop's slugs. Update README features only if capabilities change; preserve shadercn's README structure and keep the component catalog in the docs.
6. Add Comark props in `lib/docs/comark-props.ts` and numeric/required adapter fields in `registry/default/graph-comark/adapters.ts`.
7. Update the Knap value keys, ASCII, and filters in `graph-knap`. Character-grid figures also need a fenced drawing in `graph-knap/graphs.ts` and an `MDX_SLUGS` entry.
8. Reuse shared Markdown helpers in `graph-frame/graph-markdown.ts`. New grammar rules belong in `lib/docs/grammar.ts` and must match the Knap string parser.
9. Run `pnpm test` and `pnpm registry:build`. Commit regenerated `public/r/` files with the source.
10. Add a homepage slot only if the component earns one.

Preserve the graph vocabulary: Geist Mono, dashed frames, `+` corners, glyph-based drawings, and one accent by default. Forward `corner`; drawing graphs also accept `glyphs` and `palette`. Respect reduced motion.

`pnpm test` compiles documentation examples through real MDX + GFM, including swapped tags, and compares them with the preview. Exercise the affected component on the documentation site as well.

Social metadata points directly to `/og.png`, served from `public/og.png`. Its URL, dimensions, and alt text are defined by `SITE_OG_IMAGE` in `lib/site.ts`. The README banner is `.github/assets/gh.png`.

## Submitting a pull request

1. Fork the repository and branch from `main`.
2. Link the issue and explain the problem, solution, and any breaking changes.
3. Update affected documentation and behavioral tests.
4. Run the checks above and include useful manual verification.
5. Sign off every commit with `git commit -s`.

## Developer Certificate of Origin

Contributions follow the [Developer Certificate of Origin](https://developercertificate.org/). Each commit must contain a `Signed-off-by` line matching the author's name and email:

```text
Signed-off-by: Jane Doe <jane.doe@example.com>
```

Use `git commit -s` to add it. For the latest commit, use `git commit --amend -s --no-edit`.

## Community and security

By participating, you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Report vulnerabilities privately following [SECURITY.md](SECURITY.md), not in public issues.

## License

Contributions are licensed under the same [MIT License](LICENSE) as the project. Preserve existing author attribution.
