import type { Metadata } from "next"
import { getLessons } from "@/data/lessons"
import { getDictionary, t } from "@/i18n/get-dictionary"
import {
  defaultLocale,
  localeHtmlLang,
  localeOg,
  locales,
  type Locale,
} from "@/i18n/config"
import { homePath, lessonPath } from "@/lib/routes"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const SITE_NAME = "Informatika 101"

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString()
}

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  type: "image/png",
} as const

function languageAlternates(pathWithoutLocale: string) {
  const languages: Record<string, string> = { "x-default": `/sk${pathWithoutLocale === "/" ? "" : pathWithoutLocale}` }
  for (const locale of locales) {
    languages[locale] =
      pathWithoutLocale === "/"
        ? `/${locale}`
        : `/${locale}${pathWithoutLocale}`
  }
  return languages
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Virtuálny počítač`,
    template: `%s · ${SITE_NAME}`,
  },
  description: getDictionary(defaultLocale).brand.tagline,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  formatDetection: { telephone: false, email: false, address: false },
  alternates: {
    canonical: "/sk",
    languages: languageAlternates("/"),
  },
  openGraph: {
    type: "website",
    locale: localeOg.sk,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
}

export function homePageMetadata(locale: Locale = defaultLocale): Metadata {
  const dict = getDictionary(locale)
  const lessons = getLessons(locale)
  const title = `${dict.brand.name} — ${dict.landing.headline}`
  const description = t(dict.landing.lead, { count: lessons.length })
  const canonical = homePath(locale)

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      locale: localeOg[locale],
      url: absoluteUrl(canonical),
      siteName: dict.brand.name,
      title,
      description,
      images: [{ ...OG_IMAGE, alt: `${dict.brand.name} — ${dict.brand.tagline}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  }
}

export function lessonMetadata(
  id: string,
  locale: Locale = defaultLocale
): Metadata {
  const lessons = getLessons(locale)
  const lesson = lessons.find((l) => l.id === id)
  if (!lesson) {
    return { title: "Not found", robots: { index: false } }
  }
  const url = lessonPath(lesson, locale)
  const title = `${lesson.title} (${lesson.order}/${lessons.length})`
  const description = `${lesson.description} ${lesson.task}`
  return {
    title: lesson.title,
    description,
    keywords: [lesson.shortTitle, lesson.title, lesson.badge],
    alternates: {
      canonical: url,
      languages: languageAlternates(`/lesson/${lesson.id}`),
    },
    openGraph: {
      type: "article",
      locale: localeOg[locale],
      url: absoluteUrl(url),
      title,
      description,
      siteName: getDictionary(locale).brand.name,
      images: [
        {
          url: `/${locale}/lesson/${lesson.id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: lesson.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/${locale}/lesson/${lesson.id}/opengraph-image`],
    },
  }
}

export function courseJsonLd(locale: Locale = defaultLocale) {
  const dict = getDictionary(locale)
  const lessons = getLessons(locale)
  const lang = localeHtmlLang[locale]
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: dict.brand.name,
    description: dict.brand.tagline,
    inLanguage: lang,
    isAccessibleForFree: true,
    educationalLevel: "beginner",
    teaches: lessons.map((l) => l.shortTitle),
    url: absoluteUrl(homePath(locale)),
    image: absoluteUrl("/opengraph-image"),
    provider: {
      "@type": "Organization",
      name: dict.brand.name,
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: lang,
    },
    numberOfCredits: lessons.length,
    hasPart: lessons.map((lesson) => ({
      "@type": "LearningResource",
      name: lesson.title,
      description: lesson.description,
      url: absoluteUrl(lessonPath(lesson, locale)),
      position: lesson.order,
      inLanguage: lang,
      isAccessibleForFree: true,
      learningResourceType: "Lesson",
    })),
  }
}

export function homeJsonLd(locale: Locale = defaultLocale) {
  const dict = getDictionary(locale)
  const lessons = getLessons(locale)
  const lang = localeHtmlLang[locale]
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: dict.brand.name,
      url: absoluteUrl(homePath(locale)),
      description: dict.brand.tagline,
      inLanguage: lang,
      publisher: {
        "@type": "Organization",
        name: dict.brand.name,
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${lessons.length} — ${dict.brand.name}`,
      numberOfItems: lessons.length,
      itemListElement: lessons.map((lesson) => ({
        "@type": "ListItem",
        position: lesson.order,
        name: lesson.title,
        url: absoluteUrl(lessonPath(lesson, locale)),
        description: lesson.description,
      })),
    },
  ]
}

export function lessonJsonLd(id: string, locale: Locale = defaultLocale) {
  const lessons = getLessons(locale)
  const lesson = lessons.find((l) => l.id === id)
  if (!lesson) return null
  const dict = getDictionary(locale)
  const lang = localeHtmlLang[locale]
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.description,
    inLanguage: lang,
    isAccessibleForFree: true,
    learningResourceType: "Lesson",
    educationalLevel: "beginner",
    position: lesson.order,
    url: absoluteUrl(lessonPath(lesson, locale)),
    isPartOf: {
      "@type": "Course",
      name: dict.brand.name,
      url: absoluteUrl(homePath(locale)),
    },
  }
}

/** Legacy constant for older callers */
export const SITE_TAGLINE = getDictionary(defaultLocale).brand.tagline
export const SITE_DESCRIPTION = t(getDictionary(defaultLocale).landing.lead, {
  count: getLessons(defaultLocale).length,
})
