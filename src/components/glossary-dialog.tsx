"use client"

import { BookMarked } from "lucide-react"
import { GLOSSARY } from "@/data/glossary"
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

export function GlossaryDialog({ iconOnly = false }: { iconOnly?: boolean }) {
  const terms = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "sk"))

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant={iconOnly ? "ghost" : "outline"}
            size={iconOnly ? "icon" : "sm"}
            aria-label="Slovníček"
          />
        }
      >
        <BookMarked className="size-4" />
        {!iconOnly && "Slovníček"}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Slovníček pojmov</DialogTitle>
          <DialogDescription>
            Krátke vysvetlenia slov z lekcií.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[50vh] pr-3">
          <dl className="space-y-3">
            {terms.map((t) => (
              <div key={t.term} className="border-b border-border/60 pb-2">
                <dt className="font-heading font-semibold text-primary">
                  {t.term}
                </dt>
                <dd className="text-sm text-muted-foreground">{t.definition}</dd>
              </div>
            ))}
          </dl>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
