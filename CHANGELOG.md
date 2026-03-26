# Changelog

All notable changes to ResumeGap are documented here.

---

## [Unreleased]

### Added
- Auth callback now upserts profile row as fallback when Supabase trigger doesn't fire
- Auth callback redirects directly to `/onboarding` or `/dashboard` based on profile state

### Fixed
- New users were landing on `/dashboard` instead of `/onboarding` after first sign-in

---

## [0.4.0] — 2025-03-26

### Added
- Sign-out confirmation modal with backdrop blur
- Session handling: logged-in users redirected from `/` to `/dashboard` or `/onboarding`
- Custom app logo SVG used across all nav bars
- Landing page demo preview section with mock analysis output and blur CTA overlay
- OpenGraph image for social sharing
- PWA manifest

### Changed
- Landing page fully redesigned: dot grid background, blue glow hero, feature cards, how-it-works steps, bottom CTA
- History page redesigned: mini circular score rings, company/date metadata, Strong/Partial/Weak match badges

---

## [0.3.0] — 2025-03-26

### Added
- ATS keywords tab with color-coded chips (must have / important / nice to have) and click-to-copy
- Verb improvements tab showing weak verbs rewritten with power verbs
- Experience gap callout in the score card
- Tooltip on each ATS keyword chip explaining its importance
- `scrollbar-none` utility for horizontal tab scrolling

### Changed
- Analysis result view fully redesigned: circular SVG progress ring, 7-tab layout, action cards with impact borders
- Tab bar made horizontally scrollable to prevent wrapping to two rows
- Dashboard redesigned: 3-step card layout, gradient analyze button, independently scrollable panels
- Gemini prompt upgraded to structured 6-rule prompt for 90–95% result quality
- Gemini model updated to `gemini-2.5-flash`

### Fixed
- Tooltip clipping on left-side ATS keyword chips

---

## [0.2.0] — 2025-03-25

### Added
- Weak areas tab in analysis result
- Settings page to update Gemini API key
- Job title autocomplete input with 30 predefined titles
- Copy button for resume edit suggestions
- Analysis history page with score badges
- Individual analysis view page (`/analysis/[id]`)

### Fixed
- `testApiKey` still using old `gemini-1.5-flash` model name
- Misleading privacy copy claiming resume never leaves browser (it's sent to Gemini)

---

## [0.1.0] — 2025-03-25

### Added
- Initial release
- Google OAuth sign-in via Supabase
- Onboarding flow with Gemini API key setup and live verification
- Dashboard with PDF upload, job description paste, and gap analysis
- Analysis result with score, priority actions, missing skills, resume edits, and strengths tabs
- Server-side PDF text extraction via `unpdf`
- Analysis saved to Supabase after each run
