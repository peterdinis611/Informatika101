import type { MetadataRoute } from "next"
import { getLessons } from "@/data/lessons"
import { getDictionary, t } from "@/i18n/get-dictionary"
import { defaultLocale } from "@/i18n/config"

export default function manifest(): MetadataRoute.Manifest {
  const dict = getDictionary(defaultLocale)
  const lessons = getLessons(defaultLocale)
  return {
    name: dict.brand.name,
    short_name: "Info 101",
    description: t(dict.landing.lead, { count: lessons.length }),
    start_url: `/${defaultLocale}`,
    display: "standalone",
    background_color: "#f3f6f1",
    theme_color: "#0b8f7c",
    lang: defaultLocale,
  }
}
