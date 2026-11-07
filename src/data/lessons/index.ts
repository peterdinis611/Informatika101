import type { Locale } from "@/i18n/config"
import { defaultLocale } from "@/i18n/config"
import { LESSONS_CS } from "./cs"
import { LESSONS_EN } from "./en"
import { LESSONS_SK } from "./sk"
import type { Lesson } from "./types"

export type { Lesson, QuizQuestion } from "./types"

const BY_LOCALE: Record<Locale, Lesson[]> = {
  sk: LESSONS_SK,
  en: LESSONS_EN,
  cs: LESSONS_CS,
}

/** @deprecated Prefer getLessons(locale) — defaults to Slovak for legacy imports. */
export const LESSONS = LESSONS_SK

export function getLessons(locale: Locale = defaultLocale): Lesson[] {
  return BY_LOCALE[locale] ?? LESSONS_SK
}

export function getLesson(
  id: string,
  locale: Locale = defaultLocale
): Lesson | undefined {
  return getLessons(locale).find((l) => l.id === id)
}

export function getNextLesson(id: string, locale: Locale = defaultLocale) {
  const lessons = getLessons(locale)
  const current = lessons.find((l) => l.id === id)
  if (!current) return undefined
  return lessons.find((l) => l.order === current.order + 1)
}
