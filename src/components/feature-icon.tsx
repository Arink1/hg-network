import { Clock, Coins, Hammer, Map, Pickaxe, Radio, Shield, Swords, Users, Zap } from "lucide-react";
import type { FeatureIcon as IconName } from "@/lib/site";

const ICONS = { pickaxe: Pickaxe, shield: Shield, users: Users, zap: Zap, map: Map, swords: Swords, coins: Coins, radio: Radio, clock: Clock, hammer: Hammer };

export function FeatureIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} strokeWidth={1.75} aria-hidden />;
}
