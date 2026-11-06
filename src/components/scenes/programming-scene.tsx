"use client"

import { Hotspot } from "@/components/scenes/hotspot"
import { useLabFloorColor } from "@/components/scenes/hardware-models"
import { FloatTag, ToonBox } from "@/components/scenes/toon"

type ProgrammingSceneProps = {
  variable: number
  conditionOn: boolean
  loops: number
  running: boolean
  outputCount: number
  onInfo: (text: string) => void
}

export function ProgrammingScene({
  variable,
  conditionOn,
  loops,
  running,
  outputCount,
  onInfo,
}: ProgrammingSceneProps) {
  const blocks = [
    {
      id: "prog-var",
      label: `počet = ${variable}`,
      color: "#38bdf8",
      position: [-1.2, 1.1, 0] as [number, number, number],
      title: "Premenná",
      summary: "Premenná drží hodnotu, ktorú môžeš neskôr použiť alebo meniť.",
      facts: [
        `Teraz: počet = ${variable}`,
        "Meno premennej by malo hovoriť, čo znamená.",
        "Typ (číslo, text…) určuje, čo s ňou môžeš robiť.",
      ],
      tip: "V Lab zmeň hodnotu a znova spusti program.",
    },
    {
      id: "prog-if",
      label: conditionOn ? `ak počet > 0` : `ak počet > 0 (vyp)`,
      color: conditionOn ? "#f472b6" : "#94a3b8",
      position: [-1.2, 0.2, 0] as [number, number, number],
      title: "Podmienka (if)",
      summary: "Podmienka rozhodne, či sa ďalšie príkazy vykonajú.",
      facts: [
        conditionOn ? "Podmienka je zapnutá." : "Podmienka je vypnutá — telo sa nespustí.",
        "Porovnania: >, <, ===, !== …",
        "else = „inak urob toto“.",
      ],
      tip: "Vypni podmienku a sleduj, či výstup ostane prázdny.",
    },
    {
      id: "prog-loop",
      label: `opakuj ${loops}× „Ahoj“`,
      color: "#34d399",
      position: [-1.2, -0.7, 0] as [number, number, number],
      title: "Cyklus (loop)",
      summary: "Cyklus opakuje príkaz niekoľkokrát — bez kopírovania rovnakého riadku.",
      facts: [
        `Aktuálne opakovanie: ${loops}×`,
        "for / while = typické cykly.",
        "Pozor na nekonečné cykly — vždy maj koniec.",
      ],
      tip: "Spusti program a počítaj „Ahoj!“ na výstupe.",
    },
  ]
  const floor = useLabFloorColor()

  return (
    <group>
      <ToonBox args={[5.8, 0.1, 2.8]} position={[0, -1.35, 0]} color={floor} radius={0.04} />

      {blocks.map((b) => (
        <Hotspot
          key={b.id}
          tag={b.label}
          tagY={0.55}
          ringY={-0.45}
          ringScale={0.9}
          target={{
            id: b.id,
            position: b.position,
            offset: [2.2, 1.4, 2.2],
            title: b.title,
            summary: b.summary,
            facts: b.facts,
            tip: b.tip,
          }}
          onOpen={() => onInfo(b.summary)}
        >
          <ToonBox args={[2.6, 0.7, 0.45]} color={b.color} radius={0.1} />
        </Hotspot>
      ))}

      <Hotspot
        tag="Výstup"
        tagY={1.25}
        ringY={-1.15}
        ringScale={0.85}
        target={{
          id: "prog-out",
          position: [2, 0.2, 0],
          offset: [-2.0, 1.5, 2.2],
          title: "Výstup programu",
          summary:
            "Čo program „vypíše“ — tu Ahoj! podľa cyklu. Bez výstupu by si nevidel výsledok behu.",
          facts: [
            `Vypísané riadky: ${outputCount}`,
            running ? "Práve beží…" : "Nebeží — stlač Spustiť v Lab.",
            "console.log / print = typický výstup v kóde.",
          ],
          tip: "Porovnaj počet „Ahoj!“ s hodnotou cyklu.",
        }}
        onOpen={() =>
          onInfo(
            outputCount
              ? `Výstup: ${outputCount}× Ahoj!`
              : "Výstup je prázdny — spusti program."
          )
        }
      >
        <ToonBox args={[1.6, 2.2, 0.3]} color="#0f172a" radius={0.08} />
        {Array.from({ length: Math.min(outputCount, 5) }).map((_, i) => (
          <FloatTag
            key={i}
            position={[0, 0.45 - i * 0.35, 0.2]}
            text="Ahoj!"
            tone="metric"
          />
        ))}
        {running && (
          <FloatTag position={[0, -0.95, 0.2]} text="beží…" tone="light" />
        )}
      </Hotspot>
    </group>
  )
}
