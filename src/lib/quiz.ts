/** Minimum correct answers (of 3) to pass a lesson quiz. */
export const QUIZ_PASS_SCORE = 2

export function didPassQuiz(score: number): boolean {
  return score >= QUIZ_PASS_SCORE
}

export function scoreQuiz(
  answers: Record<string, number>,
  quiz: { id: string; correctIndex: number }[]
): number {
  let score = 0
  for (const q of quiz) {
    if (answers[q.id] === q.correctIndex) score++
  }
  return score
}
