"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { Canvas3D } from "@/components/three/canvas-3d"
import { HardwareScene } from "@/components/scenes/hardware-scene"
import { HARDWARE_LAB_PARTS } from "@/data/lab-parts"
import { cn } from "@/lib/utils"

type HomeSceneCanvasProps = {
  /** Delay mount until near viewport (below-fold). */
  lazy?: boolean
  className?: string
  background?: string
  cameraPosition?: [number, number, number]
  exploded?: boolean
  onReady?: () => void
}

/**
 * Landing 3D scene — mounts only when visible (lazy) to keep LCP light.
 * App-wide spinner is driven by Canvas3D + parent lock.
 */
export function HomeSceneCanvas({
  lazy = false,
  className,
  background,
  cameraPosition = [5.8, 4.2, 5.6],
  exploded = true,
  onReady,
}: HomeSceneCanvasProps) {
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(!lazy)
  const { resolvedTheme } = useTheme()
  const themeBg = resolvedTheme === "dark" ? "#0c221e" : "#1a3d36"
  const sceneBg =
    background && !background.startsWith("var(") ? background : themeBg
  const solidBg = sceneBg.startsWith("var(") ? "#1a3d36" : sceneBg

  useEffect(() => {
    if (!lazy || ready) return
    const el = host.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setReady(true)
          io.disconnect()
        }
      },
      { rootMargin: "160px 0px", threshold: 0.01 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [lazy, ready])

  return (
    <div ref={host} className={cn("absolute inset-0", className)}>
      {ready && (
        <Canvas3D
          plain
          background={solidBg}
          className="!absolute inset-0 h-full w-full min-h-0"
          cameraPosition={cameraPosition}
          onReady={onReady}
        >
          <HardwareScene
            placedIds={HARDWARE_LAB_PARTS.map((p) => p.id)}
            exploded={exploded}
            onInfo={() => {}}
            onTaskProgress={() => {}}
          />
        </Canvas3D>
      )}
    </div>
  )
}
