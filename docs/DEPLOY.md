# Deploying the three sites

## 1. Push the repo

```bash
git add -A
git commit -m "HG Network sites"
gh repo create hg-network --private --source . --push
```

## 2. Create three Vercel projects from the same repo

In Vercel, click **Add New Project**, import `hg-network`, and repeat three times. Name them `hgcrafting`, `hgdarkrp`, `hgrusty`. For each project:

1. Framework preset: Next.js (detected). Leave build settings alone.
2. Environment variables (Production, and Preview if you want preview deploys):

| Variable | hgcrafting | hgdarkrp | hgrusty |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE` | `crafting` | `darkrp` | `rusty` |
| `STRIPE_SECRET_KEY` | same for all three | | |
| `STRIPE_WEBHOOK_SECRET` | per site, see step 4 | | |
| `SUPABASE_URL` | same for all three | | |
| `SUPABASE_SERVICE_ROLE_KEY` | same for all three | | |
| `DELIVERY_API_KEY` | one random string per site (`openssl rand -hex 32`) | | |
| `STEAM_API_KEY` | not needed | optional | optional |

3. Deploy. Then under **Settings > Domains** add `hgcrafting.com` and `www.hgcrafting.com` (and the equivalents for the other two). Point each domain's DNS at Vercel as instructed there.

Until `STRIPE_SECRET_KEY` is set, the store shows packages with a "store opens at launch" label and no checkout. That is intentional so the sites can go live before payments are ready. Pages are built statically, so after adding or changing any environment variable, trigger a redeploy (Deployments > Redeploy) for it to take effect.

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
