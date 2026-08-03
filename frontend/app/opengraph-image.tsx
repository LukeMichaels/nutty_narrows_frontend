import { ImageResponse } from "next/og";

export const alt = "Nutty Narrows Thrift Shop — a creative vending machine business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BLACK = "#0f1729";
const BLUE = "#3abbec";

// Placeholder OG card — will be replaced with real vending-machine artwork
// once Phase 3 defines the site's visual identity.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BLACK,
          color: BLUE,
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        Nutty Narrows Thrift Shop
      </div>
    ),
    { ...size }
  );
}
