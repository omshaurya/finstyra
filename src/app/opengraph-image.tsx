import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Finstyra – Free Financial Calculators";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d1117 0%, #161b22 60%, #1a1033 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: 20,
              background: "linear-gradient(135deg, #6366f1 0%, #9333ea 100%)",
              color: "white",
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            FS
          </div>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700, color: "white" }}>
            Finstyra
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#c9d1d9", textAlign: "center", maxWidth: 880 }}>
          100+ Free Financial Calculators
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#8b949e", marginTop: 18, textAlign: "center", maxWidth: 820 }}>
          FIRE · Retirement · Mortgages · Investing · Loans · Taxes
        </div>
      </div>
    ),
    { ...size }
  );
}
