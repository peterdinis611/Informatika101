import type { MetadataRoute } from "next"
import { getLessons } from "@/data/lessons"
import { locales } from "@/i18n/config"
import { SITE_URL } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    })
    for (const lesson of getLessons(locale)) {
      entries.push({
        url: `${SITE_URL}/${locale}/lesson/${lesson.id}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      })
    }
  }

  return entries
}
