# HG Network sites

One Next.js codebase that ships as three websites:

| Site | Game | Env |
| --- | --- | --- |
| [hgcrafting.com](https://hgcrafting.com) | Minecraft | `NEXT_PUBLIC_SITE=crafting` |
| [hgdarkrp.com](https://hgdarkrp.com) | Garry's Mod DarkRP | `NEXT_PUBLIC_SITE=darkrp` |
| [hgrusty.com](https://hgrusty.com) | Rust | `NEXT_PUBLIC_SITE=rusty` |

Each site is a separate Vercel project pointed at this repo with a different `NEXT_PUBLIC_SITE`. Layout, typography, motion and components are shared; the three accent colors, hero texture, server addresses, store packages, rules and news are per site.

The shared look is bright and playful: white cards with a 2px ink outline and a hard offset shadow in the site's accent ("stickers"), Bricolage Grotesque headlines, floating color blobs behind the hero, scroll-in reveals and a scrolling network strip. Every site links to the other two from the header switcher, the "Three servers, one crew" section, the marquee, the footer and the 404 page.

## What is in the box

- **Home**: hero with a live connect console (player count from mcstatus.io or BattleMetrics), server facts, features, latest news, featured store packages.
- **Store**: packages grouped by category, Stripe Checkout for one-time and monthly purchases, in-game delivery through a command queue. No pay to win is a design rule, not a setting.
- **News**: markdown posts per site in `content/<site>/news`.
- **Rules** and **Staff** pages, plus **terms, privacy and refund** policies Stripe expects to see.
- JSON status endpoint at `/api/status` for Discord bots.
- Sitemap, robots, Open Graph image and favicon generated per site.

## Run locally

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE to crafting, darkrp or rusty
npm run dev
```

Open http://localhost:3000. Change `NEXT_PUBLIC_SITE` in `.env.local` and restart to preview another site.

Build check for all three sites:

```bash
NEXT_PUBLIC_SITE=crafting npm run build && NEXT_PUBLIC_SITE=darkrp npm run build && NEXT_PUBLIC_SITE=rusty npm run build
```

## Where things live

```
src/lib/sites/<site>.ts   everything that differs per site: theme, servers, store packages, copy
src/lib/sites/network.ts  the network strip links shown on every site
content/<site>/news/*.md  news posts (frontmatter: title, date, excerpt, tag, author)
content/<site>/rules.md   rules page
content/shared/legal/     terms, privacy, refunds shared by all sites ({{site}} placeholders)
src/app/api/checkout      creates the Stripe Checkout session
src/app/api/stripe/webhook records purchases and queues in-game commands
src/app/api/deliveries    game servers pull pending commands here and ack them
scripts/deliver/          poller that runs on the game server host and executes commands over RCON
supabase/schema.sql       the two tables the store needs
```

## Common edits

**Change the server address or status source**: `servers` in `src/lib/sites/<site>.ts`. For Rust and GMod, set the BattleMetrics server id (the number in the BattleMetrics URL for your server). Minecraft uses the host and port directly.

**Add or price a package**: `store.packages` in the site config. `commands` run on the game server after payment; `expireCommands` run when a monthly package lapses. Placeholders: `{player}` (username for Minecraft, Steam display name for the others), `{playerId}` (Mojang UUID or SteamID64), `{package}`, `{purchaseId}`.

**Post news**: add a markdown file to `content/<site>/news/`. The filename is the URL slug. Push to deploy.

**Change colors**: `theme` in the site config: `accent` (buttons, shadows, logo chip), `accent2` (eyebrows, links, featured shadows), `accent3` (highlighter marks, tags), `accentInk` (text on top of `accent`), `bg` (page tint). Keep the same values in `src/lib/sites/network.ts` so the other sites draw this one correctly. `material` picks the hero texture: `pixel`, `neon` or `grain`.

**Highlight a word in the hero**: wrap it in square brackets in `hero.headline`, e.g. `"Wipe day is [Thursday.] Be ready."`.

**Use Tebex instead of Stripe**: set `store.provider` to `"tebex"` and `store.tebexUrl`. Packages then link out.

## Deploying and wiring payments

See [docs/DEPLOY.md](docs/DEPLOY.md) for Vercel, Stripe and Supabase setup and [docs/DELIVERY.md](docs/DELIVERY.md) for getting purchases into the game servers.
