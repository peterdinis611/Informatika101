import { cn } from "@/lib/utils"

export function LabSpinner({
  label = "Načítavam lab…",
  className,
  compact = false,
}: {
  label?: string
  className?: string
  /** Smaller footprint for overlays (hero / canvas). */
  compact?: boolean
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex flex-col items-center justify-center gap-5",
        compact ? "gap-3" : "min-h-[40vh]",
        className
      )}
    >
      <div
        className={cn("lab-spinner", compact && "scale-[0.85]")}
        aria-hidden
      >
        <span className="lab-spin-layer lab-spin-a" />
        <span className="lab-spin-layer lab-spin-b" />
        <span className="lab-spin-layer lab-spin-c" />
        <span className="lab-spin-core" />
      </div>
      <p
        className={cn(
          "font-heading font-semibold tracking-wide text-muted-foreground",
          compact ? "text-xs" : "text-sm"
        )}
      >
        {label}
      </p>
      <span className="sr-only">Načítava sa, počkaj chvíľu.</span>
    </div>
  )
}
