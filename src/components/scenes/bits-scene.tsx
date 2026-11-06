"use client"

import { useMemo } from "react"
import { FloatTag, ToonBox } from "@/components/scenes/toon"
import { Hotspot } from "@/components/scenes/hotspot"
import { useInspect } from "@/components/three/inspect-context"

type BitsSceneProps = {
  bits: boolean[]
  onToggle: (index: number) => void
  onInfo: (text: string) => void
}

export function BitsScene({ bits, onToggle, onInfo }: BitsSceneProps) {
  const { focus } = useInspect()
  const value = useMemo(
    () => bits.reduce((acc, b, i) => acc + (b ? 1 << (7 - i) : 0), 0),
    [bits]
  )
  const ascii =
    value >= 32 && value < 127 ? String.fromCharCode(value) : "—"
  const binary = bits.map((b) => (b ? "1" : "0")).join("")

  return (
    <group>
      <ToonBox args={[6.4, 0.12, 1.6]} position={[0, -0.55, 0]} color="#166534" radius={0.04} />
      <ToonBox args={[6.1, 0.04, 0.08]} position={[0, -0.46, 0.55]} color="#eab308" radius={0.01} />
      {bits.map((on, i) => (
        <Hotspot
          key={i}
          tag={on ? "1" : "0"}
          tagY={0.72}
          ringY={-0.45}
          ringScale={0.45}
          beacon={!on}
          target={{
            id: `bit-${i}`,
            position: [(i - 3.5) * 0.72, 0, 0],
            offset: [1.2, 1.1, 1.6],
            title: `Bit ${7 - i}`,
            summary: `Tento bit má váhu ${1 << (7 - i)}. Zapnutý pridá túto hodnotu k celkovému číslu.`,
            facts: [
              `Stav: ${on ? "1" : "0"}`,
              `Váha (mocnina 2): ${1 << (7 - i)}`,
              "8 bitov = 1 bajt (0–255)",
            ],
            tip: "Klikni znova na bit (alebo prepínač), aby si ho otočil.",
          }}
          onOpen={() => {
            onToggle(i)
            onInfo(`Bit ${7 - i}: ${on ? "1 → 0" : "0 → 1"}. Váha ${1 << (7 - i)}.`)
          }}
        >
          <ToonBox args={[0.48, 0.18, 0.48]} position={[0, -0.28, 0]} color="#1e293b" radius={0.04} />
          <ToonBox
            args={[0.28, 0.55, 0.18]}
            position={[0, on ? 0.18 : -0.05, 0]}
            color={on ? "#22c55e" : "#94a3b8"}
            radius={0.04}
            selected={on}
          />
          <FloatTag position={[0, -0.85, 0]} text={String(1 << (7 - i))} tone="metric" />
        </Hotspot>
      ))}

      <Hotspot
        tag={`Hodnota ${value}`}
        tagY={0.35}
        ringY={-0.25}
        ringScale={0.7}
        target={{
          id: "bit-value",
          position: [-1.6, 1.35, 0],
          offset: [1.6, 0.8, 1.8],
          title: "Desiatková hodnota",
          summary:
            "Súčet váh zapnutých bitov. Bit vľavo (MSB) má váhu 128, vpravo (LSB) váhu 1.",
          facts: [
            `Binárne: ${binary}`,
            `Desiatkovo: ${value}`,
            "255 = všetkých 8 bitov zapnutých",
          ],
          tip: "Cieľ úlohy často býva konkrétne číslo — skús 13.",
        }}
        onOpen={() => onInfo(`Hodnota bajtu: ${value} (bin ${binary})`)}
      >
        <ToonBox args={[1.5, 0.4, 0.35]} color="#0f172a" radius={0.06} />
      </Hotspot>

      <mesh
        position={[1.6, 1.35, 0]}
        onClick={(e) => {
          e.stopPropagation()
          focus({
            id: "bit-ascii",
            position: [1.6, 1.35, 0],
            offset: [-1.6, 0.8, 1.8],
            title: "ASCII znak",
            summary:
              "Čísla 32–126 majú v tabuľke ASCII písmeno alebo symbol. Napr. 65 = „A“.",
            facts: [
              value >= 32 && value < 127
                ? `Teraz: ${value} = „${ascii}“`
                : `${value} nie je tlačiteľný ASCII znak`,
              "Text v počítači = postupnosť takýchto čísel",
            ],
            tip: "Nastav bity na 65 a uvidíš písmeno A.",
          })
          onInfo(`ASCII „${ascii}“ pre hodnotu ${value}`)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto"
        }}
      >
        <boxGeometry args={[1.6, 0.4, 0.35]} />
        <meshBasicMaterial color="#134e4a" />
      </mesh>
      <FloatTag position={[1.6, 1.7, 0]} text={`ASCII  "${ascii}"`} />
    </group>
  )
}
