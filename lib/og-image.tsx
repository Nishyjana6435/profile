import { ImageResponse } from "next/og";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export function renderProfileOgImage({
  name,
  tagline,
  title,
}: {
  name: string;
  tagline?: string;
  title?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 30% 30%, #3b1a6b 0%, #0a0514 70%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #d946ef)",
            marginBottom: 40,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={32}
            height={32}
            fill="none"
            stroke="white"
            strokeWidth={2}
          >
            <path
              d="M17 3 C10 7, 10 10, 17 12 C10 14, 10 17, 17 21"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {tagline && (
          <div style={{ fontSize: 28, color: "#c4b5fd", marginBottom: 12 }}>
            {tagline}
          </div>
        )}
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          {name}
        </div>
        {title && (
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.7)", marginTop: 20 }}>
            {title}
          </div>
        )}
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  );
}
