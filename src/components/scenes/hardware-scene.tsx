"use client"

import { useMemo, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"
import { FloatTag, ToonBox } from "@/components/scenes/toon"
import {
  CpuChip,
  GpuCard,
  Motherboard,
  PcCase,
  PowerSupply,
  RamStick,
  SsdDrive,
  useLabFloorColor,
} from "@/components/scenes/hardware-models"
import { useInspect } from "@/components/three/inspect-context"

const PARTS = [
  {
    id: "case",
    label: "SKRINKA",
    assembled: [0, 0.35, -0.15] as [number, number, number],
    exploded: [0, 0.4, -2.6] as [number, number, number],
    text: "Skrinka chráni súčiastky a drží ich pohromade.",
    facts: [
      "Plech / plast chráni pred prachom a nárazmi.",
      "Ventilátory odvádzajú teplo von.",
      "Vnútri sú lišty na dosku, disk a zdroj.",
    ],
    tip: "Zapni „Rozložiť“ v Lab paneli, aby si videl diely oddelene.",
  },
  {
    id: "mb",
    label: "DOSCA",
    assembled: [0.05, -0.15, 0.05] as [number, number, number],
    exploded: [-2.7, 0.2, 0.2] as [number, number, number],
    text: "Základná doska spája všetky diely — ako mesto ciest.",
    facts: [
      "Sloty pre RAM, CPU pätica, PCIe pre GPU.",
      "Čipy riadia komunikáciu medzi dielmi.",
      "Konektory: USB, obraz, sieť, napájanie.",
    ],
    tip: "Bez dosky by CPU a RAM spolu nevedeli hovoriť.",
  },
  {
    id: "cpu",
    label: "CPU",
    assembled: [-0.32, 0.12, 0.2] as [number, number, number],
    exploded: [-1.5, 1.7, 0.7] as [number, number, number],
    text: "CPU je mozog — počíta a vykonáva príkazy.",
    facts: [
      "Miliardy tranzistorov = logické hradlá.",
      "Frekvencia (GHz) = koľko cyklov za sekundu.",
      "Jadrá = viac prác naraz (multitasking).",
    ],
    tip: "V lekcii CPU uvidíš cyklus FETCH → DECODE → EXECUTE.",
  },
  {
    id: "ram",
    label: "RAM",
    assembled: [0.42, 0.28, 0.12] as [number, number, number],
    exploded: [2.0, 1.5, 0.6] as [number, number, number],
    text: "RAM je rýchla dočasná pamäť. Po vypnutí zmizne.",
    facts: [
      "Drží otvorené programy a práve používané dáta.",
      "Rýchlejšia ako disk, ale drahšia na GB.",
      "Vypneš PC = obsah RAM zmizne.",
    ],
    tip: "Porovnaj s SSD: rýchlosť vs. trvalosť.",
  },
  {
    id: "disk",
    label: "SSD",
    assembled: [0.35, -0.85, 0.55] as [number, number, number],
    exploded: [2.6, -0.4, 0.8] as [number, number, number],
    text: "Disk / SSD ukladá súbory natrvalo.",
    facts: [
      "SSD = flash pamäť, bez pohyblivých častí.",
      "Tu leží OS, hry, fotky, dokumenty.",
      "Po vypnutí dáta ostanú.",
    ],
    tip: "V lekcii Pamäť skús skopírovať údaj z RAM na disk.",
  },
  {
    id: "psu",
    label: "ZDROJ",
    assembled: [0, -0.95, -0.45] as [number, number, number],
    exploded: [0, -2.05, 1.1] as [number, number, number],
    text: "Napájací zdroj dodáva elektrinu súčiastkam.",
    facts: [
      "Mená stredu zo zásuvky na 12 V / 5 V / 3.3 V.",
      "Wattage = koľko energie zvládne (CPU + GPU).",
      "Bez zdroja nič v PC nežiari.",
    ],
    tip: "Silnejšia GPU potrebuje silnejší zdroj.",
  },
  {
    id: "gpu",
    label: "GPU",
    assembled: [0.05, -0.42, -0.5] as [number, number, number],
    exploded: [0.2, 0.5, 2.3] as [number, number, number],
    text: "Grafická karta kreslí obraz — hry, video, 3D.",
    facts: [
      "Tisíce malých jadier na paralelné výpočty.",
      "Vlastná VRAM na textúry a snímky.",
      "Používa sa aj na AI a strih videa.",
    ],
    tip: "Monitor dostáva obraz práve cez GPU (alebo iGPU v CPU).",
  },
]

type HardwareSceneProps = {
  placedIds: string[]
  exploded: boolean
  onInfo: (text: string) => void
  onTaskProgress?: () => void
}

export function HardwareScene({
  placedIds,
  exploded,
  onInfo,
  onTaskProgress,
}: HardwareSceneProps) {
  const group = useRef<Group>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const visited = useRef(new Set<string>())
  const { focus } = useInspect()
  const visible = useMemo(
    () => PARTS.filter((p) => placedIds.includes(p.id)),
    [placedIds]
  )
  const targets = useMemo(
    () =>
      Object.fromEntries(
        visible.map((p) => [p.id, exploded ? p.exploded : p.assembled])
      ),
    [exploded, visible]
  )

  useFrame((_, dt) => {
    if (!group.current) return
    group.current.children.forEach((child) => {
      const t = targets[child.name]
      if (!t) return
      child.position.lerp(
        { x: t[0], y: t[1], z: t[2] } as never,
        1 - Math.pow(0.0008, dt)
      )
    })
  })

  function pick(id: string) {
    const part = PARTS.find((p) => p.id === id)
    if (!part) return
    const pos = exploded ? part.exploded : part.assembled
    setSelected(id)
    onInfo(part.text)
    focus({
      id: `hw-${id}`,
      title: part.label,
      summary: part.text,
      facts: part.facts,
      tip: part.tip,
      position: [pos[0], pos[1] + 0.15, pos[2]],
      offset: [2.2, 1.7, 2.6],
    })
    visited.current.add(id)
    if (visited.current.size >= Math.min(5, placedIds.length)) {
      onTaskProgress?.()
    }
  }

  const show = (id: string) => placedIds.includes(id)
  const floor = useLabFloorColor()

  return (
    <group ref={group} position={[0, 0.15, 0]}>
      <ToonBox
        args={[6.2, 0.08, 6.2]}
        position={[0, -1.55, 0]}
        color={floor}
        radius={0.04}
      />

      {show("case") && (
        <group name="case" position={PARTS[0].assembled} scale={0.92}>
          <PcCase
            selected={selected === "case"}
            onClick={(e) => {
              e.stopPropagation()
              pick("case")
            }}
          />
          {(selected === "case" || exploded) && (
            <FloatTag position={[0, 1.45, 1.1]} text="SKRINKA" tone="accent" />
          )}
        </group>
      )}

      {show("mb") && (
        <group name="mb" position={PARTS[1].assembled} scale={0.95}>
          <Motherboard
            selected={selected === "mb"}
            onClick={(e) => {
              e.stopPropagation()
              pick("mb")
            }}
          />
          {(selected === "mb" || exploded) && (
            <FloatTag position={[0, 0.55, 0]} text="DOSCA" tone="accent" />
          )}
        </group>
      )}

      {show("cpu") && (
        <group name="cpu" position={PARTS[2].assembled}>
          <CpuChip
            selected={selected === "cpu"}
            onClick={(e) => {
              e.stopPropagation()
              pick("cpu")
            }}
          />
          {(selected === "cpu" || exploded) && (
            <FloatTag position={[0, 0.45, 0]} text="CPU" tone="accent" />
          )}
        </group>
      )}

      {show("ram") && (
        <group name="ram" position={PARTS[3].assembled} scale={0.72}>
          <RamStick
            selected={selected === "ram"}
            onClick={(e) => {
              e.stopPropagation()
              pick("ram")
            }}
          />
          {(selected === "ram" || exploded) && (
            <FloatTag position={[0.3, 0.55, 0]} text="RAM" tone="accent" />
          )}
        </group>
      )}

      {show("disk") && (
        <group name="disk" position={PARTS[4].assembled} scale={0.85}>
          <SsdDrive
            selected={selected === "disk"}
            onClick={(e) => {
              e.stopPropagation()
              pick("disk")
            }}
          />
          {(selected === "disk" || exploded) && (
            <FloatTag position={[0, 0.4, 0]} text="SSD" tone="accent" />
          )}
        </group>
      )}

      {show("psu") && (
        <group name="psu" position={PARTS[5].assembled} scale={0.85}>
          <PowerSupply
            selected={selected === "psu"}
            onClick={(e) => {
              e.stopPropagation()
              pick("psu")
            }}
          />
          {(selected === "psu" || exploded) && (
            <FloatTag position={[0, 0.5, 0]} text="ZDROJ" tone="accent" />
          )}
        </group>
      )}

      {show("gpu") && (
        <group name="gpu" position={PARTS[6].assembled} scale={0.78}>
          <GpuCard
            selected={selected === "gpu"}
            onClick={(e) => {
              e.stopPropagation()
              pick("gpu")
            }}
          />
          {(selected === "gpu" || exploded) && (
            <FloatTag position={[0, 0.5, 0]} text="GPU" tone="accent" />
          )}
        </group>
      )}
    </group>
  )
}
