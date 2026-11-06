import { ImageResponse } from "next/og"
import { getLesson, LESSONS } from "@/data/lessons"
import { SITE_NAME } from "@/lib/seo"

export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lesson = getLesson(id)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3f6f1",
          color: "#102033",
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
            color: "#e23d2a",
          }}
        >
          {SITE_NAME} · LEKCIA {lesson?.order ?? "?"}/{LESSONS.length}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 0.95 }}>
            {lesson?.title ?? "Lekcia sa nenašla"}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              color: "#3a5166",
              maxWidth: 960,
            }}
          >
            {lesson?.description ?? "Táto lekcia v kurze neexistuje."}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
