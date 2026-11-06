"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { LESSONS } from "@/data/lessons"
import { lessonPath } from "@/lib/routes"
import { useProgressStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function LessonRail() {
  const pathname = usePathname()
  const router = useRouter()
  const completed = useProgressStore((s) => s.completedLessons)

  const activeIndex = useMemo(() => {
    const i = LESSONS.findIndex((l) => pathname === `/lesson/${l.id}`)
    return i >= 0 ? i : 0
  }, [pathname])

  const current = LESSONS[activeIndex]
  const prev = activeIndex > 0 ? LESSONS[activeIndex - 1] : null
  const next =
    activeIndex < LESSONS.length - 1 ? LESSONS[activeIndex + 1] : null

  function go(dir: -1 | 1) {
    const target = dir < 0 ? prev : next
    if (target) router.push(lessonPath(target))
  }

  return (
    <nav
      id="lessons"
      aria-label="Navigácia lekcií"
      className="relative z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            disabled={!prev}
            onClick={() => go(-1)}
            aria-label={prev ? `Predchádzajúca: ${prev.shortTitle}` : "Si na prvej lekcii"}
            className={cn(
              "group flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-1.5 text-left transition",
              prev
                ? "hover:bg-muted/80"
                : "cursor-not-allowed opacity-35"
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground">
              <ChevronLeft className="size-4" />
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Predchádzajúca
              </span>
              <span className="block truncate text-[13px] font-semibold">
                {prev?.shortTitle ?? "—"}
              </span>
            </span>
          </button>

          <div className="min-w-0 shrink-0 text-center">
            <p className="font-heading text-[15px] font-bold tracking-[-0.02em]">
              <span className="font-mono text-[12px] font-semibold text-accent">
                {String(current.order).padStart(2, "0")}
              </span>
              <span className="mx-1.5 text-muted-foreground/40">·</span>
              {current.shortTitle}
            </p>
            <p className="mt-0.5 font-mono text-[11px] font-medium text-muted-foreground">
              {activeIndex + 1} / {LESSONS.length}
              {completed.length > 0 ? ` · ${completed.length} hotových` : ""}
            </p>
          </div>

          <button
            type="button"
            disabled={!next}
            onClick={() => go(1)}
            aria-label={next ? `Ďalšia: ${next.shortTitle}` : "Si na poslednej lekcii"}
            className={cn(
              "group flex min-w-0 flex-1 items-center justify-end gap-2 rounded-xl px-2 py-1.5 text-right transition",
              next
                ? "hover:bg-muted/80"
                : "cursor-not-allowed opacity-35"
            )}
          >
            <span className="hidden min-w-0 sm:block">
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Ďalšia
              </span>
              <span className="block truncate text-[13px] font-semibold">
                {next?.shortTitle ?? "—"}
              </span>
            </span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground">
              <ChevronRight className="size-4" />
            </span>
          </button>
        </div>

        {/* Full-width jump track — each segment is a lesson */}
        <ol
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${LESSONS.length}, minmax(0, 1fr))` }}
        >
          {LESSONS.map((lesson, i) => {
            const done = completed.includes(lesson.id)
            const active = i === activeIndex
            return (
              <li key={lesson.id} className="min-w-0">
                <Link
                  href={lessonPath(lesson)}
                  title={`${lesson.order}. ${lesson.title}`}
                  aria-current={active ? "page" : undefined}
                  aria-label={`Lekcia ${lesson.order}: ${lesson.shortTitle}`}
                  className={cn(
                    "block h-2 rounded-full transition-all duration-200",
                    active && "h-2.5 bg-accent shadow-[0_0_0_2px_color-mix(in_oklab,var(--accent)_35%,transparent)]",
                    !active && done && "bg-accent/55 hover:bg-accent/80",
                    !active && !done && "bg-muted-foreground/20 hover:bg-muted-foreground/35"
                  )}
                />
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
