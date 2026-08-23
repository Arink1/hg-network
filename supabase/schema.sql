-- HG Network store schema. Run once in the Supabase SQL editor.
-- All three sites share these tables; rows are scoped by the `site` column.

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  site text not null check (site in ('crafting', 'darkrp', 'rusty')),
  package_id text not null,
  package_name text not null,
  player text not null,
  player_id text not null,
  email text,
  amount integer not null,
  currency text not null default 'usd',
  stripe_session_id text unique,
  stripe_subscription_id text,
  status text not null default 'paid' check (status in ('paid', 'refunded', 'expired')),
  created_at timestamptz not null default now()
);

create index if not exists purchases_site_created on purchases (site, created_at desc);
create index if not exists purchases_subscription on purchases (stripe_subscription_id);

create table if not exists command_queue (
  id bigserial primary key,
  site text not null check (site in ('crafting', 'darkrp', 'rusty')),
  server_key text not null,
  purchase_id uuid references purchases (id) on delete set null,
  command text not null,
  status text not null default 'pending' check (status in ('pending', 'delivered')),
  created_at timestamptz not null default now(),
  delivered_at timestamptz
);

create index if not exists command_queue_pending on command_queue (site, server_key, status, id);

-- The site only ever talks to these tables with the service role key.
-- Lock them down so the anon key cannot read purchases.
alter table purchases enable row level security;
alter table command_queue enable row level security;
