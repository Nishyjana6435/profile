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
          background: "linear-gradient(135deg, #7c3aed, #d946ef)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
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
    ),
    { ...size }
  );
}
