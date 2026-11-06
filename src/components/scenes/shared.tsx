"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { Mesh } from "three"
import { FloatTag, INK, ToonBox } from "@/components/scenes/toon"

export function FloatingLabel({
  children,
  position,
}: {
  children: string
  position: [number, number, number]
  color?: string
}) {
  return <FloatTag position={position} text={children} />
}

export function ClickBox({
  position,
  size = [1, 0.6, 1],
  color,
  label,
  selected,
  onSelect,
}: {
  position: [number, number, number]
  size?: [number, number, number]
  color: string
  label?: string
  selected?: boolean
  onSelect?: () => void
  emissive?: string
}) {
  return (
    <group position={position}>
      <ToonBox
        args={size}
        color={color}
        selected={selected}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.()
        }}
      />
      {label && (
        <FloatTag position={[0, size[1] / 2 + 0.38, 0]} text={label} />
      )}
    </group>
  )
}

export function DataPacket({
  path,
  speed = 0.35,
  color = "#fbbf24",
  active = true,
}: {
  path: [number, number, number][]
  speed?: number
  color?: string
  active?: boolean
}) {
  const ref = useRef<Mesh>(null)
  const outline = useRef<Mesh>(null)
  const t = useRef(0)

  useFrame((_, dt) => {
    if (!active || !ref.current || path.length < 2) return
    t.current = (t.current + dt * speed) % 1
    const total = path.length - 1
    const f = t.current * total
    const i = Math.floor(f)
    const local = f - i
    const a = path[i]
    const b = path[Math.min(i + 1, path.length - 1)]
    const x = a[0] + (b[0] - a[0]) * local
    const y =
      a[1] + (b[1] - a[1]) * local + Math.sin(t.current * Math.PI * 2) * 0.05
    const z = a[2] + (b[2] - a[2]) * local
    ref.current.position.set(x, y, z)
    outline.current?.position.set(x, y, z)
  })

  return (
    <group visible={active}>
      <mesh ref={outline} scale={1.35}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color={INK} side={THREE.BackSide} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}
