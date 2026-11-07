import type { Lesson } from "@/data/lessons"
import type { Locale } from "@/i18n/config"
import { defaultLocale } from "@/i18n/config"

export function lessonPath(
  lessonOrId: Lesson | string,
  locale: Locale = defaultLocale
) {
  const id = typeof lessonOrId === "string" ? lessonOrId : lessonOrId.id
  return `/${locale}/lesson/${id}`
}

export function homePath(locale: Locale = defaultLocale) {
  return `/${locale}`
}

export function lessonsHashPath(locale: Locale = defaultLocale) {
  return `/${locale}#lessons`
}

export function withLocale(path: string, locale: Locale) {
  const clean = path.startsWith("/") ? path : `/${path}`
  if (clean === "/") return `/${locale}`
  return `/${locale}${clean}`
}

export const ROUTES = {
  home: "/",
  lessons: "/#lessons",
  firstLesson: "/lesson/what-is-a-computer",
} as const
