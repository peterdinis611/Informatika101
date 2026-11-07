import { ImageResponse } from "next/og"
import { getLessons } from "@/data/lessons"
import { defaultLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/get-dictionary"

export const alt = "Informatika 101"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  const dict = getDictionary(defaultLocale)
  const count = getLessons(defaultLocale).length

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1a3d36",
          color: "#e8f7f3",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#2dd4bf",
          }}
        >
          {`3D LAB · ${count} · SK / EN / CS`}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: -3,
            }}
          >
            {dict.landing.headline}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: -3,
              color: "#2dd4bf",
            }}
          >
            101
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: "#93b4bc",
              maxWidth: 720,
            }}
          >
            {dict.landing.subhead}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
