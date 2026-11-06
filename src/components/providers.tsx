"use client"

import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ConfettiLayer } from "@/components/lab/confetti"
import { SceneLoadingProvider } from "@/components/lab/scene-loading"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="info101-theme"
    >
      <SceneLoadingProvider>
        <TooltipProvider delay={200}>
          {children}
          <ConfettiLayer />
        </TooltipProvider>
      </SceneLoadingProvider>
    </ThemeProvider>
  )
}
