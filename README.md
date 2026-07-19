# KhiproTeam

Source for [khiproteam.com](https://khiproteam.com) — the homepage of **KhiproTeam**, an open-source team building Bengali-language computing tools.

Bilingual (Bengali `bn` at `/`, English `en` at `/en/`), static, no client framework.

## Projects

- **Khipro** — first compositional lowercase Bengali keyboard layout (Linux, Android, Windows). [khipro.khiproteam.pro.bd](https://khipro.khiproteam.pro.bd/) · [source](https://github.com/khiproteam/khipro)
- **Shörolipi** — 26-key unambiguous Banglish-to-Bengali transliteration. [source](https://github.com/KhiproTeam/shorolipi)

## Stack

Astro 7 · Tailwind CSS 4 · markdown-it · route-based i18n (JSON bundles in `src/i18n/`).

## Develop

Requires Node ≥ 22.12.

```sh
npm install
npm run dev          # local server at localhost:4321
npm run build        # output to dist/
npm run preview      # preview the build
npm run check:links  # verify bn/en locale hrefs match
```

## Structure

```
public/          static assets (icons, og image, robots.txt, llms.txt, manifest)
src/components/  page sections (Header, Hero, Projects, Team, Community, Footer)
src/i18n/        bn/ + en/ JSON message bundles; md.ts inline renderer
src/layouts/     Layout.astro — <head>, SEO, schema.org, CSP, theme init
src/pages/       index.astro (bn) · en/index.astro (en)
src/scripts/     app.ts — theme toggle + mobile menu
src/styles/      app.css — design tokens, dark mode
scripts/         check-links.mjs — locale href parity check
```

## License

[GPL-3.0](LICENSE).
