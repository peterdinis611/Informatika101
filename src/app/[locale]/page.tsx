import type { Metadata } from "next"
import { HomeLanding } from "@/components/lab/home-landing"
import { getLessons } from "@/data/lessons"
import { getDictionary, t } from "@/i18n/get-dictionary"
import { isLocale, type Locale } from "@/i18n/config"
import { homeJsonLd, homePageMetadata } from "@/lib/seo"
import { lessonPath } from "@/lib/routes"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  return homePageMetadata(raw)
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const lessons = getLessons(locale)
  const dict = getDictionary(locale)
  const jsonLd = homeJsonLd(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <noscript>
        <main className="mx-auto max-w-3xl px-5 py-12 text-[#102033]">
          <h1>{dict.noscript.title}</h1>
          <p>{t(dict.noscript.body, { count: lessons.length })}</p>
          <ol>
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <a href={lessonPath(lesson, locale)}>
                  {lesson.order}. {lesson.title}
                </a>
                — {lesson.description}
              </li>
            ))}
          </ol>
        </main>
      </noscript>

      <HomeLanding firstLessonId={lessons[0].id} locale={locale} />
    </>
  )
}
