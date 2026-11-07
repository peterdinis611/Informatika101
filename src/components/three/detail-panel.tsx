"use client"

import { X, Focus, Lightbulb, BookMarked } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInspect } from "@/components/three/inspect-context"
import { getGlossaryTerm } from "@/data/glossary"
import { openGlossaryTerm } from "@/lib/glossary-events"
import { useI18n } from "@/i18n/provider"

export function DetailPanel() {
  const { focused, clear } = useInspect()
  const { locale, dict, t } = useI18n()
  if (!focused) return null

  const glossary = focused.glossaryId
    ? getGlossaryTerm(focused.glossaryId, locale)
    : undefined

  return (
    <aside
      className="pointer-events-auto absolute right-3 top-3 z-30 w-[min(100%-1.5rem,340px)] animate-in fade-in slide-in-from-right-3 duration-300"
      role="dialog"
      aria-label={`Detail: ${focused.title}`}
    >
      <div className="overflow-hidden rounded-2xl border-[3px] border-foreground/20 bg-card/98 shadow-[8px_8px_0_rgba(16,32,51,0.22)] backdrop-blur-md">
        <div className="flex items-start justify-between gap-2 border-b border-lab-line bg-foreground px-3.5 py-2.5 text-background">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              <Focus className="size-3" />
              {dict.detail.zoom}
            </p>
            <h3 className="font-heading text-lg font-semibold leading-tight">
              {focused.title}
            </h3>
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            className="shrink-0 text-background hover:bg-background/15 hover:text-background"
            onClick={clear}
            aria-label="Zavrieť detail"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="space-y-3 p-3.5">
          <p className="text-sm font-semibold leading-relaxed text-foreground">
            {focused.summary}
          </p>
          {focused.facts && focused.facts.length > 0 && (
            <ul className="space-y-1.5">
              {focused.facts.map((f) => (
                <li
                  key={f}
                  className="flex gap-2 text-xs font-medium leading-snug text-muted-foreground"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          {focused.tip && (
            <p className="flex gap-2 rounded-xl bg-accent/10 px-2.5 py-2 text-xs font-semibold text-accent">
              <Lightbulb className="mt-0.5 size-3.5 shrink-0" />
              {focused.tip}
            </p>
          )}
          {glossary && (
            <Button
              size="sm"
              variant="secondary"
              className="w-full gap-1.5 font-extrabold"
              onClick={() => openGlossaryTerm(glossary.id)}
            >
              <BookMarked className="size-3.5" />
              {t(dict.detail.glossary, { term: glossary.term })}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="w-full font-extrabold"
            onClick={clear}
          >
            {dict.detail.back}
          </Button>
        </div>
      </div>
    </aside>
  )
}
