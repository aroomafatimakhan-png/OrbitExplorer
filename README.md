# Planetary System

An interactive 3D solar system for learning astronomy and orbital mechanics —
Next.js 14, React Three Fiber, Tailwind, Prisma/Postgres.

Real orbital periods, rotation rates, and axial tilts drive the animation;
distances and sizes are scaled independently (not 1:1) so the whole system
stays legible on one screen — the true scale would put Neptune two-and-a-half
thousand times further from the Sun than Mercury is wide.

## What's built right now

- Hyperspace loading sequence (canvas star-streak field, no video asset needed)
- Full 3D solar system: Sun + 8 planets, real relative orbital speeds and
  rotation, axial tilt, Saturn/Uranus rings, orbit trails, click-to-select
- Mission-control HUD: corner brackets, live UTC clock, time-scale slider
- Sliding info panel per body with real astronomical data
- Prisma schema for Postgres: users, ranks/XP, courses, lessons, quizzes,
  progress, achievements, bookmarks, notes
- `/api/courses` route reading from the database
- Seed script with starter achievements + one full course/lesson as a template

## What's scaffolded but needs content, not architecture

The schema and routes are built to hold all of this — what's missing is the
content itself, which is a writing/curation task more than an engineering one:

- The other 29 course topics (models, quizzes, certificates)
- Auth (JWT scaffolding is in `.env.example`; wire up NextAuth or a custom
  flow — Google/GitHub OAuth apps need to be registered first)
- AI tutor (a route calling the Anthropic or OpenAI API with a system prompt
  scoped to astronomy — straightforward to add, intentionally left out so you
  choose which model/key to use)
- Live data widgets (APOD, ISS position, NEOs — all free NASA APIs, one fetch
  each)
- Admin panel (CRUD UI over the existing Course/Lesson tables)
- 8K PBR planet textures, volumetric clouds, atmospheric scattering — these
  are real asset + shader work; current planets use physically-reasonable
  color and roughness rather than photographic textures

None of this is placeholder code sitting in the repo — it's simply not
started yet, listed here so you know exactly what's real.

## Local development

```bash
npm install
cp .env.example .env       # fill in DATABASE_URL after step 2 below
npx prisma db push          # creates tables from schema.prisma
npm run db:seed             # seeds achievements + one sample course
npm run dev
```

Open http://localhost:3000.

## Deploying to Vercel with a database

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project** → import the repo.
3. **Storage** tab → **Create Database** → Postgres (Neon-backed). Vercel
   automatically injects `DATABASE_URL` and a pooled `DIRECT_URL` into your
   project's environment variables — you don't need to copy connection
   strings by hand.
4. Add `JWT_SECRET` (any long random string) under **Settings → Environment
   Variables**. Add `NASA_API_KEY` if you wire up live-data widgets (get a
   free one at https://api.nasa.gov — `DEMO_KEY` works but is rate-limited).
5. Deploy. The `postinstall`/`build` scripts already run `prisma generate`
   for you.
6. After the first deploy, run the schema push once against the production
   database:
   ```bash
   vercel env pull .env.production.local
   DATABASE_URL="$(grep DATABASE_URL .env.production.local | cut -d= -f2-)" npx prisma db push
   npm run db:seed
   ```

## For hackathon judging

Three things score well with judges in the first 30 seconds, in this order:
1. **It loads and runs on the live URL** — deploy early, deploy often; a
   working link beats a longer feature list every time.
2. **One unmistakable signature moment** — here, that's clicking a planet and
   watching the HUD panel slide in with real data while the body highlights
   in the scene. Lead your demo with that, not with a feature tour.
3. **A clear "what's next" story** — the roadmap above is your pitch for why
   the architecture supports the bigger vision, without claiming it's already
   done.

## Tech stack

Next.js 14 (App Router) · TypeScript · React Three Fiber + Drei · Three.js ·
Tailwind CSS · Framer Motion · Zustand · Prisma · PostgreSQL
