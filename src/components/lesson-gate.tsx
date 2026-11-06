"use client"

/** All lessons are free — gate always renders children. */
export function LessonGate({
  children,
}: {
  lessonId: string
  children: React.ReactNode
}) {
  return <>{children}</>
}
