# Website Optimization Report — Run 1

**Project:** MON Events & Bridal static website  
**Date:** 4 October 2026  
**Scope:** All eight HTML pages and their shared loading behavior

## Summary

The first pass focused on reducing delays from shared third-party resources and keeping JavaScript from blocking document parsing. Existing image delivery was reviewed: site photography is already served as WebP, and below-the-fold content images are generally lazy-loaded.

## Changes made

- Added early `preconnect` hints for Google Fonts and its font file host across all pages.
- Added a `preconnect` hint for the Font Awesome CDN on pages that load its stylesheet.
- Added `display=swap` to the Google Fonts request so fallback text can render while web fonts load.
- Added `defer` to external page scripts. Deferred scripts download without blocking HTML parsing and execute in document order after parsing.
- Preserved existing eager/high-priority loading for each page’s leading image, and existing lazy loading for below-the-fold images.

## Expected impact

- Earlier connections may reduce setup latency for fonts and icon stylesheets.
- Font swapping should reduce the period in which text could be invisible while web fonts load.
- Deferred scripts should let the browser parse and display page content before executing page behavior.
- No image assets or visible content were changed in this run.

These are expected benefits based on the resource loading changes; no before/after performance measurements have been taken.

## Review and verification

- Reviewed all eight HTML pages and their image, stylesheet, and script loading patterns.
- `git diff --check` completed without whitespace errors.
- Browser behavior, accessibility, SEO indexing, and Core Web Vitals were not measured in this run.

## Follow-up opportunities

1. Measure representative pages with Lighthouse or PageSpeed Insights and record LCP, CLS, INP, and transfer sizes as a baseline.
2. Review image dimensions and generate responsive image variants for the largest assets, especially `Past work 1.webp` (about 708 KB).
3. Consider replacing the full Font Awesome stylesheet with only the few footer icons used, or with inline SVGs.
4. Review metadata consistency across pages, including canonical URLs and social previews.

## Files changed in Run 1

`index.html`, `about.html`, `contact.html`, `gallery.html`, `hire-a-decorator.html`, `hire-a-decorator-questionnaire.html`, `hire-decor-items.html`, and `hire-decor-items-booking.html`.

---

# Website Optimization Report — Run 2

**Project:** MON Events & Bridal static website  
**Date:** 8 October 2026  
**Scope:** All eight HTML pages, shared styles and scripts, image delivery, accessibility, and SEO

## Summary

This pass reduced image transfer sizes, removed JavaScript-dependent hiding of page content, improved keyboard and screen-reader support, and fixed issues in the décor booking flow. SEO discovery files and a site favicon were added.

## Changes made

- Generated compressed WebP display copies, capped at 1,800 pixels on the longest side, and updated page image sources to use them. Original images remain in place for full-size gallery and catalogue views.
- Reduced the complete WebP image set from 6,322 KiB to 5,003 KiB, a 20.9% reduction. The 723 KB `Past work 1.webp` display copy is about 88 KB.
- Added intrinsic image width and height attributes to reserve layout space while images load.
- Changed Google Fonts and Font Awesome stylesheets to load asynchronously, with `noscript` stylesheet fallbacks.
- Removed the body fade-in and scroll reveal behavior that could leave content invisible until JavaScript or an observer ran. Removed the unused gallery filter script reference and related dead CSS.
- Added skip links, labelled navigation, main landmarks, current-page link state, reduced-motion handling, stronger keyboard focus indicators, modal focus handling, and descriptive quantity-control labels.
- Darkened the gold and muted text colors to improve contrast against the site backgrounds.
- Fixed booking item-name mismatches, validated URL-provided selections, rendered those values as text rather than HTML, capped quantities, and corrected conditional delivery-address visibility.
- Removed placeholder social links and the invalid WhatsApp destination. Added the missing SVG favicon.
- Added `robots.txt` and `sitemap.xml`, aligned the homepage canonical URL with the root URL, and removed inactive HTML/CSS fragments.

## Review and verification

- Static audit passed for all eight pages: one main landmark and H1 per page, unique IDs, image alt attributes, valid local references, parseable JSON-LD, and a valid sitemap.
- `git diff --check` passed.
- Headless Chrome rendered the homepage and the booking page with selected items in its query string.
- Lighthouse was not run because Lighthouse and Node.js are not installed in this workspace. No numerical Lighthouse, Core Web Vitals, or before/after runtime measurements are available.

## Follow-up opportunities

1. Install or provide Lighthouse tooling, then measure representative desktop and mobile pages and record LCP, CLS, INP, and accessibility/SEO scores.
2. If further image savings are needed, generate multiple responsive widths and use `srcset`/`sizes` so small screens can download smaller files.
3. Consider replacing the full Font Awesome stylesheet with a small set of inline SVG icons.

## Files changed in Run 2

All eight HTML pages; `booking.js`, `catalogue.js`, `catalogue-lightbox.js`, `formspree.js`, `lightbox.js`, `script.js`, and `style.css`; optimized WebP display copies under `assets/optimized/`; and the new `favicon.svg`, `robots.txt`, and `sitemap.xml`.

## Motion follow-up — 8 October 2026

- Enabled native cross-document View Transitions where the browser supports them, with a brief fade and small vertical movement.
- Kept smooth anchor scrolling and added scroll offset for the fixed navigation header.
- Added subtle viewport-entry transitions for supporting cards and sections. Content remains visible when Intersection Observer is unavailable, and keyboard focus reveals animated items.
- Reduced-motion preferences disable the page transitions, smooth scrolling, and reveal movement.
- `git diff --check` passed. No new Lighthouse score or browser motion measurement was taken.

## Prelaunch audit — 8 October 2026

- Confirmed all eight HTML pages have one `main` landmark, one title, a meta description, canonical URL, and parseable JSON-LD. IDs are unique, images have alt attributes, and local page, script, stylesheet, and image references resolve.
- Confirmed the sitemap XML parses and lists the eight intended URLs. The root URL maps to `index.html` under the site's expected static-host configuration.
- Added `type="button"` to each mobile navigation toggle so it cannot submit a form if the markup is later rearranged.
- Facebook footer links now point to the supplied Facebook share URL and open in a new tab. Pinterest footer icons remain `href="#"` placeholders until an official profile URL is supplied.
- `git diff --check` passed. JavaScript syntax checking and a fresh browser/Lighthouse run could not be performed in this workspace because Node.js and Lighthouse are unavailable. Forms use live Formspree endpoints; end-to-end delivery still needs a real submission check before launch.

### Image + Portfolio SEO

- [x] Portfolio projects inventoried on the featured work page
- [x] Portfolio image filenames and descriptive alt text optimized
- [x] Image compression and responsive delivery checked; portfolio images include 480px and 800px WebP sources
- [x] Important projects have useful context and captions
- [x] Portfolio linked to the relevant event styling and decor hire pages
- [ ] Project locations and venues verified before publication
- [x] Image sitemap added for portfolio photographs
- [x] Decor photography set for portfolio Open Graph and Twitter link previews
- [x] Portfolio page has relevant internal links to services

Portfolio venues and locations remain unverified because they are not identified in the supplied project material. No venue names or event locations have been added to image descriptions.
Open Graph and Twitter preview metadata points to the portfolio image; rendered previews still need checking once the new domain is live.

### Future follow-up

- Verify each project's venue and location with MON Events & Bridal before adding place names to captions, image text, or structured data.
- After `monspaces.co.za` is connected, confirm DNS and HTTPS, choose the preferred host (`monspaces.co.za` or `www.monspaces.co.za`), and configure redirects from the old domain and any nonpreferred host to the canonical host.
- Once the site is live, inspect the portfolio link preview in social preview tools and confirm the image loads from the new domain. Search engines choose their own result titles, snippets, and thumbnails, so check actual results after indexing.
- Reassess the image sitemap after launch. Portfolio images already use standard HTML `<img>` elements; keep the image entries if Search Console shows discovery or indexing benefit.
- Review the portfolio on mobile and desktop in a browser after deployment, including caption legibility, responsive image selection, and full-size lightbox images.

### Content + Semantic SEO

- [x] Topic clusters mapped to actual services in `CONTENT-SEO-PLAN.md`
- [x] Search intent assigned to each target page in `CONTENT-SEO-PLAN.md`
- [x] Content gaps prioritized by business value in `CONTENT-SEO-PLAN.md`
- [x] Wedding decor planning guide drafted in `wedding-decor-planning-guide.html`
- [x] Supporting content links to commercial pages — the portfolio and planning guide link to event styling and decor hire
- [x] Duplicate and thin content reviewed; homepage and service page roles are differentiated, and conversion forms are noindex
- [x] Existing first-hand material is connected: MON's published process, origin story, original portfolio images, and customer reviews
- [x] Guide draft reviewed against the site's stated services and brand voice
- [x] Editorial plan and publishing priorities established in `CONTENT-SEO-PLAN.md`

The guide remains a draft until MON Events & Bridal verifies and approves the copy and operational details for publication.

### Technical + On-Page SEO closeout — 18 October 2026

- Confirmed all 10 HTML pages have one title, a meta description, a canonical URL, one H1, unique IDs, and parseable JSON-LD. Local page, script, stylesheet, and image references resolve; the sitemap XML parses and lists the seven intended indexable landing pages. The privacy page and two enquiry/booking forms remain `noindex` and are excluded from the sitemap by design.
- Confirmed the portfolio uses responsive WebP image variants and descriptive alt text. Added intrinsic dimensions to three lazy-loaded About page images to reserve their layout space while loading.
- Rendered the homepage in headless Chrome from the local static server. This confirms a browser can render the homepage markup and execute its deferred scripts in this environment; it is not a production browser or device compatibility sign-off.
- `git diff --check` passed after this closeout.
- A numerical performance audit (Lighthouse/PageSpeed and Core Web Vitals) remains outstanding: Lighthouse and Node.js are not installed here, and the production hostname did not resolve from the available network environment. No LCP, CLS, INP, or SEO score is claimed.
- Production launch checks remain outstanding until DNS resolves and the deployed site can be checked over HTTPS: preferred-host redirects, response headers, live asset URLs, robots/sitemap responses, social previews, and real form delivery.
