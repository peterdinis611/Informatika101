"use client"

import { ErrorScreen } from "@/components/lab/error-screen"
import "./globals.css"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="sk">
      <body className="min-h-dvh bg-[#f3f6f1] text-[#102033] antialiased">
        <ErrorScreen
          code={500}
          title="Kritická chyba"
          detail="Aplikácia spadla. Obnov stránku. Ak to ide, tvoje body ostávajú v prehliadači."
          retry={reset}
        />
      </body>
    </html>
  )
}
