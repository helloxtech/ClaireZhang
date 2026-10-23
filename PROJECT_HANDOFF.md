# Claire Zhang — project handoff

## Current context · 2026-10-23

The current task is an admissions-oriented website redesign for visual art, design, and creative technology. The repository remains a dependency-free static site. The active release branch is `codex/editorial-preview`; integration branch is `main`. Start future implementation in a task worktree, preserving a clean canonical checkout aligned with a fresh remote read.

**Delivery scope:** on October 23 the user explicitly accepted the editorial Home, Work, Interests, Music sound entry, and the horizontal five-note guzheng website feature for production. That authorization supersedes the earlier preview-only boundary. Cloudflare Pages project `claire-zhang` publishes both `clairezhang.ca` and `helloart.ca` from `main`. The current rollback is production commit `560b3cefbf3328182bcf6bd73a93400843a4a2ae`, deployment `b2a6d35d-9048-4807-985a-498bca18dda4`; source is GitHub, output is `dist`, and production Git deployments are enabled. Release sequence: exact Git preview verification, PR, merge, then exact production verification on both domains.

## Editorial preview · 2026-10-23

**Scope:** the branch began as a preview-only redesign selected from supplied white editorial and dark sound references. The user subsequently gave explicit production acceptance on October 23; this preview-only boundary is superseded for the verified release, while future content changes still require their own authorization. Branch `codex/editorial-preview` starts from production `main` at `560b3ce`.

**Implementation:** Home now uses the white-paper, Newsreader, vermilion-accent editorial composition: concept hero, third-person introduction, authentic portrait, three named directions, and a compact factual recital band. `art.html` presents **Light at the threshold**, **Hands that remember**, and **A listening map** as website art direction and future study directions; each image is marked concept imagery rather than Claire’s work. `sound.html` is a new separately credited dark sound experience using the existing native gesture/audio DOM and `listening.js`. `art.html#interaction-study` remains a compatibility anchor that leads to `sound.html`. New optimized local assets are `images/editorial/hero.webp`, `gesture.webp`, and `sounddark.webp`.

**Cache/interaction fix:** the mobile Menu initially closed because the outside-click handler only recognized `.nav`, while editorial headers use semantic navigation. The handler now uses `nav[aria-label="Main navigation"]`; all ten HTML routes version `main.js` as `20261023-editorial-1` to prevent stale-cache behavior.

**Verification before preview push:** build, `node --check main.js`, `node --check listening.js`, and diff checks pass. Static inspection confirms 10 routes each have one H1, local assets resolve, and linked local fragments resolve. Parent CUA accepted the desktop 1190px and true 390px Home composition with no horizontal overflow, and accepted the Sound flow: Menu after cache refresh, enable sound, Enter pluck, Quiet & clear, and no console errors. `design-qa.md` records the reference comparison.

## Editorial richness correction · 2026-10-23

**Request:** the user rejected an overly sparse admissions profile and authorized a richer but factual public presentation. Home, Music, and Study Interests now restore a readable three-part journey: documented music background, three concrete *future* art/design/creative-technology questions, and the official recital programme. The site does not reintroduce generated images as Claire’s art or claim completed visual, interactive, or technical projects.

**Content boundaries:** the verified record remains nine years of guzheng; the Academy names Chen Wenying as teacher and announces the October 25, 2026 solo recital in Richmond. The official announcement supplies the programme. Interest cards use “might” and “could” as future study directions. Music keeps a natural, general guzheng introduction without commentary addressed to internal reviewers.

**Verification:** `npm run build`, `node --check main.js`, and `git diff --check` passed. A true Chrome/CUA 390px viewport check on Home, Music, and Interests measured `innerWidth=390`, document/body `scrollWidth=390`, with no element whose scroll width exceeded its client width. The mobile menu appears. The parent visual reviewer captured and accepted `rich-true-mobile.png`; the prior scaled headless capture is not mobile acceptance evidence. Narrative review passed with the official Academy facts. At this entry, changes are uncommitted on `codex/admissions-redesign`; Git preview, pull request, production deployment, dual-domain verification, and canonical reconciliation remain pending.

## Admissions-reader revision · 2026-10-23

**Current request:** make the public site suitable to share directly with admissions readers using existing facts, then update production. This is a supporting personal profile; it does not claim to replace a school’s required original portfolio. The user subsequently offered scans of Claire’s existing artwork. No scans have arrived. They will be curated later, with selected originals placed after the personal introduction and before the recital. No placeholder or generated student work is used while waiting.

**Reader journey and evidence:** Home now leads with the authentic portrait, Claire’s name, nine-year guzheng study, named teacher, sourced upcoming recital, and family-provided undergraduate study interests. Navigation is Music / About / Interests. Unsupported personality claims, invented first-person voice, purported process and AI pseudo-case studies were removed. Sources/credits distinguish the third-person AI-assisted site text from a student personal statement. Recital enquiries go to the Academy; applicant correspondence points to the contact details supplied with the actual application.

**Website feature:** the sound instrument remains at `art.html#interaction-study`, explicitly credited as website production and reached from the footer. It is separate from Claire’s work. The two former generated art case studies no longer appear on public pages; legacy anchors remain as explanatory paragraphs. Audio implementation is unchanged.

**Verification:** nine-page HTML/assets/fragment checks passed, including every `#site-credits` link. Genuine-only Home imagery verified. Chromium desktop Home and 390px views of all nine pages had no overflow or broken loaded images; mobile menu/Interests navigation and sound enable/pluck/mute smoke checks passed, with nonzero analyser response and no console errors. Existing unchanged audio behaviour checks are reused. Independent narrative and visual reviews passed; a reported credit-anchor concern was disproved by the current source and complete fragment check. Design evidence: `admissions-01-home-before.png`, `admissions-03-home-desktop.png`, `admissions-04-home-mobile.png` in the task evidence folder.

**Release:** user explicitly authorizes the production update. Rechecked Cloudflare source/domains/build and fresh remote refs before delivery. Previous production is `3a6489f4bf9ff5f69ab1ec25245c54ece2f8a78c`, deployment `a491bec0-b56e-43fa-baaa-ba779f66525d`, retained for rollback. Current publication/live receipt belongs to this revision’s GitHub pull request; no additional source commit is needed just to record its own SHA.

## Production content and listening instrument · 2026-10-23

Main owned the instrument, integration and release. Two bounded agents updated Home/About and six supporting pages in disjoint ownership. All nine public pages now have finished visitor-facing text, canonical URLs and sharing metadata, without draft notices or preparation checklists. The site distinguishes documented guzheng experience from AI-assisted website studies; no invented student artwork, awards, education or recordings are claimed. Resources exposes the real poster, printable profile and official recital announcement. Search indexing is enabled with a sitemap.

`listening.js` replaces the timed reveal with five playable D-pentatonic strings: pluck, sweep, upward pitch bend, release, keyboard equivalents, opt-in sound, volume, quiet/clear, visibility cleanup and reduced-motion rendering. A locally hosted, trimmed CC0 sample replaces synthetic oscillators; exact provenance and processing are in `audio/README.md`. No camera, microphone, recording, backend or new package dependency. Canvas traces represent live gestures; the backdrop uses the existing disclosed concept image.

Production cache finding: existing visitors could retain the former `styles.css`, making the new canvas inherit the wrong size. All page style/script URLs now carry a release version to force coherent assets.

Checks: production build, JS syntax and nine-page local links/anchors/IDs passed. Chromium exercised sample load, audio-driven analyser response, pointer sweep, keyboard pluck, clear, 390/320 px layout and reduced motion. Browser console had no errors. The final deployment and live verification belong to the PR release receipt, not an unverified claim in this source commit. Safari/device listening was not independently tested.

## Earlier identity and interaction refinement · 2026-10-23

The user asked for a further UI/UX review of Home and all three project stories, specifically Claire's identity and art/technology potential. The reviewed v2 visual system is retained. Main owns all edits and delivery; the existing visual/interaction and narrative reviewers supplied read-only critiques on this Mac. Base: `7ba59b234da13ffca1f882681bd4e46baf3f578e`, task worktree/branch unchanged, development preview only.

- **Finding:** the guzheng connection was implicit, and the interaction proposal did not define a visitor action or response. Home now states the nine-year foundation beside the genuine portrait. Three card questions lead into observation/repetition, musical gestures/materials, and duration/participation.
- **Stories:** each now describes a concrete experiment, artistic choice, and question to test. All remain proposals. Detail-image disclosures now sit on the images, and mobile anchor arrivals show the story before its image with an explicit return to all directions.
- **Interaction:** `art.html#interaction-study` contains an AI-assisted website demonstration, explicitly not made/tested by Claire. Begin → wait → release reveals a proportional amount of an existing concept image, capped at four seconds. Native buttons support keyboard/touch/click; reset works during a gesture. No sound, recording, sensors, storage, dependency, or student-authorship claim is introduced. Reduced motion updates the image only when the gesture ends; no-JavaScript mode retains a fully visible static image and explanatory fallback.
- **Provenance:** About now names the website demonstration and uses narrower Academy-announcement wording for the recital/teacher. It does not assert the recital is complete or that all nine study years were with one teacher.
- **Verification:** local build, JavaScript syntax, diff checks and nine-page link/fragment/duplicate-ID checks passed. Chromium desktop and 390/320 px checks covered the changed Home/Work flow, keyboard release, early release, automatic four-second completion, reset during a run, reduced motion and no-script fallback. No overflow or console errors observed. Both reviewers found no remaining blocking issue after the About correction. Fresh comparison evidence is in `design-qa.md`.
- **Delivery evidence:** these changes are prepared for the existing preview branch; current publication/deployment receipts are maintained in [PR #1](https://github.com/helloxtech/ClaireZhang/pull/1). The deployed v2 receipt above is the rollback point, not a claim that this refinement was already deployed when this source note was written. Family acceptance and original student work remain outstanding.

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

## Next content update

The user has offered to scan real prior artwork. Recommended intake: 3–5 candidates, full-colour originals without enhancement/cropping, with title (if any), year, medium and a brief explanation of intent. Select up to three strong originals for Home after the introduction, before the recital, and provide accurate attribution and metadata. Do not assume those files exist or that this intake blocks the currently authorized personal-profile release.

Keep recital status announced until actual completion evidence exists. School-specific original portfolio submissions remain a separate process. The old `claire-university-website-brief.md` and YAML template are historical planning documents, not verified achievements.

## Key history

- 2026-10-23 v1: nine-route factual/editorial redesign published from `deff992e3f509aef70e5e8f9b8b7058341e76576`; documentation commit `9ef358a362ca3ab62b1999a1a336ea9e5c22d489` previewed successfully. The user subsequently rejected its visual standard.
- 2026-10-23 v2: replaced that presentation with image-led Sensory Field Notes, following independent visual and visitor-journey critiques. The original review approval is superseded; its functional checks alone were insufficient evidence of design acceptance.

## Guzheng form refinement · 2026-10-23

**Scope:** accepted refinement limited to the separately credited `sound.html` website feature. Rollback is production `627c57b63cc39d29b1e435e50688926608c51e61`, deployment `bf11c617-d7c4-4866-8d70-d9fdea49558b`.

**Implementation:** The visual form now has a warm paulownia-like longitudinal-grain soundboard, dark red-brown end and thickness details, 21 parallel strings, staggered dark-wood two-leg bridges with ivory string slots, and fixed end pins. The interaction remains deliberately limited to five aligned sound zones: the 21-string form does not claim a full instrument simulation. Canvas geometry continues to derive the five active rows from the actual accessible button rectangles, so static and dynamic strings, hit testing, sweep, bend, keyboard controls, sound enable/mute, and quiet/clear remain aligned. Cache URLs for the changed Sound CSS and JavaScript are versioned.

**Verification:** Parent CUA accepted desktop and true-390px mobile views. Both showed distinct bridges without horizontal overflow; five click zones produced D / E / F♯ / A / B, enable sound, held bend, cross-string sweep, and clear reset passed with no console errors. Evidence: `guzheng-detailed-desktop.png` and `guzheng-detailed-mobile.png` in the task visualization directory. Local build, JavaScript syntax, and diff checks passed. Publish only after exact Git Preview validation, then verify both production domains and reconcile the canonical checkout.
