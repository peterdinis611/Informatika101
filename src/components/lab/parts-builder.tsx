"use client"

import { Plus, RotateCcw, Trash2 } from "lucide-react"
import type { LabPartDef } from "@/data/lab-parts"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PartsBuilderProps = {
  catalog: LabPartDef[]
  placed: string[]
  onAdd: (id: string) => void
  onRemove: (id: string) => void
  onAddAll: () => void
  onClear: () => void
  selectedId?: string | null
  onSelect?: (id: string) => void
}

export function PartsBuilder({
  catalog,
  placed,
  onAdd,
  onRemove,
  onAddAll,
  onClear,
  selectedId,
  onSelect,
}: PartsBuilderProps) {
  const available = catalog.filter((p) => !placed.includes(p.id))
  const inScene = catalog.filter((p) => placed.includes(p.id))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          className="flex-1 rounded-xl font-extrabold"
          onClick={onAddAll}
          disabled={available.length === 0}
        >
          <Plus className="size-3.5" />
          Pridať všetko
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 rounded-xl border-2 font-extrabold"
          onClick={onClear}
          disabled={placed.length === 0}
        >
          <RotateCcw className="size-3.5" />
          Vyčistiť
        </Button>
      </div>

      <div>
        <p className="mb-2 font-heading text-sm font-semibold text-foreground">
          Inventár
        </p>
        {available.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-lab-line px-3 py-3 text-xs font-semibold text-muted-foreground">
            Všetky diely sú už na stole.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {available.map((part) => (
              <li key={part.id}>
                <button
                  type="button"
                  onClick={() => onAdd(part.id)}
                  className="flex w-full items-center gap-2 rounded-xl bg-card px-2.5 py-2 text-left ring-1 ring-foreground/10 transition hover:-translate-y-0.5 hover:ring-foreground/20"
                >
                  <span
                    className="size-3.5 shrink-0 rounded-md"
                    style={{ backgroundColor: part.color }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold text-foreground">
                      {part.label}
                    </span>
                    <span className="block text-[11px] font-semibold text-muted-foreground">
                      {part.hint}
                    </span>
                  </span>
                  <span className="flex size-8 items-center justify-center rounded-xl bg-accent text-white">
                    <Plus className="size-4" strokeWidth={2.5} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="mb-2 font-heading text-sm font-semibold text-foreground">
          Na stole
        </p>
        {inScene.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-lab-line px-3 py-3 text-xs font-semibold text-muted-foreground">
            Stôl je prázdny. Pridaj diel z inventára.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {inScene.map((part) => {
              const active = selectedId === part.id
              return (
                <li key={part.id}>
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-xl px-1.5 py-1 ring-1",
                      active
                        ? "bg-primary/5 ring-foreground shadow-[2px_2px_0_var(--primary)]"
                        : "bg-muted/50 ring-foreground/10"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect?.(part.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-1.5 py-1.5 text-left"
                    >
                      <span
                        className="size-3.5 shrink-0 rounded-md"
                        style={{ backgroundColor: part.color }}
                      />
                      <span className="truncate text-sm font-extrabold text-foreground">
                        {part.label}
                      </span>
                    </button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      aria-label={`Odstráň ${part.label}`}
                      onClick={() => onRemove(part.id)}
                      className="text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
