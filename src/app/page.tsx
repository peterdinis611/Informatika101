import type { Metadata } from "next"
import { HomeLanding } from "@/components/lab/home-landing"
import { LESSONS } from "@/data/lessons"
import { homeJsonLd, homePageMetadata } from "@/lib/seo"
import { lessonPath } from "@/lib/routes"

export const metadata: Metadata = homePageMetadata()

export default function HomePage() {
  const jsonLd = homeJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* SSR crawlable outline — mirrored visually by the client landing */}
      <noscript>
        <main className="mx-auto max-w-3xl px-5 py-12 text-[#102033]">
          <h1>Informatika 101 — Virtuálny počítač</h1>
          <p>
            Interaktívny 3D kurz informatiky po slovensky. {LESSONS.length}{" "}
            voľných lekcií bez registrácie.
          </p>
          <ol>
            {LESSONS.map((lesson) => (
              <li key={lesson.id}>
                <a href={lessonPath(lesson)}>
                  {lesson.order}. {lesson.title}
                </a>
                — {lesson.description}
              </li>
            ))}
          </ol>
        </main>
      </noscript>

      <HomeLanding firstLessonId={LESSONS[0].id} />
    </>
  )
}
