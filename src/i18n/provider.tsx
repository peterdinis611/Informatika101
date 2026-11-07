"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"
import type { Locale } from "@/i18n/config"
import { defaultLocale, localeHtmlLang } from "@/i18n/config"
import type { Dictionary } from "@/i18n/messages/sk"
import { getDictionary, t as interpolate } from "@/i18n/get-dictionary"

type I18nContextValue = {
  locale: Locale
  dict: Dictionary
  t: typeof interpolate
}

const I18nContext = createContext<I18nContextValue | null>(null)

const FALLBACK: I18nContextValue = {
  locale: defaultLocale,
  dict: getDictionary(defaultLocale),
  t: interpolate,
}

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale
  dictionary: Dictionary
  children: ReactNode
}) {
  useEffect(() => {
    document.documentElement.lang = localeHtmlLang[locale]
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;samesite=lax`
  }, [locale])

  const value = useMemo(
    () => ({ locale, dict: dictionary, t: interpolate }),
    [locale, dictionary]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/** Falls back to default locale outside provider (e.g. not-found / error). */
export function useI18n() {
  return useContext(I18nContext) ?? FALLBACK
}
