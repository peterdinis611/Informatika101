import type { MetadataRoute } from "next"
import { LESSONS } from "@/data/lessons"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Info 101",
    description: `${SITE_TAGLINE}. ${LESSONS.length} voľných lekcií.`,
    start_url: "/",
    display: "standalone",
    background_color: "#e8f0ec",
    theme_color: "#0b8f7c",
    lang: "sk",
    categories: ["education", "kids"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
