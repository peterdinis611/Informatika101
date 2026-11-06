"use client"

import Link from "next/link"
import { Cpu, Trophy } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { GlossaryDialog } from "@/components/glossary-dialog"
import { HelpDialog } from "@/components/help-dialog"
import { SimpleProgress } from "@/components/ui/simple-progress"
import { Badge } from "@/components/ui/badge"
import { useProgressStore, totalProgressPercent } from "@/lib/store"

export function AppHeader({ hint }: { hint?: string }) {
  const points = useProgressStore((s) => s.points)
  const completed = useProgressStore((s) => s.completedLessons)
  const badges = useProgressStore((s) => s.badges)
  const pct = totalProgressPercent(completed)

  return (
    <header className="sticky top-0 z-40 border-b border-teal-200/60 bg-white/80 backdrop-blur-md dark:border-teal-900/50 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-teal-800 dark:text-teal-300">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-700 text-white shadow">
            <Cpu className="size-5" />
          </span>
          Virtuálny počítač
        </Link>

        <div className="mx-auto hidden min-w-[160px] max-w-xs flex-1 items-center gap-2 sm:flex">
          <SimpleProgress value={pct} />
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {pct}%
          </span>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Trophy className="size-3.5 text-amber-500" />
            {points} bodov
          </Badge>
          {badges.length > 0 && (
            <Badge variant="outline" className="max-w-[140px] truncate">
              {badges.length} odznakov
            </Badge>
          )}
          <HelpDialog hint={hint} />
          <GlossaryDialog />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
