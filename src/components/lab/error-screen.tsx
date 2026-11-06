"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ErrorScreen({
  code,
  title,
  detail,
  retry,
  compact = false,
}: {
  code: 404 | 500
  title: string
  detail: string
  retry?: () => void
  compact?: boolean
}) {
  const stamp = code === 404 ? "NENÁJDENÉ" : "VÝPADOK"

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden px-5 py-16",
        compact ? "min-h-[68vh]" : "lab-wash min-h-dvh"
      )}
    >
      {!compact && (
        <div className="lab-dots pointer-events-none absolute inset-0 opacity-50" />
      )}
      <p
        aria-hidden
        className="pointer-events-none absolute -right-6 top-4 select-none font-heading text-[9.5rem] font-bold leading-none text-foreground/[0.06] sm:top-8 sm:text-[14rem] md:right-8 md:text-[16rem]"
      >
        {code}
      </p>

      <div className="relative z-10 w-full max-w-lg">
        <p
          className="mb-4 inline-flex rotate-[-3deg] items-center rounded-md border-[3px] border-primary px-3 py-1 font-mono text-[11px] font-bold tracking-[0.22em] text-primary shadow-[4px_4px_0_var(--foreground)]"
        >
          LAB {stamp} · {code}
        </p>
        <h1 className="font-heading text-4xl font-semibold leading-[0.92] tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-md text-base font-semibold leading-relaxed text-muted-foreground">
          {detail}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {retry && (
            <Button onClick={retry} size="lg" className="h-11 rounded-2xl px-5 font-extrabold">
              Skúsiť znova
            </Button>
          )}
          <Button
            variant={retry ? "outline" : "default"}
            size="lg"
            className="h-11 rounded-2xl border-2 px-5 font-extrabold"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Späť na úvod
          </Button>
        </div>
      </div>
    </div>
  )
}
