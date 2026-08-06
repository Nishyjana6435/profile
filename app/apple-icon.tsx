import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7c3aed, #d946ef)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={96}
          height={96}
          fill="none"
          stroke="white"
          strokeWidth={1.5}
        >
          <path
            d="M17 3 C10 7, 10 10, 17 12 C10 14, 10 17, 17 21"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
