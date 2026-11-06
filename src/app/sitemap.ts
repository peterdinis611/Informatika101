import type { MetadataRoute } from "next"
import { LESSONS } from "@/data/lessons"
import { SITE_URL } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...LESSONS.map((lesson) => ({
      url: `${SITE_URL}/lesson/${lesson.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
