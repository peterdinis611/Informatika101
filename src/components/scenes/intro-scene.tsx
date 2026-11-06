"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"
import { BusCable, FloatTag } from "@/components/scenes/toon"
import {
  CpuChip,
  Desk,
  KeyboardAndMouse,
  Monitor,
  RamStick,
  SsdDrive,
} from "@/components/scenes/hardware-models"
import { useInspect } from "@/components/three/inspect-context"

const PARTS = [
  {
    id: "vstup",
    label: "KLÁVESNICA",
    position: [-2.85, 0, 0.35] as [number, number, number],
    color: "#2563eb",
    metric: "USB",
    text: "Vstup: klávesnica a myš — údaje, ktoré počítaču dáš.",
  },
  {
    id: "spracovanie",
    label: "CPU",
    position: [-0.45, 0.08, -0.1] as [number, number, number],
    color: "#e11d48",
    metric: "3.2 GHz",
    text: "Spracovanie: procesor počíta a rozhoduje podľa programu.",
  },
  {
    id: "ulozenie",
    label: "SSD + RAM",
    position: [1.35, 0.05, 0.35] as [number, number, number],
    color: "#7c3aed",
    metric: "512 GB",
    text: "Uloženie: RAM (dočasne) alebo SSD disk (natrvalo).",
  },
  {
    id: "vystup",
    label: "MONITOR",
    position: [2.95, -0.08, -0.25] as [number, number, number],
    color: "#0d9488",
    metric: "1080p",
    text: "Výstup: monitor, reproduktory, tlačiareň — výsledok pre teba.",
  },
]

const CABLES = [
  {
    fromId: "vstup",
    toId: "spracovanie",
    from: [-1.9, 0.18, 0.25] as [number, number, number],
    to: [-0.95, 0.28, -0.05] as [number, number, number],
    color: "#2563eb",
    flowColor: "#fbbf24",
  },
  {
    fromId: "spracovanie",
    toId: "ulozenie",
    from: [0.15, 0.28, -0.05] as [number, number, number],
    to: [0.85, 0.22, 0.28] as [number, number, number],
    color: "#e11d48",
    flowColor: "#a3e635",
  },
  {
    fromId: "ulozenie",
    toId: "vystup",
    from: [1.95, 0.22, 0.25] as [number, number, number],
    to: [2.45, 0.55, -0.1] as [number, number, number],
    color: "#7c3aed",
    flowColor: "#38bdf8",
  },
]

type IntroSceneProps = {
  placedIds: string[]
  onInfo: (text: string) => void
  onTaskProgress?: () => void
  onSelectPart?: (id: string | null) => void
}

export function IntroScene({
  placedIds,
  onInfo,
  onTaskProgress,
  onSelectPart,
}: IntroSceneProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const visited = useRef(new Set<string>())
  const packet = useRef<Mesh>(null)
  const t = useRef(0)
  const { focus } = useInspect()

  const hasFlow =
    placedIds.includes("vstup") &&
    placedIds.includes("spracovanie") &&
    placedIds.includes("ulozenie") &&
    placedIds.includes("vystup")

  const waypoints: [number, number, number][] = [
    [-1.95, 0.45, 0.2],
    [-0.7, 0.5, 0],
    [0.85, 0.4, 0.22],
    [2.35, 0.85, -0.05],
  ]

  useFrame((_, dt) => {
    if (!packet.current || !hasFlow) return
    t.current = (t.current + dt * 0.35) % 1
    const total = waypoints.length - 1
    const f = t.current * total
    const i = Math.floor(f)
    const local = f - i
    const a = waypoints[i]
    const b = waypoints[Math.min(i + 1, waypoints.length - 1)]
    packet.current.position.set(
      a[0] + (b[0] - a[0]) * local,
      a[1] + (b[1] - a[1]) * local + Math.sin(t.current * Math.PI * 2) * 0.08,
      a[2] + (b[2] - a[2]) * local
    )
    packet.current.rotation.y += dt * 2.2
  })

  function select(id: string, text: string) {
    const part = PARTS.find((p) => p.id === id)
    setSelected(id)
    onSelectPart?.(id)
    onInfo(text)
    if (part) {
      focus({
        id: `intro-${id}`,
        title: part.label,
        summary: text,
        facts: [
          `Metrika: ${part.metric}`,
          "Klikni ďalší blok a sleduj tok dát gulôčkou.",
          "Všetky štyri diely = kompletný počítačový cyklus.",
        ],
        tip: "Pridaj / odober diely v paneli Lab.",
        position: [part.position[0], part.position[1] + 0.35, part.position[2]],
        offset: [2.0, 1.6, 2.4],
      })
    }
    visited.current.add(id)
    if (visited.current.size >= 4 && hasFlow) onTaskProgress?.()
  }

  return (
    <group position={[0, 0.05, 0]}>
      <Desk />

      {placedIds.includes("vstup") && (
        <group position={PARTS[0].position}>
          <KeyboardAndMouse
            selected={selected === "vstup"}
            onClick={(e) => {
              e.stopPropagation()
              select("vstup", PARTS[0].text)
            }}
          />
          <FloatTag position={[0, 0.85, 0]} text={PARTS[0].label} tone="accent" />
          <FloatTag position={[0, 1.2, 0]} text={PARTS[0].metric} tone="metric" />
        </group>
      )}

      {placedIds.includes("spracovanie") && (
        <group position={PARTS[1].position}>
          <CpuChip
            scale={1.35}
            selected={selected === "spracovanie"}
            onClick={(e) => {
              e.stopPropagation()
              select("spracovanie", PARTS[1].text)
            }}
          />
          <FloatTag position={[0, 0.85, 0]} text={PARTS[1].label} tone="accent" />
          <FloatTag position={[0, 1.2, 0]} text={PARTS[1].metric} tone="metric" />
        </group>
      )}

      {placedIds.includes("ulozenie") && (
        <group position={PARTS[2].position}>
          <SsdDrive
            selected={selected === "ulozenie"}
            onClick={(e) => {
              e.stopPropagation()
              select("ulozenie", PARTS[2].text)
            }}
          />
          <group position={[0.55, 0.38, -0.05]} rotation={[0, 0, -0.18]}>
            <RamStick
              selected={selected === "ulozenie"}
              onClick={(e) => {
                e.stopPropagation()
                select("ulozenie", PARTS[2].text)
              }}
            />
          </group>
          <FloatTag position={[0.15, 1.05, 0]} text={PARTS[2].label} tone="accent" />
          <FloatTag position={[0.15, 1.4, 0]} text={PARTS[2].metric} tone="metric" />
        </group>
      )}

      {placedIds.includes("vystup") && (
        <group position={PARTS[3].position}>
          <Monitor
            selected={selected === "vystup"}
            onClick={(e) => {
              e.stopPropagation()
              select("vystup", PARTS[3].text)
            }}
          />
          <FloatTag position={[0, 1.85, 0]} text={PARTS[3].label} tone="accent" />
          <FloatTag position={[0, 2.2, 0]} text={PARTS[3].metric} tone="metric" />
        </group>
      )}

      {CABLES.filter(
        (c) => placedIds.includes(c.fromId) && placedIds.includes(c.toId)
      ).map((c) => (
        <BusCable
          key={`${c.fromId}-${c.toId}`}
          from={c.from}
          to={c.to}
          color={c.color}
          flowColor={c.flowColor}
        />
      ))}

      {hasFlow && (
        <mesh ref={packet}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      )}
    </group>
  )
}

export const INTRO_PARTS = PARTS
