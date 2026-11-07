"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useI18n } from "@/i18n/provider"

export function HelpDialog({
  hint,
  iconOnly = false,
}: {
  hint?: string
  iconOnly?: boolean
}) {
  const { dict } = useI18n()

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant={iconOnly ? "ghost" : "outline"}
            size={iconOnly ? "icon" : "sm"}
            aria-label={dict.nav.help}
          />
        }
      >
        <HelpCircle className="size-4" />
        {!iconOnly && dict.nav.help}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.help.title}</DialogTitle>
          <DialogDescription>{dict.help.description}</DialogDescription>
        </DialogHeader>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">{dict.help.mouse}</strong>{" "}
            {dict.help.mouseBody}
          </li>
          <li>
            <strong className="text-foreground">{dict.help.click}</strong>{" "}
            {dict.help.clickBody}
          </li>
          <li>
            <strong className="text-foreground">{dict.help.lessons}</strong>{" "}
            {dict.help.lessonsBody}
          </li>
          <li>
            <strong className="text-foreground">{dict.help.controls}</strong>{" "}
            {dict.help.controlsBody}
          </li>
        </ul>
        {hint && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <p className="font-medium">{dict.help.hintTitle}</p>
            <p>{hint}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
