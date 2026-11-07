import type { Locale } from "@/i18n/config"
import { defaultLocale } from "@/i18n/config"
import { CHECKPOINTS_CS } from "./cs"
import { CHECKPOINTS_EN } from "./en"
import { CHECKPOINTS_SK } from "./sk"
import type { Checkpoint } from "./types"

export type { Checkpoint } from "./types"

const BY_LOCALE: Record<Locale, Record<string, Checkpoint>> = {
  sk: CHECKPOINTS_SK,
  en: CHECKPOINTS_EN,
  cs: CHECKPOINTS_CS,
}

/** @deprecated Prefer getCheckpoints(locale) */
export const CHECKPOINTS = CHECKPOINTS_SK

export function getCheckpoints(
  locale: Locale = defaultLocale
): Record<string, Checkpoint> {
  return BY_LOCALE[locale] ?? CHECKPOINTS_SK
}

export function getCheckpoint(
  lessonId: string,
  locale: Locale = defaultLocale
): Checkpoint | undefined {
  return getCheckpoints(locale)[lessonId]
}
