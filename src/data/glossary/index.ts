import type { Locale } from "@/i18n/config"
import { defaultLocale } from "@/i18n/config"
import { GLOSSARY_CS } from "./cs"
import { GLOSSARY_EN } from "./en"
import { GLOSSARY_SK } from "./sk"
import type { GlossaryTerm } from "./types"

export type { GlossaryTerm } from "./types"

const BY_LOCALE: Record<Locale, GlossaryTerm[]> = {
  sk: GLOSSARY_SK,
  en: GLOSSARY_EN,
  cs: GLOSSARY_CS,
}

/** @deprecated Prefer getGlossary(locale) */
export const GLOSSARY = GLOSSARY_SK

export function getGlossary(locale: Locale = defaultLocale): GlossaryTerm[] {
  return BY_LOCALE[locale] ?? GLOSSARY_SK
}

export function getGlossaryTerm(id: string, locale: Locale = defaultLocale) {
  return getGlossary(locale).find((t) => t.id === id)
}

export function glossaryTermsForLesson(
  lessonId: string,
  locale: Locale = defaultLocale
) {
  return getGlossary(locale).filter((t) => t.lessonId === lessonId)
}
