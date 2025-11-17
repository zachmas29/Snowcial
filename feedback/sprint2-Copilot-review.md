## Code review: project-burgundy-binturong (Snowcial)

Date: 2025-11-16

This review focuses on idiomatic React/Next.js usage, abstraction boundaries (signs of leaks), and potential technical debt. I read configs, pages, components, hooks, and lib modules to ground the feedback in concrete code.

## Highlights

- Modern stack: Next.js 15 (pages router) + React 19, TypeScript, MUI 7 with the official Next.js integration for the pages router. Biome provides formatting and linting. Vitest + RTL set up with jsdom. Strong foundation.
- Clear separation of concerns between UI (components) and data access (src/lib/*). Types come from generated Supabase types to keep data shape sound.
- Consistent UI system (MUI) and CSS modules for page shell. Nice, accessible components with MUI primitives and sx styling.
- Auth handled via a custom hook and a context provider in _app, with simple gating and a global NavBar for authenticated users.

## Idiomatic Next.js/React usage

What’s good

- Correct MUI pages-router integration via `AppCacheProvider` in `_app.tsx` and `documentGetInitialProps` in `_document.tsx`. This avoids style flicker and generates proper critical CSS.
- Per-page `<Head>` tags are used, titles are contextual; good for UX.
- `next/image` is used in the gallery with `fill` and responsive `sizes`.
- Hooks: state/effects are scoped properly, and `useCallback` protects auth actions. Context is used to avoid prop-drilling auth state.

Opportunities

- Data fetching is entirely client-side. For public, cacheable data (e.g., event feed or read-only profile pages), consider server data fetching via `getServerSideProps`/`getStaticProps` (pages router) or moving toward the app router with RSC. Benefits: better perceived performance, SEO (if ever public), and reduced client bundles.
- The login gate relies on client-side redirects in `_app.tsx` and `pages/index.tsx`. Consider moving auth checks to middleware or explicit page-level guards to avoid double logic and flicker. Middleware can centralize the rule “everything except `/` requires auth.”
- In `SmallEventCard.tsx`, `Link` is imported from MUI (`@mui/material/Link`), not Next (`next/link`). This is non-idiomatic in Next and likely triggers a full page refresh. Prefer `next/link` or `MUI Link` with `component={NextLink}`.

## Abstractions and possible leaks

- Data layer is a thin wrapper around Supabase queries in `src/lib/db_functions.ts`. That’s fine for an MVP, but there are several N+1 patterns and client-side multi-round trips that leak DB shape and affect performance:
	- `EventFeed` calls `fetchEvents()` and then, for each event, calls `fetchUser`, `getAttendeeCount`, and `fetchEventTags`. That’s 3 additional network calls per event. Consider a single supabase query with joins/selects (or an RPC) to return the enriched event feed in one round trip.
	- `fetchUserProfile` makes multiple calls (user, tags, gallery) then aggregates. Could be a single call using joins for better latency and a simpler API surface.

- Security boundary: inserts/updates from the browser
	- `insertEventWithTags(eventFormData, user_id)` accepts `user_id` from the client and sets `creator_id` using that value. If your RLS policies don’t enforce `creator_id = auth.uid()` at the database level, a malicious client could forge creator IDs. Prefer having the DB set `creator_id` to `auth.uid()` by default (via column defaults/trigger) and omit the `user_id` param at the API boundary.

- Auth boundary duplicates
	- `_app.tsx` and `pages/index.tsx` both redirect based on auth. This can produce redundant pushes and makes the rule spread across files. It’s better modeled as a single boundary (middleware or a small `withAuth` HOC) to avoid drift.

## Technical debt (prioritized)

1) Event feed N+1 network pattern (performance, scalability)
	 - File(s): `src/components/EventFeed.tsx`, `src/lib/db_functions.ts`
	 - Impact: Latency grows with number of events; mobile performance suffers; more error surface area.
	 - Direction: Create an API util that returns enriched events in one call via Supabase `select` with foreign tables or an SQL function/RPC.

2) Route protection duplication and flicker (UX, maintainability)
	 - File(s): `_app.tsx`, `pages/index.tsx`
	 - Impact: Double logic increases risk of bugs and redirect loops. Users see loading states and occasional flicker.
	 - Direction: Centralize auth gating (middleware or page-level guard/HOC); in `_app.tsx`, avoid listening to `router.events` for auth redirects unless truly needed.

3) Potential creator_id spoofing risk (security, correctness)
	 - File(s): `src/lib/db_functions.ts` (`insertEventWithTags`)
	 - Impact: If RLS is not strict, clients could inject events for other users.
	 - Direction: Enforce in DB: set `creator_id` = `auth.uid()`; don’t accept a `user_id` parameter from clients; use `supabase.auth.getUser()` server-side or rely on DB policies.

4) Inconsistent navigation links (correctness, idioms)
	 - File(s): `src/components/SmallEventCard.tsx`
	 - Impact: MUI Link may cause full page reload; misses Next prefetch/router integration.
	 - Direction: Use `next/link` or `MUI Link` with `component={NextLink}`.

5) Dynamic route readiness and param validation (bug risk)
	 - File(s): `src/pages/events/[id].tsx`
	 - Impact: `event_id` is computed from `router.query.id` immediately; on first render this is often `undefined`, becoming `NaN`; requests may run with invalid IDs.
	 - Direction: Gate on `router.isReady` and validate `Number.isFinite(event_id)` before fetching.

6) Date display consistency (polish)
	 - File(s): `SmallEventCard.tsx`, `Event.tsx`
	 - Impact: Mixed formatting (`${event.event_time}` vs `toLocaleString()`); inconsistent UX.
	 - Direction: Centralize date formatting (e.g., `date-fns/format` with a single helper) and apply consistently.

7) Index page dark-mode TODO (cleanup)
	 - File(s): `pages/index.tsx`
	 - Impact: `prefersDarkMode` is hard-coded to false.
	 - Direction: Restore `useMediaQuery('(prefers-color-scheme: dark)')` or lift to theme.

8) Image remotePatterns wildcard (possible misconfig)
	 - File(s): `next.config.ts`
	 - Impact: `hostname: "*.supabase.co"` likely isn’t honored by Next Image; may break image optimization in production.
	 - Direction: Specify the actual Supabase storage hostname (e.g., `xyz.supabase.co`) or use a small allowlist. Alternatively use `remotePatterns` with concrete host names.

## Specific code observations

- `_app.tsx`
	- Auth redirect logic subscribes to `router.events` and also checks on mount; consider simplifying with a single check on mount and/or middleware. Returning `null` while redirecting is fine but causes a blank frame; a skeleton could soften the flicker.
	- Rendering `<NavBar />` only when `user` exists is a clear pattern; good separation.

- `pages/events/[id].tsx`
	- Add `if (!router.isReady) return;` and validate `event_id` before fetching. If `NaN`, show the error state immediately.
	- A small `useMemo` for `typedData` is optional; current code is readable as-is.

- `components/SmallEventCard.tsx`
	- Use Next.js navigation for the avatar link. Example: `import NextLink from 'next/link'` and `<Link component={NextLink} href={...} />` or just use `<NextLink>`.
	- Prefer a consistent date formatter. If `event.event_time` is a string, parse to `new Date(event.event_time)` and format once.

- `components/EventFeed.tsx`
	- Great use of `Promise.all` to parallelize extra data fetches, but the upstream N+1 remains. Collapsing these into a single query would be a big win.

- `lib/db_functions.ts`
	- Generally clean functions with types and comments. Where possible, favor joined selects to avoid post-processing arrays (e.g., tags) across multiple calls. Consider grouping related reads by screen in an API-like function that returns the exact UI model.

- `hooks/useAuth.ts`
	- Solid: uses `onAuthStateChange`, handles “Auth session missing” gracefully, and resets loading state. Consider exposing a derived `isAuthenticated` boolean to simplify consuming code.

- `components/User*`
	- Good accessibility defaults and responsive handling. The gallery uses `next/image` correctly with `sizes`; ensure your `next.config.ts` remote patterns match the actual Supabase URLs.

## Testing and typing

- Vitest + RTL is configured; env vars are mocked in `vitest.setup.js`. Good foundation for component tests.
- Types lean on Supabase generated types (`Tables<...>`), which is excellent. Keep leaning into this and avoid `any` escape hatches.
- Consider adding a light unit test for auth gating (e.g., NavBar visibility based on context) and a test for `PeopleFeed` filtering/sorting edge cases (empty search, case-insensitive search, unknown sort).

## Suggested quick wins (low risk)

- Fix `SmallEventCard` link to use Next navigation.
- Guard `pages/events/[id].tsx` with `router.isReady` and a finite-number check.
- Introduce a tiny `formatDate` helper and apply it to event dates everywhere.
- Replace alert()s in `pages/events/new.tsx` with inline MUI `Alert`/helper text for better UX and testability.
- Restore the dark-mode media query on the login page or remove the unused code path.

## Near-term improvements (higher impact)

- Collapse event feed data into a single Supabase call (select with joins or RPC), returning `{ event, user, tags, attendeeCount }` in one response. This will drastically reduce latency and simplify error handling.
- Centralize route protection (middleware/HOC). Remove the `router.events` subscription in `_app.tsx` unless truly needed.
- Enforce `creator_id = auth.uid()` in the DB and remove the `user_id` parameter from `insertEventWithTags`.
- Audit `next.config.ts` to include the exact Supabase host(s) used by `next/image`.

## Summary

You’ve got a coherent, typed, and testable codebase with modern tooling and clear UI/data separation. The biggest wins now are performance (eliminate N+1 client fetches), simplifying auth gating, tightening the security boundary for writes, and a few idiomatic Next.js cleanups. None of these require major rewrites; they’re well-scoped refactors that will improve reliability and user experience as the app grows.

