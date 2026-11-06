"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group, Mesh, MeshBasicMaterial } from "three"
import type { ThreeEvent } from "@react-three/fiber"
import { useInspect, type InspectTarget } from "@/components/three/inspect-context"
import { FloatTag } from "@/components/scenes/toon"

type HotspotProps = {
  target: Omit<InspectTarget, "position"> & {
    position: [number, number, number]
  }
  /** Extra callback when opened (e.g. mark task / setInfo) */
  onOpen?: () => void
  children: React.ReactNode
  tag?: string
  tagY?: number
  /** Always show a soft “click me” beacon (default true) */
  beacon?: boolean
  ringY?: number
  ringScale?: number
}

/**
 * Wraps a 3D part: click focuses camera + opens detail panel.
 * Soft pulse beacon invites click; stronger ring when hovered / selected.
 */
export function Hotspot({
  target,
  onOpen,
  children,
  tag,
  tagY = 1.05,
  beacon = true,
  ringY = -0.55,
  ringScale = 1,
}: HotspotProps) {
  const { focus, focused } = useInspect()
  const [hovered, setHovered] = useState(false)
  const ring = useRef<Mesh>(null)
  const glow = useRef<Mesh>(null)
  const marker = useRef<Group>(null)
  const active = focused?.id === target.id

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const pulse = 1 + Math.sin(t * 3.2) * 0.08
    const soft = 1 + Math.sin(t * 2.1) * 0.12
    const showStrong = hovered || active

    if (ring.current) {
      ring.current.visible = showStrong || beacon
      const opacity = active ? 0.95 : hovered ? 0.8 : 0.35
      const mat = ring.current.material as MeshBasicMaterial
      mat.opacity = opacity
      mat.color.set(active ? "#e23d2a" : "#0b8f7c")
      ring.current.scale.setScalar((showStrong ? pulse : soft * 0.92) * ringScale)
    }

    if (glow.current) {
      glow.current.visible = beacon && !active
      const mat = glow.current.material as MeshBasicMaterial
      mat.opacity = 0.12 + Math.sin(t * 2.4) * 0.06
      glow.current.scale.setScalar(soft * 1.15 * ringScale)
    }

    if (marker.current) {
      marker.current.visible = beacon && !active
      marker.current.position.y = tagY + 0.15 + Math.sin(t * 2.6) * 0.08
      marker.current.rotation.y = t * 0.9
    }
  })

  function open(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    focus(target)
    onOpen?.()
  }

  return (
    <group
      position={target.position}
      onClick={open}
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
      <group scale={active ? 1.06 : hovered ? 1.03 : 1}>{children}</group>

      <mesh ref={glow} rotation={[-Math.PI / 2, 0, 0]} position={[0, ringY, 0]} visible={false}>
        <circleGeometry args={[0.78, 32]} />
        <meshBasicMaterial color="#0b8f7c" transparent opacity={0.15} depthWrite={false} />
      </mesh>

      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, ringY, 0]} visible={false}>
        <ringGeometry args={[0.55, 0.72, 32]} />
        <meshBasicMaterial color="#0b8f7c" transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* Floating “i” marker — invites exploration */}
      <group ref={marker} position={[0, tagY + 0.15, 0]} visible={beacon}>
        <mesh>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshBasicMaterial color="#102033" />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial color="#f4f7f5" />
        </mesh>
        <mesh position={[0, 0.018, 0.04]}>
          <boxGeometry args={[0.028, 0.055, 0.01]} />
          <meshBasicMaterial color="#102033" />
        </mesh>
        <mesh position={[0, -0.032, 0.04]}>
          <boxGeometry args={[0.028, 0.018, 0.01]} />
          <meshBasicMaterial color="#102033" />
        </mesh>
      </group>

      {tag && (active || hovered || beacon) && (
        <FloatTag
          position={[0, tagY, 0]}
          text={tag}
          tone={active ? "accent" : hovered ? "light" : "metric"}
        />
      )}
    </group>
  )
}
