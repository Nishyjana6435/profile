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
            "radial-gradient(circle at 30% 30%, #2a2a2a 0%, #121212 70%)",
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
            background: "linear-gradient(135deg, #e51e31, #ff5a6a)",
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
          <div style={{ fontSize: 28, color: "#ff8a95", marginBottom: 12 }}>
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

export function renderProductOgImage({
  name,
  tagline,
  description,
  accent,
  byline = "by Nishy",
}: {
  name: string;
  tagline: string;
  description: string;
  accent: "fuchsia" | "sky";
  byline?: string;
}) {
  const to = accent === "sky" ? "#a5a5a5" : "#ff5a6a";
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
          background: `radial-gradient(circle at 75% 25%, ${to}33 0%, transparent 45%), radial-gradient(circle at 20% 60%, #2a2a2a 0%, #121212 70%)`,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: `linear-gradient(135deg, #e51e31, ${to})`,
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 22, color: "#ff5a6a", marginLeft: 8 }}>{byline}</div>
        </div>
        <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>{tagline}</div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.7)", marginTop: 28, maxWidth: 980, lineHeight: 1.4 }}>
          {description}
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  );
}
