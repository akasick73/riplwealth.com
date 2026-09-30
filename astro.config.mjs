import { defineConfig } from 'astro/config';
export default defineConfig({site:process.env.SITE_URL || 'https://riplwealth.com',output:'static',compressHTML:true,trailingSlash:'always'});
