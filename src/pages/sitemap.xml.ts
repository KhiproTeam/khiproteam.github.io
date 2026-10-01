import type { APIRoute } from 'astro';

const site = 'https://khiproteam.com';

// Only this site's own pages. khipro.khiproteam.com (docs site) has its own sitemap.
const pages = import.meta.glob('./**/*.{astro,md,mdx}');

const isStatic = (id: string) => !/[[\]]/.test(id);
const isIndexable = (id: string) =>
  isStatic(id) && !/(^|\/)(404|500)\.[^/]+$/.test(id);

// './index.astro' -> '/', './en/index.astro' -> '/en/', './about.astro' -> '/about/'
const toPath = (id: string) => {
  const path = id.replace(/^\.\//, '').replace(/\.[^./]+$/, '');
  const stripped = path.replace(/(^|\/)index$/, '').replace(/\/+$/, '');
  return stripped === '' ? '/' : `/${stripped}/`;
};

const paths = Object.keys(pages)
  .filter(isIndexable)
  .map(toPath)
  .sort();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${site}${path}</loc></url>`).join('\n')}
</urlset>
`;

export const GET: APIRoute = () =>
  new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
