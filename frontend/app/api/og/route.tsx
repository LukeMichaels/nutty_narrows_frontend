import { ImageResponse } from "next/og";

// Site-wide branded fallback social-share card — used whenever a page
// doesn't have its own image set in Yoast (no featured image, and no
// default social image configured under Yoast SEO → Settings → Site
// features → Social image). See lib/yoast.ts's DEFAULT_OG_IMAGE. Once a
// real photo/graphic is set in Yoast for a page, that takes over instead.
const YELLOW = "#f5f5bf";
const PURPLE = "#614880";
const TEAL = "#6acfc3";

export async function GET() {
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
          background: YELLOW,
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 160,
            height: 8,
            borderRadius: 4,
            background: TEAL,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            color: PURPLE,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Nutty Narrows Thrift Shop
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 36,
            color: PURPLE,
            textAlign: "center",
          }}
        >
          Longview, WA&apos;s creative vending machines
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
