import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  const t = site.theme;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: t.accent,
            color: t.accentInk,
            border: "3px solid #14121f",
            borderRadius: 14,
            boxShadow: "4px 4px 0 0 #14121f",
            transform: "rotate(-8deg)",
            fontSize: 24,
            fontWeight: 800,
            fontFamily: "sans-serif",
          }}
        >
          HG
        </div>
      </div>
    ),
    size
  );
}
