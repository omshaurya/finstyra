import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          background: "linear-gradient(135deg, #6366f1 0%, #9333ea 100%)",
          color: "white",
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: -0.5,
        }}
      >
        FS
      </div>
    ),
    { ...size }
  );
}
