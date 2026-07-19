// Server-side i18n bundles. bn rendered at / , en at /en/ — picked per route.
import bnMeta from './bn/meta.json';
import bnHeader from './bn/header.json';
import bnHero from './bn/hero.json';
import bnProjects from './bn/projects.json';
import bnTeam from './bn/team.json';
import bnCommunity from './bn/community.json';
import bnFooter from './bn/footer.json';
import enMeta from './en/meta.json';
import enHeader from './en/header.json';
import enHero from './en/hero.json';
import enProjects from './en/projects.json';
import enTeam from './en/team.json';
import enCommunity from './en/community.json';
import enFooter from './en/footer.json';

export const bn = {
  meta: bnMeta,
  header: bnHeader,
  hero: bnHero,
  projects: bnProjects,
  team: bnTeam,
  community: bnCommunity,
  footer: bnFooter,
};

export const en = {
  meta: enMeta,
  header: enHeader,
  hero: enHero,
  projects: enProjects,
  team: enTeam,
  community: enCommunity,
  footer: enFooter,
};

export type Language = 'bn' | 'en';
