"use client"

import Link from "next/link"
import { CheckCircle2, Sparkles } from "lucide-react"
import { LESSONS } from "@/data/lessons"
import { useProgressStore, totalProgressPercent } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SimpleProgress } from "@/components/ui/simple-progress"
import { Mascot } from "@/components/mascot"

export function LessonHub() {
  const completed = useProgressStore((s) => s.completedLessons)
  const badges = useProgressStore((s) => s.badges)
  const points = useProgressStore((s) => s.points)
  const resetProgress = useProgressStore((s) => s.resetProgress)
  const pct = totalProgressPercent(completed)

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl dark:bg-teal-700/20" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl dark:bg-cyan-800/20" />
      </div>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-300/60 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800 dark:border-teal-700 dark:bg-slate-900/70 dark:text-teal-300">
            <Sparkles className="size-3.5" />
            Interaktívny 3D kurz · všetky lekcie free
          </p>
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
            Virtuálny
            <span className="block bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              počítač
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Nauč sa informatiku od nuly: pridávaj a odoberaj súčiastky, skladaj
            bity, krokuj procesor — všetko v 3D, po slovensky.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href={`/lesson/${LESSONS[0].id}`} />}
            >
              Začať 1. lekciu
            </Button>
            <div className="flex min-w-[160px] flex-1 items-center gap-2 sm:max-w-xs">
              <SimpleProgress value={pct} className="flex-1" />
              <span className="text-xs text-muted-foreground">{pct}%</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>{points} bodov</span>
            <span>·</span>
            <span>{badges.length} odznakov</span>
            <span>·</span>
            <span>
              {completed.length}/{LESSONS.length} lekcií
            </span>
          </div>
        </div>

        <div>
          <Mascot message="Ahoj! Som Byte. Všetky lekcie sú odomknuté — skáč kam chceš. V 3D si diely pridávaj a odoberaj!" />
          {badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {badges.map((b) => (
                <Badge key={b} variant="secondary">
                  {b}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-heading text-2xl font-bold">Lekcie</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Naozaj resetovať celý postup?")) resetProgress()
            }}
          >
            Resetovať postup
          </Button>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2">
          {LESSONS.map((lesson, i) => {
            const done = completed.includes(lesson.id)
            return (
              <li key={lesson.id}>
                <Link href={`/lesson/${lesson.id}`}>
                  <div
                    className="group relative overflow-hidden rounded-2xl border border-teal-200/80 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-teal-900 dark:bg-slate-900/70"
                    style={{ animationDelay: `${0.05 * i}s` }}
                  >
                    <div
                      className="absolute -right-6 -top-6 size-24 rounded-full opacity-30 blur-2xl"
                      style={{ background: lesson.accent }}
                    />
                    <div className="relative flex items-start gap-3">
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                        style={{ background: lesson.accent }}
                      >
                        {done ? (
                          <CheckCircle2 className="size-5" />
                        ) : (
                          lesson.order
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading font-semibold leading-tight">
                          {lesson.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {lesson.description}
                        </p>
                        <p className="mt-2 text-xs font-medium text-teal-700 dark:text-teal-400">
                          Odznak: {lesson.badge}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
