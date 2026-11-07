import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/messages/sk"
import { sk } from "@/i18n/messages/sk"
import { en } from "@/i18n/messages/en"
import { cs } from "@/i18n/messages/cs"

const dictionaries: Record<Locale, Dictionary> = { sk, en, cs }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? sk
}

export function t(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template
  )
}
