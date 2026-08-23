import { ImageResponse } from "next/og";
import { NETWORK_NAME, site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#14121f";

export default function OgImage() {
  const t = site.theme;
  const headline = site.hero.headline.replace(/[[\]]/g, "");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: t.bg,
          color: INK,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -160,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: t.accent,
            opacity: 0.45,
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -100,
            bottom: -200,
            width: 460,
            height: 460,
            borderRadius: 999,
            background: t.accent2,
            opacity: 0.35,
            filter: "blur(80px)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: t.accent,
              color: t.accentInk,
              border: `3px solid ${INK}`,
              borderRadius: 16,
              boxShadow: `5px 5px 0 0 ${INK}`,
              transform: "rotate(-6deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            HG
          </div>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>
            <span>HG</span>
            <span style={{ color: t.accent }}>{site.shortName}</span>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 20, color: "#5d5a70", letterSpacing: 3 }}>
            {`${NETWORK_NAME.toUpperCase()} / ${site.gameLabel.toUpperCase()}`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -3, maxWidth: 1000 }}>{headline}</div>
          <div style={{ fontSize: 30, color: "#5d5a70", maxWidth: 900 }}>{site.tagline}</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 24,
            background: "#ffffff",
            border: `3px solid ${INK}`,
            borderRadius: 999,
            padding: "12px 28px",
            boxShadow: `5px 5px 0 0 ${t.accent2}`,
            alignSelf: "flex-start",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#18c964" }} />
          {site.servers[0]?.address}
          <div style={{ color: "#5d5a70" }}>{site.domain}</div>
        </div>
      </div>
    ),
    size
  );
}
