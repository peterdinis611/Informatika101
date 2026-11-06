import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getLesson, LESSONS } from "@/data/lessons"
import { LabShell } from "@/components/lab/lab-shell"
import { LessonWorkspace } from "@/components/lesson-workspace"
import { LessonGate } from "@/components/lesson-gate"
import { lessonJsonLd, lessonMetadata } from "@/lib/seo"

type Props = {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return lessonMetadata(id)
}

export default async function LessonPage({ params }: Props) {
  const { id } = await params
  const lesson = getLesson(id)
  if (!lesson) notFound()
  const jsonLd = lessonJsonLd(lesson.id)

  return (
    <LabShell hint={lesson.taskHint}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <LessonGate lessonId={lesson.id}>
        <LessonWorkspace lesson={lesson} />
      </LessonGate>
    </LabShell>
  )
}
