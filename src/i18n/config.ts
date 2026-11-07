export const locales = ["sk", "en", "cs"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "sk"

export const localeNames: Record<Locale, string> = {
  sk: "Slovenčina",
  en: "English",
  cs: "Čeština",
}

export const localeHtmlLang: Record<Locale, string> = {
  sk: "sk",
  en: "en",
  cs: "cs",
}

export const localeOg: Record<Locale, string> = {
  sk: "sk_SK",
  en: "en_US",
  cs: "cs_CZ",
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
