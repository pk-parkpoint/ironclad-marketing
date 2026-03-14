# Homepage Rendering Strategy

This document explains the homepage performance architecture introduced in `codex1-conduit/homepage-performance-architecture`.

## Goal

Make the first visit feel instant on desktop and mobile by treating everything above the fold as critical and everything below the fold as progressively enhanced.

The homepage should:

- paint meaningful content immediately
- avoid the "frozen video" look on first visit
- minimize client-side work before the first interaction
- preserve SEO-visible content in server-rendered HTML

## Core Principles

### 1. First viewport must be server-rendered

The hero headline, subheadline, CTAs, and poster image are now rendered as plain server HTML.

Why:

- users should see the page before React finishes hydrating
- the hero should still work on slow devices, poor networks, and partial JS execution
- search engines and AI agents should get the main message directly from HTML

### 2. Hero video is enhancement, not dependency

The hero background video no longer controls the first paint.

The page now:

- preloads the poster image
- paints the poster immediately
- loads the video only after the browser has idle time
- fades the video in only after it is ready to play
- skips the video entirely for reduced-motion and `saveData` users

Why:

- first visit performance is dominated by the critical render path
- video decoding and network fetches are expensive on mobile
- the poster removes the blank/frozen state while keeping the visual design intact

### 3. Below-the-fold interactive modules should not compete with hero rendering

The homepage review carousel is interactive but not critical to the first screen.

The page now:

- renders a server fallback with stats, review cards, and CTA immediately
- upgrades to the interactive carousel client-side

Why:

- the user gets useful content without waiting for the carousel JS
- the interactive version is still available once the client is ready
- this preserves content visibility while reducing first-load pressure

### 4. Prefer native browser behavior over client JavaScript when possible

The homepage FAQ was rewritten from a client accordion to native `<details>` / `<summary>`.

Why:

- no hydration cost
- no React state for a simple disclosure pattern
- accessible behavior is already built into the platform

### 5. Let the browser skip work below the fold

Below-the-fold homepage sections use `content-visibility: auto`.

Why:

- the browser can avoid layout/paint work for content that is not yet near the viewport
- this is a clean platform-level optimization for long content pages

## Files Involved

- `app/page.tsx`
- `app/globals.css`
- `components/home/home-hero.tsx`
- `components/home/home-hero-video.tsx`
- `components/layout/faq-section.tsx`
- `components/service/deferred-reviews-section.tsx`
- `components/service/reviews-section-fallback.tsx`

## What Changed Structurally

### Hero

Before:

- client component
- video readiness controlled the visible hero state

After:

- server-rendered hero shell
- tiny client-only video enhancer
- immediate poster paint

### FAQ

Before:

- full client accordion
- React state and icon toggling logic

After:

- server-rendered native disclosure UI
- CSS-only visual state

### Reviews

Before:

- interactive client carousel in the page render path

After:

- server fallback first
- client carousel upgrade later

## Media Requirements Going Forward

For best real-world performance, the hero media should follow these rules:

- separate mobile and desktop encodes
- `3-5` second seamless loop
- no audio track
- `WebM` preferred, `MP4` fallback
- poster image must match the first visible frame
- keep fallback MP4 bitrate conservative

## Non-Goals

This pass does not try to solve every byte of shared JS on the site.

There is still shared client code coming from global navigation, analytics, and other cross-site features. Those are separate optimization targets and should be addressed in their own pass so they can be measured and reviewed independently.

## Next Recommended Performance Work

1. Split hero video into distinct mobile and desktop source files.
2. Audit shared JS from global layout and navigation.
3. Move any non-essential modal/analytics helpers further off the critical path.
4. Run Lighthouse and WebPageTest against cold-cache mobile traffic after deploy.
