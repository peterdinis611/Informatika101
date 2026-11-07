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

export function HelpDialog({
  hint,
  iconOnly = false,
}: {
  hint?: string
  iconOnly?: boolean
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant={iconOnly ? "ghost" : "outline"}
            size={iconOnly ? "icon" : "sm"}
            aria-label="Pomoc"
          />
        }
      >
        <HelpCircle className="size-4" />
        {!iconOnly && "Pomoc"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pomoc a nápoveda</DialogTitle>
          <DialogDescription>
            Ako sa pohybovať v laborke Informatika 101
          </DialogDescription>
        </DialogHeader>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Myš:</strong> ťahaním otáčaš 3D
            scénu, kolieskom približuješ.
          </li>
          <li>
            <strong className="text-foreground">Klik:</strong> na súčasti
            zobrazí vysvetlenie v pravom paneli.
          </li>
          <li>
            <strong className="text-foreground">Lekcie:</strong> všetky sú voľné
            (free-explore). Kvíz (aspoň 2/3) dáva body a odznak, nie zámok.
          </li>
          <li>
            <strong className="text-foreground">Ovládanie:</strong> prepínače
            a tlačidlá v paneli vpravo menia 3D scénu.
          </li>
        </ul>
        {hint && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <p className="font-medium">Nápoveda k tejto lekcii</p>
            <p>{hint}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
