"use client"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import type { Lesson } from "@/data/lessons"
import { useProgressStore } from "@/lib/store"
import { burstConfetti } from "@/components/lab/confetti"
import { LESSONS } from "@/data/lessons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type QuizPanelProps = {
  lesson: Lesson
  onPassed?: () => void
}

export function QuizPanel({ lesson, onPassed }: QuizPanelProps) {
  const completeQuiz = useProgressStore((s) => s.completeQuiz)
  const existing = useProgressStore((s) => s.quizScores[lesson.id])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  function submit() {
    let s = 0
    for (const q of lesson.quiz) {
      if (answers[q.id] === q.correctIndex) s++
    }
    setScore(s)
    setSubmitted(true)
    completeQuiz(lesson.id, s, lesson.badge)
    if (s >= 2) {
      onPassed?.()
      const isLast = lesson.order === LESSONS.length
      burstConfetti(isLast ? 160 : 70)
    }
  }

  const allAnswered = lesson.quiz.every((q) => answers[q.id] !== undefined)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-lg font-semibold">Mini kvíz</h3>
        <p className="text-sm text-muted-foreground">
          Odpovedz na 3 otázky. Na odomknutie ďalšej lekcie potrebuješ aspoň 2
          správne.
          {existing !== undefined && !submitted && (
            <span> Posledný výsledok: {existing}/3.</span>
          )}
        </p>
      </div>

      {lesson.quiz.map((q, qi) => {
        const chosen = answers[q.id]
        const show = submitted
        return (
          <div
            key={q.id}
            className="rounded-xl border border-border/80 bg-card/60 p-3"
          >
            <p className="mb-2 text-sm font-medium">
              {qi + 1}. {q.question}
            </p>
            <div className="grid gap-1.5">
              {q.options.map((opt, oi) => {
                const isCorrect = oi === q.correctIndex
                const isChosen = chosen === oi
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={submitted}
                    onClick={() =>
                      setAnswers((a) => ({ ...a, [q.id]: oi }))
                    }
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm transition",
                      !show && isChosen && "border-teal-500 bg-teal-50 dark:bg-teal-950",
                      !show && !isChosen && "hover:bg-muted",
                      show && isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950",
                      show && isChosen && !isCorrect && "border-red-400 bg-red-50 dark:bg-red-950"
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      {show && isCorrect && (
                        <CheckCircle2 className="size-4 text-emerald-600" />
                      )}
                      {show && isChosen && !isCorrect && (
                        <XCircle className="size-4 text-red-500" />
                      )}
                      {opt}
                    </span>
                  </button>
                )
              })}
            </div>
            {show && (
              <p className="mt-2 text-xs text-muted-foreground">
                {q.explanation}
              </p>
            )}
          </div>
        )
      })}

      {!submitted ? (
        <Button disabled={!allAnswered} onClick={submit} className="w-full sm:w-auto">
          Skontrolovať odpovede
        </Button>
      ) : (
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm font-medium",
            score >= 2
              ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
              : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
          )}
        >
          Výsledok: {score}/3.{" "}
          {score >= 2
            ? `Výborne! Získavaš odznak „${lesson.badge}“.`
            : "Skús to znova — môžeš kvíz opakovať."}
          {score < 2 && (
            <Button
              variant="outline"
              size="sm"
              className="ml-2 mt-2"
              onClick={() => {
                setSubmitted(false)
                setAnswers({})
                setScore(0)
              }}
            >
              Skúsiť znova
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
