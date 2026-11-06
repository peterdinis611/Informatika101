"use client"

import { FloatTag, ToonBox } from "@/components/scenes/toon"
import { InkCyl, useLabFloorColor } from "@/components/scenes/hardware-models"
import { Hotspot } from "@/components/scenes/hotspot"

export type GateType = "AND" | "OR" | "NOT"

type GatesSceneProps = {
  gate: GateType
  a: boolean
  b: boolean
  onToggleA: () => void
  onToggleB: () => void
  onInfo: (text: string) => void
}

function compute(gate: GateType, a: boolean, b: boolean) {
  if (gate === "AND") return a && b
  if (gate === "OR") return a || b
  return !a
}

const GATE_COPY: Record<
  GateType,
  { title: string; summary: string; facts: string[]; tip: string }
> = {
  AND: {
    title: "Hradlo AND",
    summary: "Výstup je 1 len keď sú oba vstupy A aj B zapnuté (1).",
    facts: [
      "Tabuľka: 00→0, 01→0, 10→0, 11→1.",
      "Používa sa pri „musia platiť všetky podmienky“.",
      "Z hradiel sa skladajú celé CPU.",
    ],
    tip: "Zapni A aj B — žiarovka musí zasvietiť.",
  },
  OR: {
    title: "Hradlo OR",
    summary: "Výstup je 1, ak je aspoň jeden vstup 1 (A alebo B alebo oba).",
    facts: [
      "Tabuľka: 00→0, 01→1, 10→1, 11→1.",
      "„Stačí jedna pravda“ — typické pre OR.",
      "NOR / XOR sú príbuzné varianty.",
    ],
    tip: "Skús zapnúť len A — výstup už bude 1.",
  },
  NOT: {
    title: "Hradlo NOT (invertor)",
    summary: "Otočí vstup: 0 → 1, 1 → 0. Má len jeden vstup (A).",
    facts: [
      "Najjednoduchšie hradlo — jeden tranzistorový pár.",
      "Bez NOT by nešlo robiť negáciu v logike.",
      "NAND = NOT + AND; často „univerzálne“ hradlo.",
    ],
    tip: "Prepni A a sleduj, ako sa výstup vždy otočí.",
  },
}

export function GatesScene({
  gate,
  a,
  b,
  onToggleA,
  onToggleB,
  onInfo,
}: GatesSceneProps) {
  const out = compute(gate, a, b)
  const copy = GATE_COPY[gate]
  const floor = useLabFloorColor("#f5e6c8", "#4a3a28")
  const stripe = useLabFloorColor("#d6c49a", "#3a2d20")

  return (
    <group>
      <ToonBox args={[6.4, 0.12, 2.8]} position={[0, -0.85, 0]} color={floor} radius={0.04} />
      {Array.from({ length: 8 }).map((_, i) => (
        <ToonBox
          key={i}
          args={[5.8, 0.02, 0.04]}
          position={[0, -0.78, -0.9 + i * 0.25]}
          color={stripe}
          radius={0.005}
        />
      ))}

      <Hotspot
        tag={`A = ${a ? 1 : 0}`}
        tagY={0.7}
        ringY={-0.35}
        ringScale={0.65}
        target={{
          id: "gate-a",
          position: [-2.15, 0.05, 0.35],
          offset: [1.8, 1.2, 1.9],
          title: "Vstup A",
          summary: "Binárny vstup hradla. Klikni znova na prepínač (alebo tu) a zmeň 0 ↔ 1.",
          facts: [
            `Teraz: ${a ? "1 (zapnuté)" : "0 (vypnuté)"}`,
            "Vstup = napätie / signál z predchádzajúceho hradla.",
          ],
          tip: "Po zmene A sleduj výstupnú žiarovku vpravo.",
        }}
        onOpen={() => {
          onToggleA()
          onInfo("Vstup A prepnutý — pozri detail hradla.")
        }}
      >
        <SwitchVisual on={a} label="A" />
      </Hotspot>

      {gate !== "NOT" && (
        <Hotspot
          tag={`B = ${b ? 1 : 0}`}
          tagY={0.7}
          ringY={-0.35}
          ringScale={0.65}
          target={{
            id: "gate-b",
            position: [-2.15, 0.05, -0.55],
            offset: [1.8, 1.2, 1.9],
            title: "Vstup B",
            summary: "Druhý vstup (AND/OR). NOT ho nepotrebuje.",
            facts: [
              `Teraz: ${b ? "1 (zapnuté)" : "0 (vypnuté)"}`,
              "Pri AND musí byť B=1 spolu s A.",
            ],
            tip: "Skús všetky kombinácie A/B a zapíš si tabuľku pravdy.",
          }}
          onOpen={() => {
            onToggleB()
            onInfo("Vstup B prepnutý.")
          }}
        >
          <SwitchVisual on={b} label="B" />
        </Hotspot>
      )}

      <Hotspot
        tag={`Hradlo ${gate}`}
        tagY={0.75}
        ringY={-0.55}
        target={{
          id: `gate-${gate}`,
          position: [0, 0.1, 0],
          offset: [2.0, 1.5, 2.2],
          title: copy.title,
          summary: copy.summary,
          facts: copy.facts,
          tip: copy.tip,
        }}
        onOpen={() => onInfo(copy.title)}
      >
        <ToonBox args={[1.55, 0.85, 1.15]} color="#f97316" radius={0.08} />
        <ToonBox args={[1.2, 0.12, 0.7]} position={[0, 0.48, 0]} color="#fdba74" radius={0.03} />
      </Hotspot>

      <Hotspot
        tag={out ? "1 svieti" : "0 zhasnuté"}
        tagY={0.95}
        ringY={-0.45}
        ringScale={0.7}
        target={{
          id: "gate-out",
          position: [2.2, 0.15, 0],
          offset: [-1.8, 1.3, 2.0],
          title: "Výstup",
          summary: "Žiarovka = výsledok hradla. 1 = svieti, 0 = tma.",
          facts: [
            `Aktuálny výstup: ${out ? "1" : "0"}`,
            "Výstup môže ísť ako vstup do ďalšieho hradla.",
            "Takto vznikajú celé obvody a procesory.",
          ],
          tip: "Zmeň vstupy a sleduj, kedy žiarovka zareaguje.",
        }}
        onOpen={() => onInfo(out ? "Výstup 1 — svieti." : "Výstup 0 — zhasnuté.")}
      >
        <InkCyl args={[0.08, 0.08, 0.35, 12]} position={[0, -0.15, 0]} color="#334155" />
        <mesh position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.42, 20, 20]} />
          <meshBasicMaterial color={out ? "#fde047" : "#475569"} />
        </mesh>
      </Hotspot>

      <ToonBox
        args={[1.15, 0.05, 0.05]}
        position={[-1.05, 0.12, 0.35]}
        color={a ? "#22c55e" : "#94a3b8"}
        radius={0.02}
      />
      {gate !== "NOT" && (
        <ToonBox
          args={[1.15, 0.05, 0.05]}
          position={[-1.05, 0.12, -0.55]}
          color={b ? "#22c55e" : "#94a3b8"}
          radius={0.02}
        />
      )}
      <ToonBox
        args={[1.05, 0.05, 0.05]}
        position={[1.05, 0.12, 0]}
        color={out ? "#eab308" : "#94a3b8"}
        radius={0.02}
      />
    </group>
  )
}

function SwitchVisual({ on, label }: { on: boolean; label: string }) {
  return (
    <group>
      <ToonBox args={[0.7, 0.18, 0.45]} color="#1e293b" radius={0.04} />
      <ToonBox
        args={[0.28, 0.42, 0.18]}
        position={[on ? 0.12 : -0.12, 0.28, 0]}
        color={on ? "#22c55e" : "#94a3b8"}
        radius={0.04}
        selected={on}
      />
      <FloatTag position={[0, 0.55, 0]} text={`${label}=${on ? 1 : 0}`} />
    </group>
  )
}
