# RIPL Wealth | V11.1

## Load into the existing project

1. Unzip this complete package.
2. Copy all contents into your existing riplwealth.com GitHub Desktop repository, replacing matching files and merging folders. Include src, public, scripts, tests, package.json and package-lock.json.
3. Commit and push to the connected branch.
4. Let Cloudflare build, then review your preview URL.

Upload the extracted files, not the ZIP. Do not upload node_modules or dist.

## Cloudflare settings

Build command: npm run build
Output directory: dist

The postbuild step automatically creates search-index.json from the generated pages. Keep the scripts folder and updated package files so search works after each deployment.

## Local checks

npm install
npm run build
node tests/v11.mjs
node tests/search-ui.mjs
node tests/calculator-controls.mjs

For local development, run npm run build first to generate the search index, then use npm run preview to exercise search against the full built site.

## Preview and production

The package retains the existing noindex and robots.txt preview restrictions. No custom-domain or production indexing change is made here. For an intended public domain launch, both the robots.txt crawler block and preview noindex setting must be updated; PUBLIC_INDEXABLE=true alone does not change robots.txt.

See REVIEW-NOTES.md for changes and verification limits.
