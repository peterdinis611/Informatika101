import { describe, expect, it } from "vitest"
import { QUIZ_PASS_SCORE, didPassQuiz, scoreQuiz } from "@/lib/quiz"

describe("quiz pass rules", () => {
  it("requires at least QUIZ_PASS_SCORE correct answers", () => {
    expect(QUIZ_PASS_SCORE).toBe(2)
    expect(didPassQuiz(0)).toBe(false)
    expect(didPassQuiz(1)).toBe(false)
    expect(didPassQuiz(2)).toBe(true)
    expect(didPassQuiz(3)).toBe(true)
  })

  it("scores answers against quiz definitions", () => {
    const quiz = [
      { id: "q1", correctIndex: 0 },
      { id: "q2", correctIndex: 2 },
      { id: "q3", correctIndex: 1 },
    ]
    expect(scoreQuiz({ q1: 0, q2: 2, q3: 1 }, quiz)).toBe(3)
    expect(scoreQuiz({ q1: 0, q2: 0, q3: 1 }, quiz)).toBe(2)
    expect(scoreQuiz({ q1: 1, q2: 1, q3: 0 }, quiz)).toBe(0)
    expect(scoreQuiz({}, quiz)).toBe(0)
  })
})
