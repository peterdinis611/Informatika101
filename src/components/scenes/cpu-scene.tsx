"use client"

import { ToonBox } from "@/components/scenes/toon"
import { CpuChip } from "@/components/scenes/hardware-models"
import { Hotspot } from "@/components/scenes/hotspot"
import { DataPacket } from "./shared"

export type CpuPhase = "fetch" | "decode" | "execute" | "idle"

type CpuSceneProps = {
  phase: CpuPhase
  registerA: number
  registerB: number
  instruction: string
  onInfo?: (text: string) => void
}

const STAGES = [
  {
    id: "fetch" as const,
    label: "FETCH",
    x: -1.7,
    color: "#38bdf8",
    title: "FETCH — načítanie",
    summary:
      "CPU si z pamäte (RAM) vezme ďalšiu inštrukciu. Program counter ukazuje, ktorú adresu čítať.",
    facts: [
      "Inštrukcia je číslo (binárne), nie text.",
      "Rýchlosť FETCH závisí od frekvencie CPU a rýchlosti RAM.",
      "Cache urýchľuje často používané inštrukcie.",
    ],
    tip: "Bez FETCH by CPU nevedelo, čo robiť ďalej.",
  },
  {
    id: "decode" as const,
    label: "DECODE",
    x: 0,
    color: "#f472b6",
    title: "DECODE — dekódovanie",
    summary:
      "Riadiaca jednotka preloží kód inštrukcie na konkrétne signály: čo sa má spočítať a odkiaľ brať dáta.",
    facts: [
      "Opcode hovorí typ operácie (ADD, MOV…).",
      "Operandy môžu byť registre alebo adresy v pamäti.",
      "Chybná inštrukcia = výnimka / pád programu.",
    ],
    tip: "DECODE je „prekladateľ“ medzi číslom a akciou.",
  },
  {
    id: "execute" as const,
    label: "EXECUTE",
    x: 1.7,
    color: "#34d399",
    title: "EXECUTE — vykonanie",
    summary:
      "ALU (aritmeticko-logická jednotka) urobí výpočet alebo zápis. Výsledok ide do registra alebo do RAM.",
    facts: [
      "ADD, SUB, AND, OR… bežia tu.",
      "Niektoré inštrukcie trvajú viac taktov.",
      "Po EXECUTE sa cyklus často vráti na FETCH.",
    ],
    tip: "Sleduj registre A a B — tam uvidíš výsledok.",
  },
]

export function CpuScene({
  phase,
  registerA,
  registerB,
  instruction,
  onInfo,
}: CpuSceneProps) {
  const path: [number, number, number][] = [
    [-1.7, 1.15, 0],
    [0, 1.15, 0],
    [1.7, 1.15, 0],
  ]

  return (
    <group>
      <ToonBox args={[5.6, 0.1, 2.6]} position={[0, -0.85, 0]} color="#166534" radius={0.04} />

      <Hotspot
        tag="CPU čip"
        tagY={0.55}
        ringY={-0.35}
        target={{
          id: "cpu-chip",
          position: [0, -0.35, 0.35],
          offset: [2.4, 1.8, 2.6],
          title: "Procesor (CPU)",
          summary:
            "Mozog počítača. Opakuje cyklus FETCH → DECODE → EXECUTE milióny krát za sekundu.",
          facts: [
            "Jadrá = viac „mozgov“ naraz.",
            "GHz = koľko taktov za sekundu (hrubo).",
            "Registre sú najrýchlejšia pamäť priamo v CPU.",
          ],
          tip: "Klikni na FETCH / DECODE / EXECUTE a zoomni na každú fázu.",
        }}
        onOpen={() => onInfo?.("CPU · cyklus inštrukcií. Klikni na fázy vyššie.")}
      >
        <CpuChip scale={1.15} />
      </Hotspot>

      {STAGES.map((s) => (
        <Hotspot
          key={s.id}
          tag={s.label}
          tagY={0.55}
          ringY={-0.4}
          ringScale={0.85}
          target={{
            id: `cpu-${s.id}`,
            position: [s.x, 0.55, 0],
            offset: [1.6, 1.3, 2.0],
            title: s.title,
            summary: s.summary,
            facts: s.facts,
            tip: s.tip,
          }}
          onOpen={() => onInfo?.(s.title)}
        >
          <ToonBox
            args={[1.35, 0.55, 0.7]}
            color={s.color}
            selected={phase === s.id}
            radius={0.08}
          />
        </Hotspot>
      ))}

      <Hotspot
        tag={`A = ${registerA}`}
        tagY={0.45}
        ringY={-0.35}
        ringScale={0.7}
        beacon={false}
        target={{
          id: "cpu-reg-a",
          position: [-1.7, -0.55, -0.55],
          offset: [1.5, 1.2, 1.8],
          title: "Register A",
          summary: "Dočasná schránka v CPU. Hodnota tu je okamžite dostupná pre ALU.",
          facts: [
            `Aktuálna hodnota: ${registerA}`,
            "Registre sú rýchlejšie než RAM.",
            "Počet registrov závisí od architektúry.",
          ],
          tip: "Spusti cyklus v Lab paneli a sleduj, ako sa A mení.",
        }}
        onOpen={() => onInfo?.(`Register A = ${registerA}`)}
      >
        <ToonBox args={[1.2, 0.38, 0.45]} color="#fbbf24" radius={0.06} />
      </Hotspot>

      <Hotspot
        tag={`B = ${registerB}`}
        tagY={0.45}
        ringY={-0.35}
        ringScale={0.7}
        beacon={false}
        target={{
          id: "cpu-reg-b",
          position: [0, -0.55, -0.55],
          offset: [1.5, 1.2, 1.8],
          title: "Register B",
          summary: "Druhý pracovný register — často druhý operand výpočtu.",
          facts: [
            `Aktuálna hodnota: ${registerB}`,
            "CPU môže mať desiatky registrov (R0, R1…).",
            "Presun register↔RAM = load/store.",
          ],
          tip: "Porovnaj A a B po EXECUTE.",
        }}
        onOpen={() => onInfo?.(`Register B = ${registerB}`)}
      >
        <ToonBox args={[1.2, 0.38, 0.45]} color="#c4b5fd" radius={0.06} />
      </Hotspot>

      <Hotspot
        tag={instruction || "Pripravený"}
        tagY={0.45}
        ringY={-0.35}
        ringScale={0.75}
        beacon={false}
        target={{
          id: "cpu-ir",
          position: [1.7, -0.55, -0.55],
          offset: [-1.5, 1.2, 1.8],
          title: "Inštrukčný register",
          summary: "Sem sa uloží práve spracúvaná inštrukcia po FETCH.",
          facts: [
            instruction ? `Teraz: ${instruction}` : "Žiadna aktívna inštrukcia.",
            "IR drží opcode + operandy počas DECODE/EXECUTE.",
          ],
          tip: "Spusti krok v Lab — uvidíš tu text inštrukcie.",
        }}
        onOpen={() => onInfo?.(instruction || "Žiadna inštrukcia")}
      >
        <ToonBox args={[1.55, 0.38, 0.45]} color="#0f172a" radius={0.06} />
      </Hotspot>

      <DataPacket path={path} active={phase !== "idle"} color="#f97316" speed={0.55} />
    </group>
  )
}
