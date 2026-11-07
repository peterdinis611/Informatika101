"use client"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import type { Checkpoint } from "@/data/checkpoints"
import { useProgressStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CheckpointPanel({
  lessonId,
  checkpoint,
}: {
  lessonId: string
  checkpoint: Checkpoint
}) {
  const done = useProgressStore((s) => s.checkpoints[lessonId])
  const completeCheckpoint = useProgressStore((s) => s.completeCheckpoint)
  const [choice, setChoice] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function submit() {
    if (choice === null) return
    setSubmitted(true)
    if (choice === checkpoint.correctIndex) {
      completeCheckpoint(lessonId)
    }
  }

  const correct = choice === checkpoint.correctIndex

  return (
    <div className="rounded-xl border border-border/80 bg-card/60 p-3">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        Rýchla kontrola
      </p>
      <p className="mb-2 text-sm font-medium">{checkpoint.question}</p>
      <div className="grid gap-1.5">
        {checkpoint.options.map((opt, oi) => {
          const isCorrect = oi === checkpoint.correctIndex
          const isChosen = choice === oi
          const show = submitted
          return (
            <button
              key={opt}
              type="button"
              disabled={done || submitted}
              onClick={() => setChoice(oi)}
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
      {done ? (
        <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          Kontrola splnená. {checkpoint.explanation}
        </p>
      ) : !submitted ? (
        <Button
          size="sm"
          className="mt-2"
          disabled={choice === null}
          onClick={submit}
        >
          Overiť
        </Button>
      ) : (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-muted-foreground">{checkpoint.explanation}</p>
          {!correct && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSubmitted(false)
                setChoice(null)
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
