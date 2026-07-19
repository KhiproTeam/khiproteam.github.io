// Inline-only markdown renderer for i18n JSON. Supports **bold**, *italic*, `code`, [label](url). External links open in new tab. Cached.
import MarkdownIt from 'markdown-it';

const instance = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
  breaks: false,
});

// Inline only — disable block rules (renders inside existing <p>/<h*>).
(instance as any).disable(['heading', 'hr', 'list', 'blockquote', 'code', 'table', 'image', 'paragraph', 'fence', 'reference', 'html_block', 'lheading']);

// External links open safely in new tab.
const defaultLinkOpen = instance.renderer.rules.link_open || function (tokens, idx, options, _env, self) {
  return self.renderToken(tokens, idx, options);
};
instance.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const href = tokens[idx].attrGet('href') || '';
  if (/^https?:\/\//i.test(href)) {
    tokens[idx].attrSet('target', '_blank');
    tokens[idx].attrSet('rel', 'noopener noreferrer');
  }
  return defaultLinkOpen(tokens, idx, options, env, self);
};

const cache = new Map<string, string>();

export function md(str: string): string {
  const hit = cache.get(str);
  if (hit !== undefined) return hit;
  // renderInline keeps output free of wrapping <p> tags.
  const out = instance.renderInline(str);
  cache.set(str, out);
  return out;
}
