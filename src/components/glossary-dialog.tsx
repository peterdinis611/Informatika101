"use client"

import { useEffect, useRef, useState } from "react"
import { BookMarked } from "lucide-react"
import { getGlossary } from "@/data/glossary"
import { GLOSSARY_OPEN_EVENT } from "@/lib/glossary-events"
import { useI18n } from "@/i18n/provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function GlossaryDialog({ iconOnly = false }: { iconOnly?: boolean }) {
  const { locale, dict } = useI18n()
  const [open, setOpen] = useState(false)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const terms = [...getGlossary(locale)].sort((a, b) =>
    a.term.localeCompare(b.term, locale)
  )
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<{ termId: string }>).detail
      if (!detail?.termId) return
      setHighlightId(detail.termId)
      setOpen(true)
    }
    window.addEventListener(GLOSSARY_OPEN_EVENT, onOpen)
    return () => window.removeEventListener(GLOSSARY_OPEN_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open || !highlightId) return
    const el = itemRefs.current[highlightId]
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ block: "center", behavior: "smooth" })
      })
    }
  }, [open, highlightId])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setHighlightId(null)
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant={iconOnly ? "ghost" : "outline"}
            size={iconOnly ? "icon" : "sm"}
            aria-label={dict.nav.glossary}
          />
        }
      >
        <BookMarked className="size-4" />
        {!iconOnly && dict.nav.glossary}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{dict.glossary.title}</DialogTitle>
          <DialogDescription>{dict.glossary.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[50vh] pr-3">
          <dl className="space-y-3">
            {terms.map((term) => (
              <div
                key={term.id}
                id={`glossary-${term.id}`}
                ref={(node) => {
                  itemRefs.current[term.id] = node
                }}
                className={cn(
                  "border-b border-border/60 pb-2 transition",
                  highlightId === term.id &&
                    "rounded-lg border border-accent/40 bg-accent/10 px-2 pt-2"
                )}
              >
                <dt className="font-heading font-semibold text-primary">
                  {term.term}
                </dt>
                <dd className="text-sm text-muted-foreground">
                  {term.definition}
                </dd>
              </div>
            ))}
          </dl>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
