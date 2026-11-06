import type { Metadata, Viewport } from "next"
import { Sora, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google"
import { Providers } from "@/components/providers"
import { courseJsonLd, defaultMetadata } from "@/lib/seo"
import "./globals.css"

const display = Sora({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  preload: true,
})

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
})

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
})

export const metadata: Metadata = defaultMetadata

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8f0ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1619" },
  ],
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sk" suppressHydrationWarning className="h-full">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} flex min-h-full flex-col antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd()) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
