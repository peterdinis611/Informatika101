"use client"

import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, ContactShadows } from "@react-three/drei"
import {
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { useTheme } from "next-themes"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { useSceneLoadingLock } from "@/components/lab/scene-loading"
import { cn } from "@/lib/utils"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { useInspect } from "@/components/three/inspect-context"
import { CameraFocus } from "@/components/three/camera-focus"
import { DetailPanel } from "@/components/three/detail-panel"

const LIGHT_SCENE_BG = "#eef6f2"
const DARK_SCENE_BG = "#102033"

/** Updates clear color in place — never remount the WebGL canvas. */
function SceneBackground({ color }: { color: string }) {
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)

  useLayoutEffect(() => {
    const next = new THREE.Color(color)
    scene.background = next
    gl.setClearColor(next, 1)
  }, [color, scene, gl])

  return null
}

/** Fires once after the first painted frame so overlays can hide the spinner. */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current || !onReady) return
    done.current = true
    // Defer past the current frame so the GPU buffer is actually on screen.
    requestAnimationFrame(() => onReady())
  })
  return null
}

type Canvas3DProps = {
  children: React.ReactNode
  cameraPosition?: [number, number, number]
  className?: string
  legend?: React.ReactNode
  banner?: React.ReactNode
  plain?: boolean
  background?: string
  onReady?: () => void
}

function CanvasChrome({
  children,
  cameraPosition,
  background,
  plain,
  onReady,
}: {
  children: React.ReactNode
  cameraPosition: [number, number, number]
  background: string
  plain: boolean
  onReady?: () => void
}) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { focused, clear } = useInspect()

  function reset() {
    if (focused) clear()
    controls.current?.reset()
  }

  function zoom(dir: 1 | -1) {
    const c = controls.current
    if (!c) return
    c.object.position.multiplyScalar(dir > 0 ? 0.88 : 1.12)
    c.update()
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        className="h-full w-full touch-none"
        camera={{ position: cameraPosition, fov: 36, near: 0.1, far: 80 }}
        dpr={plain ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: false }}
        shadows={!plain}
        onPointerMissed={() => {
          if (focused) clear()
        }}
      >
        <ReadySignal onReady={onReady} />
        <SceneBackground color={background} />
        <ambientLight intensity={1} />
        <directionalLight position={[6, 10, 6]} intensity={0.55} />
        {children}
        {!plain && (
          <ContactShadows
            position={[0, -0.78, 0]}
            opacity={0.2}
            scale={18}
            blur={2.8}
            color="#12263a"
          />
        )}
        <OrbitControls
          ref={controls}
          makeDefault
          enablePan={false}
          enableZoom={!plain}
          minDistance={focused ? 1.2 : 4}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 0.45, 0]}
        />
        {!plain && <CameraFocus />}
      </Canvas>
      {!plain && (
        <ChromeControls
          onZoom={zoom}
          onReset={reset}
          focused={Boolean(focused)}
          onClear={clear}
        />
      )}
      {!plain && <DetailPanel />}
    </div>
  )
}

function ChromeControls({
  onZoom,
  onReset,
  focused,
  onClear,
}: {
  onZoom: (dir: 1 | -1) => void
  onReset: () => void
  focused: boolean
  onClear: () => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)

  function toggleFullscreen() {
    const el = wrapRef.current?.closest("[data-canvas-shell]") as HTMLElement | null
    if (!el) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void el.requestFullscreen()
    }
  }

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex flex-col items-center gap-2 px-3"
    >
      <div className="pointer-events-auto flex items-center gap-0.5 rounded-2xl border-2 border-border bg-card px-1.5 py-1 text-card-foreground shadow-[3px_3px_0_rgba(18,38,58,0.12)] dark:shadow-[3px_3px_0_rgba(0,0,0,0.35)]">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onZoom(1)}
          aria-label="Priblížiť"
          className="text-foreground"
        >
          <ZoomIn className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onZoom(-1)}
          aria-label="Oddialiť"
          className="text-foreground"
        >
          <ZoomOut className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onReset}
          aria-label="Obnoviť pohľad"
          className="text-foreground"
        >
          <RotateCcw className="size-4" />
        </Button>
        {focused && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 px-2 text-[11px] font-extrabold text-foreground"
          >
            Prehľad
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleFullscreen}
          aria-label="Celá obrazovka"
          className="text-foreground"
        >
          <Maximize2 className="size-4" />
        </Button>
      </div>
      <p className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[11px] font-extrabold tracking-wide text-card-foreground shadow-md">
        {focused
          ? "Detail otvorený · klik mimo = späť"
          : "Klikni na diel = detail + zoom · ťahaj = toč"}
      </p>
    </div>
  )
}

export function Canvas3D({
  children,
  cameraPosition = [5.8, 4.6, 5.8],
  className,
  legend,
  banner,
  plain = false,
  background,
  onReady,
}: Canvas3DProps) {
  const { resolvedTheme } = useTheme()
  const sceneBg =
    background ??
    (resolvedTheme === "dark" ? DARK_SCENE_BG : LIGHT_SCENE_BG)
  const [painted, setPainted] = useState(false)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  // Fullscreen app spinner until the first WebGL frame is on screen.
  useSceneLoadingLock(!painted, "Načítavam 3D scénu…")

  const handleReady = useCallback(() => {
    setPainted(true)
    onReadyRef.current?.()
  }, [])

  return (
    <div
      data-canvas-shell
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden",
        plain ? "min-h-0" : "min-h-[440px]",
        !plain &&
          "viewport-chrome rounded-[1.75rem] border-[3px] border-border bg-muted dark:bg-[#102033]",
        className
      )}
    >
      {banner && (
        <div className="relative z-20 border-b border-border bg-card/95 px-3 py-2.5 text-card-foreground backdrop-blur">
          {banner}
        </div>
      )}

      <div className={cn("relative min-h-0 flex-1", plain && "h-full")}>
        <CanvasChrome
          cameraPosition={cameraPosition}
          background={sceneBg}
          plain={plain}
          onReady={handleReady}
        >
          {children}
        </CanvasChrome>
      </div>

      {legend && (
        <div className="relative z-20 border-t border-border bg-card/95 px-3 py-2.5 text-card-foreground backdrop-blur">
          {legend}
        </div>
      )}
    </div>
  )
}
