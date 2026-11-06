"use client"

import { useEffect, useRef, useState } from "react"

type Bit = {
  id: number
  left: number
  delay: number
  dur: number
  rot: number
  color: string
  label: string
  w: number
}

const COLORS = ["#e23d2a", "#0b8f7c", "#eab308", "#102033", "#2563eb", "#fff7f5"]
const LABELS = ["0", "1", "101", "bit"]

let uid = 0

function makeBits(count: number): Bit[] {
  return Array.from({ length: count }, () => ({
    id: uid++,
    left: Math.random() * 100,
    delay: Math.random() * 0.35,
    dur: 1.6 + Math.random() * 1.4,
    rot: Math.random() * 720 - 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#e23d2a",
    label: LABELS[Math.floor(Math.random() * LABELS.length)] ?? "1",
    w: 14 + Math.round(Math.random() * 16),
  }))
}

export function burstConfetti(count = 90) {
  window.dispatchEvent(new CustomEvent("lab-confetti", { detail: { count } }))
}

export function ConfettiLayer() {
  const [bits, setBits] = useState<Bit[]>([])
  const clear = useRef<number>(0)

  useEffect(() => {
    const onBurst = (e: Event) => {
      const count = (e as CustomEvent<{ count?: number }>).detail?.count ?? 90
      setBits(makeBits(count))
      window.clearTimeout(clear.current)
      clear.current = window.setTimeout(() => setBits([]), 3200)
    }
    window.addEventListener("lab-confetti", onBurst)
    return () => {
      window.removeEventListener("lab-confetti", onBurst)
      window.clearTimeout(clear.current)
    }
  }, [])

  return (
    <div
      aria-hidden
      data-confetti-root
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {bits.map((bit) => (
        <span
          key={bit.id}
          className="lab-confetti-bit"
          style={{
            left: `${bit.left}%`,
            width: bit.w,
            height: Math.round(bit.w * 0.7),
            background: bit.color,
            color: bit.color === "#102033" || bit.color === "#e23d2a" ? "#fff7f5" : "#102033",
            animationDuration: `${bit.dur}s`,
            animationDelay: `${bit.delay}s`,
            ["--spin" as string]: `${bit.rot}deg`,
          }}
        >
          {bit.label}
        </span>
      ))}
    </div>
  )
}

export function ConfettiOnView() {
  const sent = useRef(false)

  useEffect(() => {
    const el = document.getElementById("koniec")
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !sent.current) {
          sent.current = true
          window.setTimeout(() => burstConfetti(110), 120)
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return null
}
