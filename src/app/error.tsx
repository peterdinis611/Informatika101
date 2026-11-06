"use client"

import { ErrorScreen } from "@/components/lab/error-screen"

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorScreen
      code={500}
      title="Niečo sa pokazilo"
      detail="Lab mal výpadok. Skús to znova — tvoj postup v prehliadači ostáva."
      retry={reset}
    />
  )
}
