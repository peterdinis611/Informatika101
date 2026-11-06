"use client"

import { FloatTag, ToonBox } from "@/components/scenes/toon"
import {
  RamStick,
  SsdDrive,
  useLabFloorColor,
} from "@/components/scenes/hardware-models"
import { useInspect } from "@/components/three/inspect-context"

type MemorySceneProps = {
  ramCells: (string | null)[]
  diskCells: (string | null)[]
  powered: boolean
  onInfo: (text: string) => void
}

export function MemoryScene({
  ramCells,
  diskCells,
  powered,
  onInfo,
}: MemorySceneProps) {
  const { focus, focused } = useInspect()
  const floor = useLabFloorColor()

  return (
    <group>
      <ToonBox args={[7.2, 0.1, 3.2]} position={[0, -0.85, 0]} color={floor} radius={0.04} />

      <group
        position={[-2.1, 0.15, 0]}
        onClick={(e) => {
          e.stopPropagation()
          focus({
            id: "mem-ram",
            position: [-2.1, 0.35, 0],
            offset: [2.4, 1.6, 2.4],
            title: "RAM",
            summary:
              "Rýchla dočasná pamäť. Drží to, s čím práve pracuješ. Po vypnutí je prázdna.",
            facts: [
              "Bunky nižšie = konkrétne adresy v RAM.",
              "Modrá = bunka má údaj, sivá = prázdna.",
              "Bez napájania (vypnutý PC) sú všetky bunky prázdne.",
            ],
            tip: "Skopíruj údaj na SSD — uvidíš, čo ostane po vypnutí.",
          })
          onInfo("RAM — dočasná pamäť. Klikni aj na jednotlivé bunky.")
        }}
      >
        <group scale={0.85} position={[-1.15, 0.1, 0.2]}>
          <RamStick selected={focused?.id === "mem-ram"} />
        </group>
        <FloatTag position={[0, 1.15, 0]} text="RAM — dočasná" />
        {ramCells.map((cell, i) => (
          <group key={`r${i}`} position={[-0.35 + i * 0.55, 0.05, 0]}>
            <ToonBox
              args={[0.46, 0.52, 0.32]}
              color={powered && cell ? "#3b82f6" : "#cbd5e1"}
              radius={0.05}
              selected={Boolean(powered && cell) || focused?.id === `mem-ram-${i}`}
              onClick={(e) => {
                e.stopPropagation()
                const summary = powered
                  ? cell
                    ? `RAM bunka ${i}: „${cell}“ — po vypnutí zmizne.`
                    : `RAM bunka ${i} je prázdna.`
                  : "Počítač je vypnutý — RAM je prázdna!"
                focus({
                  id: `mem-ram-${i}`,
                  position: [-2.45 + i * 0.55, 0.2, 0],
                  offset: [1.8, 1.4, 1.9],
                  title: `RAM bunka ${i}`,
                  summary,
                  facts: [
                    "Adresa = číslo bunky (tu index 0–3).",
                    "CPU číta/píše RAM veľmi rýchlo.",
                    "OS rozhoduje, čo do ktorej bunky dá.",
                  ],
                  tip: powered
                    ? "V Lab paneli vlož text do RAM a pozri farbu bunky."
                    : "Najprv zapni PC v ovládaní.",
                })
                onInfo(summary)
              }}
            />
            <FloatTag
              position={[0, 0.5, 0]}
              text={powered ? cell ?? "·" : "—"}
              tone={powered && cell ? "metric" : "light"}
            />
          </group>
        ))}
      </group>

      <group
        position={[2.0, 0.1, 0]}
        onClick={(e) => {
          e.stopPropagation()
          focus({
            id: "mem-ssd",
            position: [2.0, 0.35, 0],
            offset: [-2.2, 1.6, 2.4],
            title: "SSD / disk",
            summary:
              "Trvalé úložisko. Súbory ostanú aj keď vypneš počítač.",
            facts: [
              "Pomalší ako RAM, ale lacnejší na veľké objemy.",
              "Tu je OS, dokumenty, hry.",
              "Fialová bunka = uložený údaj.",
            ],
            tip: "Vypni PC — SSD bunky ostanú, RAM nie.",
          })
          onInfo("SSD — trvalé uloženie. Klikni na bunku pre detail.")
        }}
      >
        <group scale={0.9} position={[0, 0.55, 0.35]}>
          <SsdDrive selected={focused?.id === "mem-ssd"} />
        </group>
        <FloatTag position={[0, 1.15, 0]} text="SSD — trvalý" />
        {diskCells.map((cell, i) => (
          <group key={`d${i}`} position={[-0.85 + i * 0.55, -0.15, 0]}>
            <ToonBox
              args={[0.46, 0.52, 0.32]}
              color={cell ? "#8b5cf6" : "#cbd5e1"}
              radius={0.05}
              selected={Boolean(cell) || focused?.id === `mem-ssd-${i}`}
              onClick={(e) => {
                e.stopPropagation()
                const summary = cell
                  ? `Disk bunka ${i}: „${cell}“ — ostane aj po vypnutí.`
                  : `Disk bunka ${i} je prázdna.`
                focus({
                  id: `mem-ssd-${i}`,
                  position: [1.15 + i * 0.55, -0.05, 0],
                  offset: [-1.8, 1.4, 1.9],
                  title: `SSD bunka ${i}`,
                  summary,
                  facts: [
                    "Súbor na disku má cestu (priečinky).",
                    "Načítanie do RAM = „otvorenie“ programu.",
                    "Zápis na disk = uloženie.",
                  ],
                  tip: "Ulož z RAM na disk v Lab paneli.",
                })
                onInfo(summary)
              }}
            />
            <FloatTag
              position={[0, 0.5, 0]}
              text={cell ?? "·"}
              tone={cell ? "metric" : "light"}
            />
          </group>
        ))}
      </group>
    </group>
  )
}
