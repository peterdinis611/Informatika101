"use client"

import { useMemo, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import type { ThreeEvent } from "@react-three/fiber"
import * as THREE from "three"

export const INK = "#0b1f3a"

/**
 * Toy-lab block: bright flat color (meshBasic = always readable),
 * thin dark rim, hover/select scale.
 */
export function ToonBox({
  args = [1, 0.6, 1],
  position = [0, 0, 0],
  rotation,
  color,
  radius = 0.08,
  selected = false,
  onClick,
  emissiveIntensity = 0,
}: {
  args?: [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  color: string
  radius?: number
  selected?: boolean
  onClick?: (e: ThreeEvent<MouseEvent>) => void
  /** kept for API compat — brightens fill toward white when > 0 */
  emissiveIntensity?: number
}) {
  const [hovered, setHovered] = useState(false)
  const lit = selected || hovered
  const fill = useMemo(() => {
    if (emissiveIntensity <= 0 && !lit) return color
    const c = new THREE.Color(color)
    c.offsetHSL(0, 0, lit ? 0.08 : emissiveIntensity * 0.12)
    return `#${c.getHexString()}`
  }, [color, emissiveIntensity, lit])

  const rim: [number, number, number] = [
    args[0] + 0.07,
    args[1] + 0.07,
    args[2] + 0.07,
  ]

  return (
    <group position={position} rotation={rotation} scale={lit ? 1.05 : 1}>
      {/* inverted-hull outline — BackSide so it never covers the fill */}
      <RoundedBox args={rim} radius={radius + 0.02} smoothness={3}>
        <meshBasicMaterial color={INK} side={THREE.BackSide} />
      </RoundedBox>
      <RoundedBox
        args={args}
        radius={radius}
        smoothness={4}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = "auto"
        }}
      >
        <meshBasicMaterial color={fill} />
      </RoundedBox>
    </group>
  )
}

export function WoodBase({
  args = [1.4, 0.18, 1.1],
  position = [0, 0, 0],
}: {
  args?: [number, number, number]
  position?: [number, number, number]
}) {
  return (
    <ToonBox
      args={args}
      position={position}
      color="#e8c9a0"
      radius={0.05}
    />
  )
}

export function FloatTag({
  position,
  text,
  tone = "light",
}: {
  position: [number, number, number]
  text: string
  tone?: "light" | "metric" | "dark" | "accent"
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, 512, 128)
    ctx.font = "bold 42px ui-rounded, ui-sans-serif, system-ui, sans-serif"
    const pad = 24
    const w = Math.min(480, Math.max(128, ctx.measureText(text).width + pad * 2))
    const h = 72
    const x = (512 - w) / 2
    const y = (128 - h) / 2

    if (tone === "metric") {
      ctx.fillStyle = "#0b1f3a"
      roundRect(ctx, x, y, w, h, 18)
      ctx.fill()
      ctx.fillStyle = "#fde68a"
    } else if (tone === "dark") {
      ctx.fillStyle = "#0b1f3a"
      roundRect(ctx, x, y, w, h, 18)
      ctx.fill()
      ctx.fillStyle = "#ffffff"
    } else if (tone === "accent") {
      ctx.fillStyle = "#ff5a5f"
      roundRect(ctx, x, y, w, h, 18)
      ctx.fill()
      ctx.fillStyle = "#ffffff"
    } else {
      ctx.fillStyle = "#ffffff"
      roundRect(ctx, x, y, w, h, 18)
      ctx.fill()
      ctx.strokeStyle = "#0b1f3a"
      ctx.lineWidth = 6
      roundRect(ctx, x, y, w, h, 18)
      ctx.stroke()
      ctx.fillStyle = "#0b1f3a"
    }
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, 256, 66)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.needsUpdate = true
    return tex
  }, [text, tone])

  const width = Math.max(1.05, text.length * 0.105)
  return (
    <sprite position={position} scale={[width, width * 0.3, 1]}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  )
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function BusCable({
  from,
  to,
  color = "#0e7490",
  flowing = true,
  flowColor = "#fbbf24",
}: {
  from: [number, number, number]
  to: [number, number, number]
  color?: string
  flowing?: boolean
  flowColor?: string
}) {
  const { mid, len, quat } = useMemo(() => {
    const dx = to[0] - from[0]
    const dy = to[1] - from[1]
    const dz = to[2] - from[2]
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(dx, dy, dz).normalize()
    )
    return {
      mid: [
        (from[0] + to[0]) / 2,
        (from[1] + to[1]) / 2 + 0.08,
        (from[2] + to[2]) / 2,
      ] as [number, number, number],
      len: length,
      quat: q,
    }
  }, [from, to])

  const dash = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (!dash.current || !flowing) return
    const y = dash.current.position.y + dt * 1.35
    dash.current.position.y = ((y + len / 2) % len) - len / 2
  })

  return (
    <group position={mid} quaternion={quat}>
      <mesh>
        <cylinderGeometry args={[0.09, 0.09, len, 12]} />
        <meshBasicMaterial color={INK} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.065, 0.065, len, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {flowing && (
        <mesh ref={dash}>
          <boxGeometry args={[0.07, 0.38, 0.07]} />
          <meshBasicMaterial color={flowColor} />
        </mesh>
      )}
    </group>
  )
}

export function GlowOrb({
  position,
  color = "#fbbf24",
  size = 0.15,
}: {
  position: [number, number, number]
  color?: string
  size?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const s = 1 + Math.sin(clock.elapsedTime * 4.2) * 0.12
    ref.current.scale.setScalar(s)
  })
  return (
    <group position={position}>
      <mesh scale={[1.4, 1.4, 1.4]}>
        <sphereGeometry args={[size, 18, 18]} />
        <meshBasicMaterial color={INK} side={THREE.BackSide} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 18, 18]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}
