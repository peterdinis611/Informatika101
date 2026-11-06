"use client"

import { useEffect, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MascotProps = {
  message: string
  className?: string
}

export function Mascot({ message, className }: MascotProps) {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window)
  }, [])

  function speak() {
    if (!supported) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(message)
    u.lang = "sk-SK"
    u.rate = 0.95
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }

  function stop() {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }

  return (
    <div
      className={cn(
        "mascot-panel relative flex gap-3 rounded-2xl border border-teal-200/80 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-teal-800 dark:bg-slate-900/90",
        className
      )}
    >
      <div
        className={cn(
          "flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 text-2xl shadow-inner",
          speaking && "animate-bounce"
        )}
        aria-hidden
      >
        🤖
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="font-heading text-sm font-semibold text-teal-800 dark:text-teal-300">
            Byte, sprievodca
          </p>
          {supported && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={speaking ? stop : speak}
              aria-label={speaking ? "Zastaviť hlas" : "Prečítať nahlas"}
            >
              {speaking ? (
                <VolumeX className="size-3.5" />
              ) : (
                <Volume2 className="size-3.5" />
              )}
            </Button>
          )}
        </div>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {message}
        </p>
      </div>
    </div>
  )
}
