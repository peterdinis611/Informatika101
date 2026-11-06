"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cpu, Sparkles } from "lucide-react"
import { LESSONS } from "@/data/lessons"
import { useProgressStore, totalProgressPercent } from "@/lib/store"
import { LessonRail } from "@/components/lab/lesson-rail"
import { GlossaryDialog } from "@/components/glossary-dialog"
import { HelpDialog } from "@/components/help-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function LabShell({
  children,
  hint,
  hideRail = false,
}: {
  children: React.ReactNode
  hint?: string
  hideRail?: boolean
}) {
  const pathname = usePathname()
  const completed = useProgressStore((s) => s.completedLessons)
  const points = useProgressStore((s) => s.points)
  const pct = totalProgressPercent(completed)
  const home = pathname === "/"

  return (
    <div className="lab-wash relative flex min-h-dvh flex-col">
      <div className="lab-dots pointer-events-none absolute inset-0 opacity-50" />

      <header className="relative z-20 border-b bg-card/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background shadow-[4px_4px_0_var(--primary)] transition group-hover:-translate-y-0.5">
              <Cpu className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-xl font-semibold leading-none tracking-tight sm:text-2xl">
                Informatika 101
              </span>
              <span className="mt-1 hidden items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] text-accent sm:flex">
                <Sparkles className="size-3" />
                Toy lab · free
              </span>
            </span>
          </Link>

          <nav className="ml-1 flex items-center gap-0.5 sm:ml-2 sm:gap-1">
            <Button
              nativeButton={false}
              render={<Link href="/" />}
              variant={home ? "default" : "ghost"}
              size="sm"
              className="rounded-full font-extrabold"
            >
              Domov
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/#lessons" />}
              variant="ghost"
              size="sm"
              className="rounded-full font-extrabold"
            >
              Lekcie
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/lesson/what-is-a-computer" />}
              variant={pathname.startsWith("/lesson") ? "default" : "ghost"}
              size="sm"
              className={cn(
                "rounded-full font-extrabold",
                pathname.startsWith("/lesson") && "bg-primary"
              )}
            >
              Lab
            </Button>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-2xl border bg-card px-3 py-1.5 shadow-sm sm:flex">
              <Progress value={pct} className="w-20 gap-0 sm:w-28" />
              <Badge variant="outline" className="font-mono tabular-nums">
                {completed.length}/{LESSONS.length}
              </Badge>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant="default" className="font-mono tabular-nums">
                {points} b
              </Badge>
            </div>
            <HelpDialog hint={hint} iconOnly />
            <GlossaryDialog iconOnly />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {children}
        {!hideRail && <LessonRail />}
      </div>
    </div>
  )
}
