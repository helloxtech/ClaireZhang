# Claire Zhang — project handoff

## Current context · 2026-10-23

The current task is an admissions-oriented website redesign for visual art, design, and creative technology. The repository remains a dependency-free static site. The candidate is on `codex/admissions-redesign`; integration branch is `main`. Start future implementation in a task worktree, preserving a clean canonical checkout aligned with a fresh remote read.

**Delivery scope:** design candidate and development preview. Production has not been changed by this task. Cloudflare Pages project `claire-zhang` builds with `npm run build`, publishes `dist`, and previews all non-main branches. A push/merge to `main` automatically changes both `clairezhang.ca` and `helloart.ca`; that production trigger requires explicit target-and-scope authorization. Last verified production baseline: `9586e3e129e124991665f9bebc28d0adb31d57d2`. Recheck live configuration before any trigger.

Review destinations: [development preview](https://codex-admissions-redesign.claire-zhang.pages.dev/) and [draft PR #1](https://github.com/helloxtech/ClaireZhang/pull/1). V2 is implemented and locally verified; this commit prepares the update to that existing preview branch. Confirm the current commit's Cloudflare deployment before treating it as live. The PR remains unmerged. Production remains at the baseline above.

## Decisions and implementation · v2

The user rejected the visual quality of the first preview. Functional checks and reviewer approval had not established the intended art/design portfolio experience. V2 changes the visual hierarchy and browsing path, rather than treating that response as a request for minor polish.

- Selected the **Sensory Field Notes** direction from three visual concepts: warm ivory, navy oversized sans typography, and cobalt/coral, chartreuse, and lilac image groups. Home leads with three immediately browseable directions; a small genuine portrait and compact recital thread support them.
- Home and Work use three optimized, local AI-generated concept boards in `images/concepts/`. They are **not Claire's artwork**. Each image carries a high-contrast disclosure, including the detail images; About explains provenance. These assets must be replaced by original work before application use.
- Entire project cards link to matching Work anchors, with visible `Open direction` affordances and accessible link names. Work presents a visual, question, possible form, and prospective development; it does not claim completed projects. Internal preparation instructions moved to Materials.
- Three primary links: Work, Music, About. Supporting pages remain in the footer and all nine `.html` routes are preserved. First-person editorial voice still requires Claire's approval; the academic statement is no longer styled as a verbatim quotation.
- Shared styles, self-hosted variable-font weight range, mobile layout, and print output were updated without a framework or runtime dependency. Existing progressive navigation, keyboard behavior, reduced motion, and `noindex, nofollow` are retained. Noindex does not make this preview private.
- The original portrait and published recital poster remain authentic source assets. Generated alternate poses and hand-drawn author-like flourishes from the mock are intentionally omitted.

## Evidence and editorial boundaries

Primary source: [YCMA recital announcement](https://ycma.ca/news/claire-zhang-graduation-recital-2026/). It supports nine years of guzheng study, guidance by Chen Wenying, and the announced solo graduation recital on October 25, 2026 at 7 PM Pacific in Richmond. Do not imply all nine years were with the same teacher or that the event has already occurred. The original poster is `images/music/claire-recital.webp`; portrait came from the existing repository. Update event status only with actual completion evidence.

The family supplied an art/design and interdisciplinary art/technology application direction. Specific school choices are not part of the public portfolio. Relevant official research informing the design:

- [RISD portfolio preparation](https://www.risd.edu/admissions/first-year/portfolio-preparation): original visual range, observation, experimentation, selective process.
- [Parsons portfolio guidance](https://www.newschool.edu/parsons/portfolio-help/): individual images in the application portal, personal viewpoint and process; a website URL does not replace the submission. Explain AI assistance/collaborative roles.
- [ArtCenter portfolio video essay](https://www.artcenter.edu/admissions/undergraduate-admissions/portfolio-requirements/portfolio-video-essay.html): explain motivation, decisions, results, and revision.
- [CMU BXA first-year application](https://www.cmu.edu/interdisciplinary/apply/first-year.html): choose and satisfy the actual College of Fine Arts focus requirements.
- [NYU IMA BFA](https://tisch.nyu.edu/itp/admissions/ima-bfa): undergraduate IMA is distinct from graduate ITP.

These sources inform structure, not an admission prediction. Recheck current programme requirements when preparing submissions.

## Verification · v2

`npm run build`, `node --check main.js`, and `git diff --check` passed. A focused parser verified all nine pages, local assets/links/fragments, and one H1 per route. Chromium checks at 390 px found no horizontal overflow or broken loaded images and no console warnings/errors. Home also passed a 320 px overflow check. Desktop Home/Work and mobile Home were visually inspected; the selected concept and final desktop capture were compared together.

Menu open and Escape/focus restoration passed. A Home project card navigated to its matching Work anchor. With scripts disabled, navigation remains visible and the inactive menu button is hidden. The résumé rendered as one A4 PDF page and was visually checked. The final review elevated image provenance labels, added visible card affordances, and loosened overly tight hero letter spacing.

See `design-qa.md` for the design-specific acceptance criteria, source/capture evidence, and intentional differences. This is a reviewed **visual concept**, with family acceptance and authentic portfolio content still pending. No claim of admissions readiness, cross-browser certification, or formal WCAG conformance is made.

## Remaining content and release work

1. Inventory Claire's real artwork, sketchbooks, process images, and any digital experiments. Replace proposed entries with a small, strong selection; do not create fictitious case studies or student authorship.
2. Have Claire rewrite/approve the proposed personal voice; confirm education/year, accurate work metadata, contribution/tools, and suitable public contact details.
3. After the recital, add an authorized real recording and Claire's own reflection if available. Do not automatically mark completion from the date.
4. Prepare school-specific files in the required portals. The website is a supporting archive.
5. Review the candidate preview. Only remove draft notices/indexing restrictions and deploy production after content is verified and the production target/scope is explicitly authorized. Retain the prior commit/deployment as rollback.

The earlier `claire-university-website-brief.md` and YAML content template are historical planning context; their sample achievements are not verified records.

## Key history

- 2026-10-23 v1: nine-route factual/editorial redesign published from `deff992e3f509aef70e5e8f9b8b7058341e76576`; documentation commit `9ef358a362ca3ab62b1999a1a336ea9e5c22d489` previewed successfully. The user subsequently rejected its visual standard.
- 2026-10-23 v2: replaced that presentation with image-led Sensory Field Notes, following independent visual and visitor-journey critiques. The original review approval is superseded; its functional checks alone were insufficient evidence of design acceptance.
