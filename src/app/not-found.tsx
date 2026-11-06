import type { Metadata } from "next"
import { LabShell } from "@/components/lab/lab-shell"
import { ErrorScreen } from "@/components/lab/error-screen"

export const metadata: Metadata = {
  title: "Stránka sa nenašla",
  description: "Táto cesta v Informatike 101 neexistuje. Vyber si jednu z 15 voľných lekcií.",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <LabShell>
      <ErrorScreen
        compact
        code={404}
        title="Táto stránka neexistuje"
        detail="Lekcia alebo odkaz sa nenašli. Vráť sa na úvod a vyber si z 15 voľných lekcií."
      />
    </LabShell>
  )
}
