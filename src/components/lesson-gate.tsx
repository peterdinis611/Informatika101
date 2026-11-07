"use client"

/**
 * Free-explore: všetky lekcie sú otvorené.
 * Komponent ostáva kvôli route API — žiadny zámok.
 */
export function LessonGate({
  children,
}: {
  lessonId: string
  children: React.ReactNode
}) {
  return <>{children}</>
}
