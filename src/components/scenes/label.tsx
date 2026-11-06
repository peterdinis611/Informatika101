"use client"

import { FloatTag } from "@/components/scenes/toon"

export function SceneLabel({
  position,
  children,
  tone = "light",
}: {
  position: [number, number, number]
  children: React.ReactNode
  className?: string
  tone?: "ink" | "light" | "metric"
}) {
  const text = Array.isArray(children)
    ? children.filter((c) => typeof c === "string" || typeof c === "number").join("")
    : typeof children === "string" || typeof children === "number"
      ? String(children)
      : ""
  if (!text.trim()) return null
  return (
    <FloatTag
      position={position}
      text={text.trim()}
      tone={tone === "ink" ? "dark" : tone === "metric" ? "metric" : "light"}
    />
  )
}
