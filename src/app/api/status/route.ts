import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { fetchAllStatus } from "@/lib/status";

/** Public JSON status for bots and widgets. Upstream lookups are cached for 60 seconds. */
export async function GET() {
  const servers = await fetchAllStatus(site.servers);
  return NextResponse.json(
    {
      site: site.key,
      servers: servers.map(({ server, status }) => ({
        key: server.key,
        name: server.name,
        address: server.address,
        ...status,
      })),
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
  );
}
