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
- Facebook and Pinterest footer icons intentionally remain `href="#"` placeholders until their official profile URLs are supplied. Replace these before launch if they should navigate to social profiles.
- `git diff --check` passed. JavaScript syntax checking and a fresh browser/Lighthouse run could not be performed in this workspace because Node.js and Lighthouse are unavailable. Forms use live Formspree endpoints; end-to-end delivery still needs a real submission check before launch.
