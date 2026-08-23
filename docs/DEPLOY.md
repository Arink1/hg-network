# Deploying the three sites

## 1. The repo

Private GitHub repo: https://github.com/Arink1/hg-network (branch `main`).

## 2. The three Vercel projects

Done on 2026-08-22 with the Vercel CLI. Team `AK's projects` (`aks-projects-ce32c1de`):

| Project | `NEXT_PUBLIC_SITE` | Vercel URL | Domains attached |
| --- | --- | --- | --- |
| `hgcrafting` | `crafting` | https://hgcrafting.vercel.app | hgcrafting.com, www.hgcrafting.com |
| `hgdarkrp` | `darkrp` | https://hgdarkrp.vercel.app | hgdarkrp.com, www.hgdarkrp.com |
| `hgrusty` | `rusty` | https://hgrusty.vercel.app | hgrusty.com, www.hgrusty.com |

The repo is not yet connected to Vercel for automatic deploys, because the Vercel account has no GitHub login connection. Two ways to ship a change:

- **Manual (works now)**: from the repo root, link to a project and deploy it. Repeat for each site.
  ```bash
  rm -rf .vercel && vercel link --yes --project hgcrafting --scope aks-projects-ce32c1de && vercel deploy --prod --yes --scope aks-projects-ce32c1de
  ```
- **Automatic (recommended)**: in Vercel, Account Settings > Authentication > add GitHub as a login connection, then in each project Settings > Git > connect `Arink1/hg-network`. After that every push to `main` deploys all three.

Remaining environment variables (add per project, then redeploy):

| Variable | hgcrafting | hgdarkrp | hgrusty |
| --- | --- | --- | --- |
| `STRIPE_SECRET_KEY` | same for all three | | |
| `STRIPE_WEBHOOK_SECRET` | per site, see step 4 | | |
| `SUPABASE_URL` | same for all three | | |
| `SUPABASE_SERVICE_ROLE_KEY` | same for all three | | |
| `DELIVERY_API_KEY` | one random string per site (`openssl rand -hex 32`) | | |
| `STEAM_API_KEY` | not needed | optional | optional |

Add one with the CLI (value from stdin): `printf 'value' | vercel env add NAME production --scope aks-projects-ce32c1de` while linked to the project.

### DNS (Namecheap)

The domains use Namecheap's nameservers. In Namecheap > Domain List > Manage > Advanced DNS, add for each domain:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `76.76.21.21` | Automatic |
| CNAME | `www` | `cname.vercel-dns.com` | Automatic |

Delete any existing parking `A`/`CNAME`/URL redirect records for `@` and `www` first. Vercel verifies automatically and issues SSL within minutes of the records propagating.

Until `STRIPE_SECRET_KEY` is set, the store shows packages with a "store opens at launch" label and no checkout. That is intentional so the sites can go live before payments are ready. Pages are built statically, so after adding or changing any environment variable, trigger a redeploy for it to take effect.

## 3. Supabase

One project for the whole network.

1. Create a project at supabase.com.
2. Open the SQL editor, paste `supabase/schema.sql`, run it.
3. Copy **Project URL** and the **service_role** key from Project Settings > API into the Vercel env vars above. Never put the service role key in a `NEXT_PUBLIC_` variable.

## 4. Stripe

One Stripe account for the whole network. Purchases from all three sites land in the same balance; the `site` metadata on each payment tells them apart.

1. Turn on the account and complete business verification. Stripe will ask for the terms, privacy and refund pages; they are at `/legal/terms`, `/legal/privacy` and `/legal/refunds` on every site.
2. Developers > API keys: copy the **Secret key** into `STRIPE_SECRET_KEY` on all three projects. Use the test key first.
3. Developers > Webhooks > Add endpoint, three times:
   - `https://hgcrafting.com/api/stripe/webhook`
   - `https://hgdarkrp.com/api/stripe/webhook`
   - `https://hgrusty.com/api/stripe/webhook`

   Events to send: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`.
   Each endpoint gets its own signing secret. Put it in that site's `STRIPE_WEBHOOK_SECRET` and redeploy.
4. Settings > Billing > Customer portal: enable it so players can cancel monthly packages from their receipt email.

Test it: with the test key set, buy a package using card `4242 4242 4242 4242`. You should see a row in `purchases` and rows in `command_queue` in Supabase within a few seconds.

## 5. Delivery to the game servers

See [DELIVERY.md](DELIVERY.md). Nothing reaches the game until the poller is running next to each server.

## Day to day

- Push to `main` deploys all three sites.
- News posts are markdown files, so editing one in GitHub and committing is a valid publishing flow.
- The home page revalidates every 60 seconds for live player counts. Everything else is static.
