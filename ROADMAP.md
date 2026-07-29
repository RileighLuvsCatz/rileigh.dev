# Roadmap

> Last updated: 2026-07-29

---

## Phase 0: Foundation ✅

- [x] Define project scope and stack
- [x] Choose dark minimal theme direction
- [x] Initialize Next.js 16.2.6 project
- [x] Configure Tailwind v4 with custom dark palette
- [x] Set up Prisma schema (`Tracker` + `Event` models)
- [x] Deploy initial scaffold to Vercel

**Done:** Project scaffolded, styled, and live on Vercel.

---

## Phase 1: Core Pages (static data)

> All pages built with mock/static data. DB comes in Phase 2.

### 1.1 Landing Page (`/`)
- [ ] Implement dark minimal layout from theme preview
- [ ] Add navigation bar (work / writing / trackers)
- [ ] Write "About Me" copy
- [ ] Add resume / contact CTA

### 1.2 Progress Page (`/progress`)
- [ ] Build tracker cards (title, value, unit, progress bar)
- [ ] Build calendar heatmap component (GitHub-style contribution graph)
- [ ] Build stats / summary view (totals, streaks, trends)
- [ ] Seed mock data for GitHub, LeetCode, and job trackers

### 1.3 Portfolio Page (`/projects`)
- [ ] Build project card component (title, description, tags, links)
- [ ] Seed 2–3 projects from static data
- [ ] Add filtering by tag
- [ ] *(Future)* Branch this template for fashion projects

### 1.4 Blog Page (`/blog`)
- [ ] Set up MDX rendering (`next-mdx-remote` or `@next/mdx`)
- [ ] Create `/content/blog/` directory for markdown files
- [ ] Build blog index page (list of posts)
- [ ] Build dynamic post page (`/blog/[slug]`)
- [ ] Add frontmatter support (title, date, tags)

---

## Phase 2: Database & Polish

- [ ] Provision self-hosted PostgreSQL (Docker on Pi 4B, Tailscale tunnel)
- [ ] Run initial migration + generate Prisma client
- [ ] Create `Project` model in Prisma
- [ ] Wire up all pages to real DB queries
- [ ] Add `Tracker` CRUD (create / edit tracker types)
- [ ] Add loading states / skeletons
- [ ] Add error boundaries
- [ ] Responsive design pass (mobile, tablet)
- [ ] SEO metadata (OpenGraph, `robots.txt`, sitemap)
- [ ] Dark mode toggle *(optional — default dark is fine)*
- [ ] Add subtle animations / hover effects
- [ ] Custom 404 page

---

## Phase 3: Bot Integration (Phase 2 of original plan)

- [ ] Design Discord bot architecture (commands, permissions)
- [ ] Set up bot project repo / hosting
- [ ] Bot commands:
  - `/tracker add <slug> <amount>` — Log an event
  - `/blog upload <title>` — Accept markdown, commit to repo or write to DB
- [ ] Secure API routes for bot-to-DB communication
- [ ] Deploy bot (Railway, Fly.io, or Vercel Edge Functions)

---

## Phase 4: Expansion

- [ ] Fashion portfolio spin-off (reuse `/projects` template)
- [ ] Subdomain projects (`project.yourdomain.com`)
- [ ] Analytics (Vercel Analytics or Plausible)
- [ ] RSS feed for blog
- [ ] Newsletter / email capture

---

## Backlog / Ideas

- [ ] LeetCode API integration (unofficial, may need scraping)
- [ ] Guestbook / comments (Supabase or Turso)
- [ ] Terminal-style easter egg page
- [ ] Automated weekly progress summary (cron job + email)

---

## Current Focus

**Phase 0 → Phase 1.2**

1. Provision self-hosted Postgres (Docker on Pi 4B + Tailscale)
2. Run initial migration + generate Prisma client
3. Build `/progress` with calendar heatmap + GitHub API seed + manual forms
