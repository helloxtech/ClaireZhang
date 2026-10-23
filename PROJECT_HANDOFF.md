# Claire Zhang — project handoff

## Current context · 2026-10-23

The current task is an admissions-oriented website redesign for visual art, design, and creative technology. The repository remains a dependency-free static site. The candidate is on `codex/admissions-redesign`; integration branch is `main`. Start future implementation in a task worktree, preserving a clean canonical checkout aligned with a fresh remote read.

**Delivery scope:** design candidate and development preview. Production has not been changed by this task. Cloudflare Pages project `claire-zhang` builds with `npm run build`, publishes `dist`, and previews all non-main branches. A push/merge to `main` automatically changes both `clairezhang.ca` and `helloart.ca`; that production trigger requires explicit target-and-scope authorization. Last verified production baseline: `9586e3e129e124991665f9bebc28d0adb31d57d2`. Recheck live configuration before any trigger.

## Decisions and implementation

- Replaced nine legacy pages with one coherent editorial design: warm paper, dark green, self-hosted Newsreader/Inter, genuine portrait and recital poster. Kept existing `.html` URLs, four primary links, and contextual footer navigation. No framework, analytics, form service, or new runtime dependency.
- Work and creative inquiry now precede the recital on the home page. `art.html` contains three clearly proposed studies: observational light, gesture/material memory, and a listening-based interaction idea. Each provides a question, medium, evidence needed, and reflection prompt. These are not completed student projects.
- `music.html` carries verified recital context and programme. `about.html` distinguishes sourced facts from AI-assisted draft voice. `academics.html` frames intended art/design/technology questions. Résumé is a print-ready draft; materials/contact pages have useful destinations rather than dummy downloads or an unconfirmed mailbox.
- Removed stock images presented as student work, unrelated video, unverified awards/metrics, and dead download links. All pages retain `noindex, nofollow` and a prominent draft notice. These prevent accidental presentation as a finished application package, but do not make a preview private.
- Mobile navigation, Escape/focus behavior, no-JavaScript navigation, reduced motion, semantic headings, image dimensions/alt text, and print styling are implemented.

## Evidence and editorial boundaries

Primary source: [YCMA recital announcement](https://ycma.ca/news/claire-zhang-graduation-recital-2026/). It supports nine years of guzheng study, guidance by Chen Wenying, and the announced solo graduation recital on October 25, 2026 at 7 PM Pacific in Richmond. Do not imply all nine years were with the same teacher or that the event has already occurred. The original poster is `images/music/claire-recital.webp`; portrait came from the existing repository. Update event status only with actual completion evidence.

The family supplied an art/design and interdisciplinary art/technology application direction. Specific school choices are not part of the public portfolio. Relevant official research informing the design:

- [RISD portfolio preparation](https://www.risd.edu/admissions/first-year/portfolio-preparation): original visual range, observation, experimentation, selective process.
- [Parsons portfolio guidance](https://www.newschool.edu/parsons/portfolio-help/): individual images in the application portal, personal viewpoint and process; a website URL does not replace the submission. Explain AI assistance/collaborative roles.
- [ArtCenter portfolio video essay](https://www.artcenter.edu/admissions/undergraduate-admissions/portfolio-requirements/portfolio-video-essay.html): explain motivation, decisions, results, and revision.
- [CMU BXA first-year application](https://www.cmu.edu/interdisciplinary/apply/first-year.html): choose and satisfy the actual College of Fine Arts focus requirements.
- [NYU IMA BFA](https://tisch.nyu.edu/itp/admissions/ima-bfa): undergraduate IMA is distinct from graduate ITP.

These sources inform structure, not an admission prediction. Recheck current programme requirements when preparing submissions.

## Verification

`npm run build`, `node --check main.js`, and `git diff --check` passed. Focused HTML/asset checks cover all nine routes, local links/fragments, one H1 per page, and no placeholder links. In-app Chromium checks cover all nine pages at 390 px: no horizontal overflow or broken images; no console warnings/errors. Home checked at 320 px and desktop; menu open, Escape/focus restoration, and Work navigation passed. With scripts disabled, navigation remains visible and the inactive menu button is hidden. Résumé print output rendered as one A4 page and was visually inspected.

Visual and editorial reviewers accepted the **design draft** after the target-direction revision. See `design-qa.md` for visual evidence and intentional deviations from the selected concept. No Safari/Firefox/device-wide or formal WCAG conformance claim is made.

## Remaining content and release work

1. Inventory Claire's real artwork, sketchbooks, process images, and any digital experiments. Replace proposed entries with a small, strong selection; do not create fictitious case studies or student authorship.
2. Have Claire rewrite/approve the proposed personal voice; confirm education/year, accurate work metadata, contribution/tools, and suitable public contact details.
3. After the recital, add an authorized real recording and Claire's own reflection if available. Do not automatically mark completion from the date.
4. Prepare school-specific files in the required portals. The website is a supporting archive.
5. Review the candidate preview. Only remove draft notices/indexing restrictions and deploy production after content is verified and the production target/scope is explicitly authorized. Retain the prior commit/deployment as rollback.

The earlier `claire-university-website-brief.md` and YAML content template are historical planning context; their sample achievements are not verified records.
