"use client"

import { usePathname, useRouter } from "next/navigation"
import { Languages } from "lucide-react"
import {
  defaultLocale,
  isLocale,
  localeNames,
  locales,
  type Locale,
} from "@/i18n/config"
import { useI18n } from "@/i18n/provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

function swapLocaleInPath(pathname: string, next: Locale) {
  const parts = pathname.split("/")
  if (parts.length > 1 && isLocale(parts[1])) {
    parts[1] = next
    return parts.join("/") || `/${next}`
  }
  return `/${next}${pathname === "/" ? "" : pathname}`
}

export function LanguageSwitcher({ iconOnly = false }: { iconOnly?: boolean }) {
  const { locale, dict } = useI18n()
  const pathname = usePathname()
  const router = useRouter()

  function select(next: Locale) {
    if (next === locale) return
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`
    router.push(swapLocaleInPath(pathname || `/${defaultLocale}`, next))
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant={iconOnly ? "ghost" : "outline"}
            size={iconOnly ? "icon" : "sm"}
            aria-label={dict.nav.language}
          />
        }
      >
        <Languages className="size-4" />
        {!iconOnly && (
          <span className="ml-1.5 font-extrabold uppercase tracking-wide">
            {locale}
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{dict.nav.language}</DialogTitle>
          <DialogDescription>{localeNames[locale]}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {locales.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => select(code)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition",
                code === locale
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border hover:bg-muted"
              )}
            >
              <span className="mr-2 font-mono text-xs uppercase text-muted-foreground">
                {code}
              </span>
              {localeNames[code]}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
