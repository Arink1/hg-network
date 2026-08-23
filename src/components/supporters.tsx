import { recentSupporters } from "@/lib/fulfillment";
import { supabaseConfigured } from "@/lib/supabase";

/** Recent supporters. Renders nothing until the database is connected and someone has bought something. */
export async function Supporters() {
  if (!supabaseConfigured()) return null;
  const rows = await recentSupporters(8);
  if (rows.length === 0) return null;
  return (
    <div className="sticker sticker-3 p-5" data-reveal>
      <p className="eyebrow mb-4">Recent supporters</p>
      <ul className="divide-y divide-line font-mono text-sm">
        {rows.map((r, i) => (
          <li key={`${r.created_at}-${i}`} className="flex items-center justify-between gap-3 py-2">
            <span className="truncate font-bold text-ink">{r.player}</span>
            <span className="flex-none text-muted">{r.package_name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
