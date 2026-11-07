import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getLesson, getLessons } from "@/data/lessons"
import { LabShell } from "@/components/lab/lab-shell"
import { LessonWorkspace } from "@/components/lesson-workspace"
import { LessonGate } from "@/components/lesson-gate"
import { isLocale, locales, type Locale } from "@/i18n/config"
import { lessonJsonLd, lessonMetadata } from "@/lib/seo"

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getLessons(locale).map((l) => ({ locale, id: l.id }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, id } = await params
  if (!isLocale(raw)) return {}
  return lessonMetadata(id, raw)
}

export default async function LessonPage({ params }: Props) {
  const { locale: raw, id } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const lesson = getLesson(id, locale)
  if (!lesson) notFound()
  const jsonLd = lessonJsonLd(lesson.id, locale)

  return (
    <LabShell hint={lesson.taskHint}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <LessonGate lessonId={lesson.id}>
        <LessonWorkspace lesson={lesson} locale={locale} />
      </LessonGate>
    </LabShell>
  )
}
