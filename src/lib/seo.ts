import type { Metadata } from "next"
import { LESSONS } from "@/data/lessons"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const SITE_NAME = "Informatika 101"
export const SITE_TAGLINE = "Hravý 3D lab informatiky pre začiatočníkov"
export const SITE_DESCRIPTION = `Interaktívny 3D kurz informatiky po slovensky. ${LESSONS.length} voľných lekcií: hardvér, bity, CPU, súbory, algoritmy, databázy, web aj AI. Bez registrácie.`

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString()
}

const KEYWORDS = [
  "informatika",
  "informatika pre začiatočníkov",
  "3D lab",
  "virtuálny počítač",
  "počítač",
  "hardvér",
  "CPU",
  "bity a bajty",
  "operačný systém",
  "programovanie pre deti",
  "algoritmy",
  "databázy",
  "HTML",
  "CSS",
  "JavaScript",
  "siete",
  "kybernetická bezpečnosť",
  "umelá inteligencia",
  "súbory a priečinky",
  "slovensky",
  ...LESSONS.map((l) => l.shortTitle),
]

const HOME_TITLE = `${SITE_NAME} — Virtuálny počítač`
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
  type: "image/png",
} as const

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  formatDetection: { telephone: false, email: false, address: false },
  alternates: {
    canonical: "/",
    languages: { sk: "/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
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

/** Full homepage metadata — use from `app/page.tsx`. */
export function homePageMetadata(): Metadata {
  return {
    title: { absolute: HOME_TITLE },
    description: SITE_DESCRIPTION,
    keywords: KEYWORDS,
    alternates: {
      canonical: "/",
      languages: { sk: "/", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      locale: "sk_SK",
      url: absoluteUrl("/"),
      siteName: SITE_NAME,
      title: HOME_TITLE,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_TITLE,
      description: SITE_DESCRIPTION,
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
  }
}

export function lessonMetadata(id: string): Metadata {
  const lesson = LESSONS.find((l) => l.id === id)
  if (!lesson) {
    return { title: "Lekcia sa nenašla", robots: { index: false } }
  }
  const url = `/lesson/${lesson.id}`
  const title = `${lesson.title} (${lesson.order}/${LESSONS.length})`
  const description = `${lesson.description} Úloha: ${lesson.task}`
  return {
    title: lesson.title,
    description,
    keywords: [
      lesson.shortTitle,
      lesson.title,
      lesson.badge,
      "informatika",
      "3D lekcia",
      "zadarmo",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "sk_SK",
      url: absoluteUrl(url),
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: `/lesson/${lesson.id}/opengraph-image`,
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
      images: [`/lesson/${lesson.id}/opengraph-image`],
    },
  }
}

export function courseJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "sk",
    isAccessibleForFree: true,
    educationalLevel: "beginner",
    teaches: LESSONS.map((l) => l.shortTitle),
    url: SITE_URL,
    image: absoluteUrl("/opengraph-image"),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: "sk",
    },
    numberOfCredits: LESSONS.length,
    hasPart: LESSONS.map((lesson) => ({
      "@type": "LearningResource",
      name: lesson.title,
      description: lesson.description,
      url: absoluteUrl(`/lesson/${lesson.id}`),
      position: lesson.order,
      inLanguage: "sk",
      isAccessibleForFree: true,
      learningResourceType: "Lesson",
    })),
  }
}

/** Homepage WebSite + ItemList (Course JSON-LD lives in root layout). */
export function homeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "sk",
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${LESSONS.length} lekcií — ${SITE_NAME}`,
      numberOfItems: LESSONS.length,
      itemListElement: LESSONS.map((lesson) => ({
        "@type": "ListItem",
        position: lesson.order,
        name: lesson.title,
        url: absoluteUrl(`/lesson/${lesson.id}`),
        description: lesson.description,
      })),
    },
  ]
}

export function lessonJsonLd(id: string) {
  const lesson = LESSONS.find((l) => l.id === id)
  if (!lesson) return null
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.description,
    inLanguage: "sk",
    isAccessibleForFree: true,
    learningResourceType: "Lesson",
    educationalLevel: "beginner",
    position: lesson.order,
    url: absoluteUrl(`/lesson/${lesson.id}`),
    isPartOf: {
      "@type": "Course",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}
