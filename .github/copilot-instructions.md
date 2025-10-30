## Quick context for AI coding agents

This repository is a Next.js (App Router) TypeScript project that uses NextAuth (credentials provider) for auth, Mongoose for MongoDB data models, Tailwind for styling, and bcryptjs for password hashing.

Keep changes small and local-first: tests and dev server should run with `npm install` and `npm run dev` after setting required env vars.

## Big picture (what to read first)
- `app/` — Next.js App Router pages and components; look here for UI, layout and route-level data fetching.
- `app/api/` — Serverless API routes. Most routes call `lib/dbConnect.ts` and then use Mongoose models in `models/`.
- `lib/dbConnect.ts` — central DB connection; API routes rely on this. Uses `process.env.MONGODB_URI`.
- `models/*.model.ts` — Mongoose schemas for `User`, `Item`, `Order` (check `models/` folder). Models are exported using `models.Model || model(...)` pattern to avoid recompilation issues in dev.
- `types.ts` — shared TypeScript types / enums (e.g., `Role`, `IUser`) used by both server and client.

## Environment & secrets
- Required (set in `.env.local`):
  - `MONGODB_URI` — MongoDB connection string (local or Atlas). See `lib/dbConnect.ts` for usage.
  - `NEXTAUTH_SECRET` — secret for NextAuth JWT/session.
- README mentions `GEMINI_API_KEY` for AI Studio; not required for core app unless you see code that uses it.

## How to run locally (developer workflow)
1. Install dependencies:

   npm install

2. Create `.env.local` at repo root and set at minimum:

   MONGODB_URI=your-mongo-uri
   NEXTAUTH_SECRET=some-long-random-string

3. Run dev server:

   npm run dev

4. Production build & start:

   npm run build
   npm run start

5. Lint:

   npm run lint

Notes: Next dev uses hot reload; `lib/dbConnect.ts` caches Mongoose connection to avoid connection bloat in dev.

## Project-specific conventions to follow
- API routes always call `await dbConnect()` before using models. Follow the same pattern for new routes.
- Models are exported with `export default (models.Name as Model<T>) || model<T>('Name', Schema)` to avoid overwrite errors during hot reload — follow this to add/modify models.
- Auth uses NextAuth Credentials provider in `app/api/auth/[...nextauth]/route.ts`. The `authorize` callback expects `hashedPassword` on `User` model and compares with `bcrypt.compareSync`. Return the minimal user object (id, email, name, role).
- Session & JWT augmentation: tokens include `id` and `role`. When altering auth behavior, update the callbacks in the NextAuth options.
- Types in `types.ts` are the canonical shape for DB and API payloads — update them when changing models.

## Useful files to inspect when implementing features
- `app/api/items/route.ts` and `app/api/items/[id]/route.ts` — show REST-style handlers and response shapes.
- `models/user.model.ts` — demonstrates schema fields: `email`, `name`, `phone`, `role`, `hashedPassword`.
- `app/login/page.tsx` and `app/my-orders/page.tsx` — examples of client-side usage of auth/session and fetching protected endpoints.
- `components/ItemCard.tsx`, `components/Header.tsx` — UI component patterns and Tailwind usage.

## Integration points & external deps
- MongoDB (Mongoose): Set `MONGODB_URI` and ensure DB is reachable.
- NextAuth: uses Credentials provider; ensure `NEXTAUTH_SECRET` is set.
- Tailwind/PostCSS: styling is configured; run dev to build styles via Next.

## Small examples to copy when adding code
- New API route skeleton (server component):

  import dbConnect from '../../../lib/dbConnect';
  import Model from '../../../models/modelName';

  export async function POST(req: Request) {
    await dbConnect();
    // handle body, call Model
  }

- New Mongoose model pattern (follow `models/user.model.ts`):

  export default (models.Foo as Model<IFoo>) || model<IFoo>('Foo', FooSchema);

## Testing & debugging notes
- No test runner included by default. Use the dev server to exercise API routes.
- When debugging API routes locally, check server logs printed by Next. For DB issues, verify `MONGODB_URI` and look at `lib/dbConnect.ts` error messages.

## When to ask the repo owner
- Missing env variable names beyond `MONGODB_URI` or `NEXTAUTH_SECRET` used at runtime.
- If an external service (AI Studio/Gemini) is required for a feature — README mentions `GEMINI_API_KEY`; confirm whether it's needed.

If anything above is unclear or you want additional examples (sample `.env.local`, common DB seed script, or a small integration test), tell me which piece to add and I'll update this file.
