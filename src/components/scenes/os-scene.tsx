"use client"

import { FloatTag, ToonBox } from "@/components/scenes/toon"
import { CpuChip, Motherboard, Monitor } from "@/components/scenes/hardware-models"
import { useInspect } from "@/components/three/inspect-context"

type OsSceneProps = {
  processes: string[]
  onInfo: (text: string) => void
}

export function OsScene({ processes, onInfo }: OsSceneProps) {
  const { focus, focused } = useInspect()

  return (
    <group>
      <group
        position={[0, -1.15, 0]}
        onClick={(e) => {
          e.stopPropagation()
          focus({
            id: "os-hw",
            position: [0, -1.0, 0],
            offset: [2.4, 1.8, 2.6],
            title: "Hardvér",
            summary:
              "Fyzické súčiastky: CPU, RAM, disk, sieťová karta. OS ich ovláda namiesto teba.",
            facts: [
              "Bez OS by každá appka musela sama riadiť CPU.",
              "Ovládače (drivers) prekladajú príkazy OS → hardvér.",
              "Monitor, klávesnica a disk sú zariadenia pod OS.",
            ],
            tip: "Vrstva vyššie = OS. Ešte vyššie = aplikácie.",
          })
          onInfo("Hardvér: CPU, RAM, disk, sieťová karta…")
        }}
      >
        <group scale={0.72}>
          <Motherboard selected={focused?.id === "os-hw"} />
        </group>
        <group position={[-0.25, 0.18, 0.1]} scale={0.7}>
          <CpuChip selected={focused?.id === "os-hw"} />
        </group>
        <FloatTag position={[0, 0.55, 0]} text="Hardvér" />
      </group>

      <group
        position={[0, 0.05, 0]}
        onClick={(e) => {
          e.stopPropagation()
          focus({
            id: "os-kernel",
            position: [0, 0.05, 0],
            offset: [2.6, 1.5, 2.8],
            title: "Operačný systém",
            summary:
              "Most medzi hardvérom a aplikáciami. Spúšťa procesy, delí pamäť a čas CPU.",
            facts: [
              "Príklady: Windows, macOS, Linux, Android.",
              "Plánovač rozhoduje, ktorá appka beží práve teraz.",
              "Súborový systém = ako OS ukladá súbory na disk.",
            ],
            tip: "Spusti procesy v Lab paneli — uvidia sa vo vrstve Aplikácie.",
          })
          onInfo("OS riadi hardvér a dáva aplikáciám bezpečné služby.")
        }}
      >
        <ToonBox
          args={[4.4, 0.55, 1.3]}
          color="#059669"
          radius={0.08}
          selected={focused?.id === "os-kernel"}
        />
        <FloatTag position={[0, 0.5, 0]} text="Operačný systém" />
      </group>

      <group position={[0, 1.15, 0]}>
        <ToonBox
          args={[4.4, 0.55, 1.3]}
          color="#0284c7"
          radius={0.08}
          selected={focused?.id === "os-apps"}
          onClick={(e) => {
            e.stopPropagation()
            focus({
              id: "os-apps",
              position: [0, 1.15, 0],
              offset: [2.4, 1.4, 2.6],
              title: "Aplikácie",
              summary:
                "Programy, ktoré používaš: prehliadač, hra, editor. Bežia „nad“ OS a žiadajú o zdroje.",
              facts: [
                "Každá appka = jeden alebo viac procesov.",
                "OS ich izoluje — jedna appka nemá zrútiť celý PC.",
                "Zatvorenie okna = koniec procesu.",
              ],
              tip: processes.length
                ? `Beží: ${processes.join(", ")}`
                : "V Lab paneli spusti aspoň jednu appku.",
            })
            onInfo("Aplikácie (prehliadač, hry, editor) bežia nad OS.")
          }}
        />
        <FloatTag position={[0, 0.5, 0]} text="Aplikácie" />
        {processes.map((name, i) => (
          <group
            key={name + i}
            position={[-1.35 + i * 1.35, 0.55, 0.35]}
            onClick={(e) => {
              e.stopPropagation()
              focus({
                id: `os-proc-${name}`,
                position: [-1.35 + i * 1.35, 1.7, 0.35],
                offset: [1.6, 1.2, 1.8],
                title: `Proces: ${name}`,
                summary: `Bežiaca aplikácia „${name}“. OS jej prideľuje čas CPU a pamäť.`,
                facts: [
                  "Proces má vlastný priestor v RAM.",
                  "Vlákna = čiastkové práce v rámci procesu.",
                  "Správca úloh ukazuje zoznam procesov.",
                ],
                tip: "Pridaj ďalšie procesy v Lab paneli a sleduj multitasking.",
              })
              onInfo(`Proces „${name}“ beží pod dohľadom OS.`)
            }}
          >
            <ToonBox
              args={[1.15, 0.42, 0.35]}
              color="#f59e0b"
              radius={0.06}
              selected={focused?.id === `os-proc-${name}`}
            />
            <FloatTag position={[0, 0.4, 0]} text={name} tone="metric" />
          </group>
        ))}
      </group>

      <group position={[2.7, 0.2, -0.2]} scale={0.55}>
        <Monitor />
      </group>
    </group>
  )
}
