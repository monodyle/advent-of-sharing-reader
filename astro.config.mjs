// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://webuild.takea.cafe',
  output: 'hybrid',
  integrations: [tailwind(), sitemap(), mdx()],
  adapter: cloudflare()
});
