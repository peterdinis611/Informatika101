"use client"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import type { Lesson } from "@/data/lessons"
import { getLessons } from "@/data/lessons"
import { useProgressStore } from "@/lib/store"
import { burstConfetti } from "@/components/lab/confetti"
import { QUIZ_PASS_SCORE, didPassQuiz, scoreQuiz } from "@/lib/quiz"
import { useI18n } from "@/i18n/provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type QuizPanelProps = {
  lesson: Lesson
  onPassed?: () => void
}

export function QuizPanel({ lesson, onPassed }: QuizPanelProps) {
  const { locale, dict, t } = useI18n()
  const completeQuiz = useProgressStore((s) => s.completeQuiz)
  const existing = useProgressStore((s) => s.quizScores[lesson.id])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const totalLessons = getLessons(locale).length

  function submit() {
    const s = scoreQuiz(answers, lesson.quiz)
    setScore(s)
    setSubmitted(true)
    completeQuiz(lesson.id, s, lesson.badge)
    if (didPassQuiz(s)) {
      onPassed?.()
      const isLast = lesson.order === totalLessons
      burstConfetti(isLast ? 160 : 70)
    }
  }

  const allAnswered = lesson.quiz.every((q) => answers[q.id] !== undefined)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-lg font-semibold">{dict.quiz.title}</h3>
        <p className="text-sm text-muted-foreground">
          {t(dict.quiz.intro, { pass: QUIZ_PASS_SCORE })}
          {existing !== undefined && !submitted && (
            <span> {t(dict.quiz.lastScore, { score: existing })}</span>
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
                      !show &&
                        isChosen &&
                        "border-teal-500 bg-teal-50 dark:bg-teal-950",
                      !show && !isChosen && "hover:bg-muted",
                      show &&
                        isCorrect &&
                        "border-emerald-500 bg-emerald-50 dark:bg-emerald-950",
                      show &&
                        isChosen &&
                        !isCorrect &&
                        "border-red-400 bg-red-50 dark:bg-red-950"
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
        <Button
          disabled={!allAnswered}
          onClick={submit}
          className="w-full sm:w-auto"
        >
          {dict.quiz.check}
        </Button>
      ) : (
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm font-medium",
            didPassQuiz(score)
              ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
              : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
          )}
        >
          {t(dict.quiz.result, { score })}{" "}
          {didPassQuiz(score)
            ? t(dict.quiz.badge, { badge: lesson.badge })
            : dict.quiz.retryHint}
          {!didPassQuiz(score) && (
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
              {dict.quiz.retry}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
