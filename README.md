# RIPL Wealth website · V1 review draft

Astro static site adapted from the supplied AdamKasick.com V9 source.

## Run locally

```sh
npm ci
npm run dev
```

## Cloudflare Pages

Connect the `akasick73/riplwealth.com` repository. Choose the Astro preset, build command `npm run build`, output directory `dist`, and main as the production branch. Use the generated pages.dev preview address. Do not attach the live domain yet.

Optional environment variable: `SITE_URL` can be set to the exact generated preview URL, so canonical URLs and sitemap links match the preview. The default is the future `https://riplwealth.com` address. There is no custom worker or server dependency.

The compiled-preview ZIP can also be extracted and its contents deployed using Cloudflare Pages Direct Upload. Direct Upload and Git integration have different project workflows; use the Git-integrated project for ongoing edits.

## Assessment delivery

Uses the supplied updated Quiz (2), binary mindset answers, two six-statement screens, and one five-pair tendency screen. Seven personas are retained. Exact stage ties are disclosed. All-negative stage answers are marked as no clear match.

Visitors can see results without sharing. If they choose to share, only name, email, optional phone, persona and overlapping stages are sent through FormSubmit to adam@riplwealth.com with chase@riplwealth.com copied. Raw answers stay in the browser. No assessment data or personal information goes to analytics. No analytics account is configured in this draft.

FormSubmit must be activated for the recipient inbox and tested from the deployed preview before delivery is considered working. Inbox delivery and the copied recipient have not been verified. No visitor result email is promised or configured. No automated newsletter or SMS subscription is added. Contact requests use the same recipient pair.

## Booking

Chase: https://calendly.com/chase-riplwealth/talk-to-the-founder
Adam: https://calendly.com/adam-riplwealth/30min

## Before launch

- Review all copy, privacy language, investment explanations, and persona descriptions with the firm and ICA.
- Confirm Taska Skott spelling (supplied by Adam) versus Tasha in the older Brain.
- Match Ashton and Taska to the supplied portraits; their V1 cards intentionally use initials until identity is confirmed.
- Confirm current adviser registration and disclosure documents.
- Activate and test FormSubmit, including CC receipt.
- Test desktop and mobile layout in a real browser. Automated browser rendering was unavailable in the build environment.
- Set SITE_URL to the final domain and PUBLIC_INDEXABLE=true only at launch.
- Replace public/robots.txt with an allow-crawl file and final sitemap URL; remove X-Robots-Tag from public/_headers when ready for indexing.

The domain is not connected. This draft is not a compliance approval.
