# Evergreen & Ember

White glove seasonal décor installation & delivery service website. Customers can browse seasonal offerings, join waitlists for winter and summer service, and place (or join the waitlist for) fall 2026 installations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/seasonal-install run dev` — run the frontend (port auto-assigned)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, Framer Motion, shadcn/ui, Wouter (routing)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v3), drizzle-zod
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `artifacts/seasonal-install/` — React frontend
  - `src/pages/` — home, fall, winter, summer, portfolio
  - `src/components/navigation.tsx` — fixed navbar
  - `src/components/season-badge.tsx` — fall/winter/summer badge
  - `src/components/forms/waitlist-form.tsx` — winter/summer waitlist (uses `useJoinWaitlist`)
  - `src/components/forms/fall-order-form.tsx` — fall waitlist + orders (uses `useSubmitFallOrder`)
  - `public/images/` — AI-generated portfolio placeholder images
- `artifacts/api-server/src/routes/` — Express route handlers
  - `waitlist.ts` — POST /waitlist (winter/summer, distinguished by `season` field)
  - `orders.ts` — POST /orders (fall, distinguished by `serviceType` field)
  - `portfolio.ts` — GET /portfolio, GET /portfolio/featured
- `lib/db/src/schema/` — Drizzle schema
  - `waitlist.ts` — `waitlist` table (season: winter|summer)
  - `fallOrders.ts` — `fall_orders` table (serviceType: waitlist|order)
  - `portfolio.ts` — `portfolio` table
- `lib/api-spec/openapi.yaml` — OpenAPI source of truth

## Architecture decisions

- Winter and summer waitlists share a single `/api/waitlist` endpoint — the `season` field (`winter`|`summer`) is required and stored in the `waitlist` table, making submissions distinguishable on the backend.
- Fall has its own `/api/orders` endpoint with a `serviceType` field (`waitlist`|`order`) — pre-launch submissions use `waitlist`, actual reservations use `order`.
- Portfolio images are currently AI-generated placeholders in `public/images/`. Replace with real photos and update the seeded DB rows.
- Orval codegen uses Zod v3 compatible types — avoid `format: email` and `type: integer` in the OpenAPI spec (use plain `type: string` and `type: number` instead, or the typecheck step will fail).

## Product

- **Home** `/` — hero, what-we-do, season selector (fall active, winter/summer coming soon), featured portfolio preview, final CTA
- **Fall** `/fall` — service details, timeline, dual-form section (waitlist + order, orders open mid-August 2026)
- **Winter** `/winter` — coming soon, waitlist form
- **Summer** `/summer` — coming soon, waitlist form
- **Portfolio** `/portfolio` — filterable grid by season

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Orval generates Zod v4 syntax for `format: email` → `zod.email()` and `type: integer` → `zod.int()`, which fail typecheck against Zod v3. Always use `type: string` (no email format) and `type: number` in the OpenAPI spec.
- Curly/smart quotes in JSX string literals cause Babel parse errors. Always use straight ASCII apostrophes in JSX, or wrap in double quotes when the string contains an apostrophe.
- `public/images/` files are served at `/images/...` in the Vite app (base `/`). Do not import them as ES modules — use string paths.
