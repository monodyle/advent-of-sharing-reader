// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4321',
  output: 'hybrid',
  integrations: [tailwind(), sitemap(), mdx()]
});