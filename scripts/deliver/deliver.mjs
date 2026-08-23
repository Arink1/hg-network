#!/usr/bin/env node
/**
 * HG Network delivery poller.
 *
 * Runs next to a game server. Every few seconds it asks the website for pending
 * purchase commands, runs them over RCON, and acknowledges the ones that ran.
 * No dependencies: Node 22 or newer.
 *
 * Environment:
 *   SITE_URL           https://hgcrafting.com
 *   DELIVERY_API_KEY   same value as the DELIVERY_API_KEY env on the site
 *   SERVER_KEY         server key from the site config (crafting: survival, darkrp: main, rusty: main)
 *   RCON_KIND          source | webrcon      (Minecraft and GMod use source, Rust uses webrcon)
 *   RCON_HOST          127.0.0.1
 *   RCON_PORT          25575 (Minecraft) 27015 (GMod) 28016 (Rust)
 *   RCON_PASSWORD      the server's rcon password
 *   POLL_SECONDS       optional, default 10
 *
 * Run:  node deliver.mjs
 */

import net from "node:net";

const env = (name, fallback) => {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === "") {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return v;
};

const SITE_URL = env("SITE_URL").replace(/\/$/, "");
const API_KEY = env("DELIVERY_API_KEY");
const SERVER_KEY = env("SERVER_KEY");
const RCON_KIND = env("RCON_KIND", "source");
const RCON_HOST = env("RCON_HOST", "127.0.0.1");
const RCON_PORT = Number(env("RCON_PORT"));
const RCON_PASSWORD = env("RCON_PASSWORD");
const POLL_MS = Number(env("POLL_SECONDS", "10")) * 1000;

const headers = { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" };
const log = (...a) => console.log(new Date().toISOString(), ...a);

// ---------- Source RCON (Minecraft, Garry's Mod) ----------

function sourcePacket(id, type, body) {
  const bodyBuf = Buffer.from(body, "utf8");
  const buf = Buffer.alloc(14 + bodyBuf.length);
  buf.writeInt32LE(10 + bodyBuf.length, 0);
  buf.writeInt32LE(id, 4);
  buf.writeInt32LE(type, 8);
  bodyBuf.copy(buf, 12);
  buf.writeInt16LE(0, 12 + bodyBuf.length);
  return buf;
}

function sourceRcon(commands) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: RCON_HOST, port: RCON_PORT });
    const results = [];
    let buffer = Buffer.alloc(0);
    let stage = "auth";
    let index = 0;
    const timeout = setTimeout(() => fail(new Error("rcon timeout")), 15000);

    const fail = (err) => {
      clearTimeout(timeout);
      socket.destroy();
      reject(err);
    };
    const sendNext = () => {
      if (index >= commands.length) {
        clearTimeout(timeout);
        socket.end();
        resolve(results);
        return;
      }
      socket.write(sourcePacket(100 + index, 2, commands[index]));
    };

    socket.on("connect", () => socket.write(sourcePacket(1, 3, RCON_PASSWORD)));
    socket.on("error", fail);
    socket.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 4) {
        const size = buffer.readInt32LE(0);
        if (buffer.length < size + 4) break;
        const id = buffer.readInt32LE(4);
        const type = buffer.readInt32LE(8);
        const body = buffer.subarray(12, size + 2).toString("utf8");
        buffer = buffer.subarray(size + 4);

        if (stage === "auth") {
          if (type !== 2) continue; // empty SERVERDATA_RESPONSE_VALUE some servers send first
          if (id === -1) return fail(new Error("rcon auth failed, check RCON_PASSWORD"));
          stage = "exec";
          sendNext();
        } else if (type === 0 && id === 100 + index) {
          results.push(body.trim());
          index += 1;
          sendNext();
        }
      }
    });
  });
}

// ---------- WebRCON (Rust) ----------

function webRcon(commands) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://${RCON_HOST}:${RCON_PORT}/${RCON_PASSWORD}`);
    const results = [];
    let index = 0;
    const timeout = setTimeout(() => fail(new Error("webrcon timeout")), 15000);
    const fail = (err) => {
      clearTimeout(timeout);
      try { ws.close(); } catch {}
      reject(err);
    };
    const sendNext = () => {
      if (index >= commands.length) {
        clearTimeout(timeout);
        ws.close();
        resolve(results);
        return;
      }
      ws.send(JSON.stringify({ Identifier: 100 + index, Message: commands[index], Name: "HGDelivery" }));
    };
    ws.addEventListener("open", sendNext);
    ws.addEventListener("error", () => fail(new Error("webrcon connection failed, check host, port and password")));
    ws.addEventListener("message", (ev) => {
      let msg;
      try { msg = JSON.parse(String(ev.data)); } catch { return; }
      if (msg.Identifier !== 100 + index) return;
      results.push(String(msg.Message ?? "").trim());
      index += 1;
      sendNext();
    });
  });
}

const runCommands = RCON_KIND === "webrcon" ? webRcon : sourceRcon;

// ---------- Poll loop ----------

async function tick() {
  const res = await fetch(`${SITE_URL}/api/deliveries?server=${encodeURIComponent(SERVER_KEY)}&limit=25`, { headers });
  if (!res.ok) throw new Error(`site responded ${res.status}: ${await res.text()}`);
  const { commands } = await res.json();
  if (!commands?.length) return;

  log(`running ${commands.length} command(s)`);
  const outputs = await runCommands(commands.map((c) => c.command));
  commands.forEach((c, i) => log(`  #${c.id} ${c.command} -> ${outputs[i] || "(no output)"}`));

  const ack = await fetch(`${SITE_URL}/api/deliveries/ack`, {
    method: "POST",
    headers,
    body: JSON.stringify({ ids: commands.map((c) => c.id) }),
  });
  if (!ack.ok) throw new Error(`ack failed ${ack.status}: ${await ack.text()}`);
  log(`acknowledged ${commands.length}`);
}

log(`delivery poller for ${SERVER_KEY} via ${RCON_KIND} rcon at ${RCON_HOST}:${RCON_PORT}, polling ${SITE_URL} every ${POLL_MS / 1000}s`);
for (;;) {
  try {
    await tick();
  } catch (err) {
    log("error:", err.message);
  }
  await new Promise((r) => setTimeout(r, POLL_MS));
}
