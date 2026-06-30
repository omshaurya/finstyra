import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const img = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #9333ea 100%)",
          color: "white",
          fontSize: 244,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: -6,
        }}
      >
        FS
      </div>
    ),
    { width: 512, height: 512 }
  );
  const buffer = await img.arrayBuffer();
  return new NextResponse(buffer, {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
