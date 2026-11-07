"use client"

import { LessonSchematic } from "@/components/lab/lesson-schematic"
import type { Lesson } from "@/data/lessons"
import { useI18n } from "@/i18n/provider"

type SchematicState = React.ComponentProps<typeof LessonSchematic>["state"]

export function LowPowerView({
  lesson,
  state,
}: {
  lesson: Lesson
  state: SchematicState
}) {
  const { dict } = useI18n()
  return (
    <div
      className="flex h-full min-h-[440px] flex-col gap-3 overflow-y-auto rounded-[1.75rem] border-[3px] border-border bg-card p-4"
      role="region"
      aria-label={dict.lesson.lowPowerTitle}
    >
      <p className="text-xs font-medium text-muted-foreground">
        {dict.lesson.lowPowerBody}
      </p>
      <LessonSchematic lessonId={lesson.id} state={state} />
      <div className="rounded-xl border border-dashed border-lab-line p-3 text-sm">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {dict.lesson.task}
        </p>
        <p className="font-medium">{lesson.task}</p>
        <p className="mt-2 text-xs text-muted-foreground">{lesson.taskHint}</p>
      </div>
    </div>
  )
}
