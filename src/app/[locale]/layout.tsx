import { notFound } from "next/navigation"
import { I18nProvider } from "@/i18n/provider"
import { getDictionary } from "@/i18n/get-dictionary"
import { isLocale, locales, type Locale } from "@/i18n/config"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dictionary = getDictionary(locale)

  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      {children}
    </I18nProvider>
  )
}
