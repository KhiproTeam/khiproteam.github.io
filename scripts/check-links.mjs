// Verify bn/en locale JSONs share the same hrefs. Run: node scripts/check-links.mjs

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N = resolve(__dirname, '../src/i18n');

function load(locale, file) {
  return JSON.parse(readFileSync(resolve(I18N, locale, file), 'utf8'));
}

// Pull [label](url) hrefs from a string.
function mdLinks(str) {
  if (typeof str !== 'string') return [];
  return [...str.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)].map((m) => m[2]);
}

// Recursively gather every href from an object tree (strings, {href} objects, arrays).
function collectHrefs(obj, path = '') {
  const hrefs = [];
  if (obj == null) return hrefs;

  if (typeof obj === 'string') {
    for (const h of mdLinks(obj)) hrefs.push({ href: h, path });
    return hrefs;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => hrefs.push(...collectHrefs(item, `${path}[${i}]`)));
    return hrefs;
  }

  if (typeof obj === 'object') {
    // Record if object has an href.
    if ('href' in obj) hrefs.push({ href: obj.href, path });
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'chips' || k === 'chipsIcons') continue; // skip non-link arrays
      hrefs.push(...collectHrefs(v, path ? `${path}.${k}` : k));
    }
  }
  return hrefs;
}

// Structured hrefs only (links/socials/community); skips prose markdown.
function collectStructuralHrefs(obj, path = '') {
  const hrefs = [];
  if (obj == null || typeof obj === 'string') return hrefs;

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => hrefs.push(...collectStructuralHrefs(item, `${path}[${i}]`)));
    return hrefs;
  }

  if (typeof obj === 'object') {
    if ('href' in obj && 'icon' in obj) {
      hrefs.push({ href: obj.href, path, icon: obj.icon });
    }
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'chips' || k === 'chipsIcons') continue;
      hrefs.push(...collectStructuralHrefs(v, path ? `${path}.${k}` : k));
    }
  }
  return hrefs;
}

// Extract markdown-prose hrefs only.
function collectProseHrefs(obj, path = '') {
  const hrefs = [];
  if (obj == null) return hrefs;

  if (typeof obj === 'string') {
    for (const h of mdLinks(obj)) hrefs.push({ href: h, path });
    return hrefs;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => hrefs.push(...collectProseHrefs(item, `${path}[${i}]`)));
    return hrefs;
  }

  if (typeof obj === 'object') {
    // Skip structural objects (href+icon).
    if ('href' in obj && 'icon' in obj) return hrefs;
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'chips' || k === 'chipsIcons') continue;
      hrefs.push(...collectProseHrefs(v, path ? `${path}.${k}` : k));
    }
  }
  return hrefs;
}

function compare(label, bnHrefs, enHrefs) {
  const bnSet = new Set(bnHrefs.map((h) => h.href).sort());
  const enSet = new Set(enHrefs.map((h) => h.href).sort());

  const onlyBn = [...bnSet].filter((h) => !enSet.has(h));
  const onlyEn = [...enSet].filter((h) => !bnSet.has(h));

  if (onlyBn.length === 0 && onlyEn.length === 0) return true;

  console.error(`\n❌ Drift in ${label}:`);
  if (onlyBn.length) {
    console.error(`  Only in bn (${onlyBn.length}):`);
    onlyBn.forEach((h) => console.error(`    ${h}`));
  }
  if (onlyEn.length) {
    console.error(`  Only in en (${onlyEn.length}):`);
    onlyEn.forEach((h) => console.error(`    ${h}`));
  }
  return false;
}

let ok = true;

// Structural arrays: projects.links, team.members.*.socials, community.items.*.href
for (const file of ['projects.json', 'team.json', 'community.json']) {
  const bnData = load('bn', file);
  const enData = load('en', file);
  const bnStruct = collectStructuralHrefs(bnData).map((h) => h.href);
  const enStruct = collectStructuralHrefs(enData).map((h) => h.href);
  if (!compare(`structural:${file}`, bnStruct, enStruct)) ok = false;
}

// Markdown prose hrefs (inline [text](url) in description/para fields)
for (const file of ['hero.json', 'projects.json']) {
  const bnData = load('bn', file);
  const enData = load('en', file);
  const bnProse = collectProseHrefs(bnData).map((h) => h.href);
  const enProse = collectProseHrefs(enData).map((h) => h.href);
  if (!compare(`prose:${file}`, bnProse, enProse)) ok = false;
}

if (ok) {
  console.log('✅ All bn/en hrefs match — no drift.');
} else {
  console.error('\nFix the drift above, then re-run: npm run check:links');
  process.exit(1);
}
