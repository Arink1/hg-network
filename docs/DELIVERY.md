# Getting purchases into the game

The website never connects to a game server. Instead it keeps a queue of commands, and a small poller on each game server host pulls from that queue and runs the commands over RCON. This keeps RCON passwords off the internet and works the same for all three games.

```
player pays  ->  Stripe webhook  ->  command_queue (Supabase)
                                            ^
game server  <-  RCON  <-  deliver.mjs  -----+  (polls every 10s)
```

## The API

Both endpoints need `Authorization: Bearer <DELIVERY_API_KEY>` (the value set on that site's Vercel project).

**GET `/api/deliveries?server=<key>&limit=50`**

Returns pending commands for one server, oldest first.

```json
{ "server": "survival", "commands": [ { "id": 12, "command": "lp user Notch parent add artisan", "purchase_id": "…", "created_at": "…" } ] }
```

**POST `/api/deliveries/ack`** with body `{ "ids": [12, 13] }`

Marks commands delivered so they are not sent again. Ack only after the command actually ran.

Server keys come from the site config: `survival` for HGCrafting, `main` for HGDarkRP and HGRusty.

## Running the poller

`scripts/deliver/deliver.mjs` has no dependencies and needs Node 22 or newer on the game server host.

```bash
# Minecraft (enable rcon in server.properties: enable-rcon=true, rcon.port=25575, rcon.password=...)
SITE_URL=https://hgcrafting.com DELIVERY_API_KEY=... SERVER_KEY=survival \
RCON_KIND=source RCON_HOST=127.0.0.1 RCON_PORT=25575 RCON_PASSWORD=... \
node deliver.mjs

# Garry's Mod (server.cfg: rcon_password "..."; RCON shares the game port)
SITE_URL=https://hgdarkrp.com DELIVERY_API_KEY=... SERVER_KEY=main \
RCON_KIND=source RCON_HOST=127.0.0.1 RCON_PORT=27015 RCON_PASSWORD=... \
node deliver.mjs

# Rust (launch flags: +rcon.port 28016 +rcon.password ... +rcon.web 1)
SITE_URL=https://hgrusty.com DELIVERY_API_KEY=... SERVER_KEY=main \
RCON_KIND=webrcon RCON_HOST=127.0.0.1 RCON_PORT=28016 RCON_PASSWORD=... \
node deliver.mjs
```

Keep it alive with whatever the host already uses: a systemd unit, pm2, or a scheduled task on Windows. If your panel (AMP, Pterodactyl) can run a sidecar, that works too. The poller is safe to restart at any time; commands it did not ack are sent again.

## Writing commands

Commands live in `store.packages[].commands` in `src/lib/sites/<site>.ts`. Placeholders:

| Placeholder | Minecraft | GMod and Rust |
| --- | --- | --- |
| `{player}` | exact username from Mojang | Steam display name, or the SteamID64 if `STEAM_API_KEY` is not set |
| `{playerId}` | dashed UUID | SteamID64 |
| `{package}` | package id | package id |
| `{purchaseId}` | row id in `purchases` | same |

Use `{playerId}` for anything permission related on Steam games. Use `{player}` on Minecraft where plugins expect usernames, and `{playerId}` where they accept UUIDs.

The shipped commands assume common plugins: LuckPerms and a crates plugin on Minecraft, ULX and Pointshop 2 on GMod, Oxide permissions on Rust. Change them to match what you actually run. A command that fails on the server still gets acked, so test every package once with Stripe's test card before launch.

## Offline players

Most permission plugins apply to offline players (LuckPerms, ULX with SteamID, Oxide groups). Item giveaways usually need the player online. For those, either use a plugin with an offline queue (most crate plugins have one) or point the package at a command your own plugin handles.

## Monthly packages

When a subscription renews, the same commands run again (useful for monthly credit drops; harmless for rank adds). When a subscription is cancelled or payment fails for good, `expireCommands` run. Keep them idempotent.
