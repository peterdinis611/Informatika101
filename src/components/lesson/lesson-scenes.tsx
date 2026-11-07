"use client"

import type { CpuPhase } from "@/components/scenes/cpu-scene"
import type { GateType } from "@/components/scenes/gates-scene"
import { IntroScene } from "@/components/scenes/intro-scene"
import { HardwareScene } from "@/components/scenes/hardware-scene"
import { BitsScene } from "@/components/scenes/bits-scene"
import { CpuScene } from "@/components/scenes/cpu-scene"
import { MemoryScene } from "@/components/scenes/memory-scene"
import { OsScene } from "@/components/scenes/os-scene"
import { GatesScene } from "@/components/scenes/gates-scene"
import { NetworkScene } from "@/components/scenes/network-scene"
import { ProgrammingScene } from "@/components/scenes/programming-scene"
import { SecurityScene } from "@/components/scenes/security-scene"
import {
  AiScene,
  AlgorithmsScene,
  DatabasesScene,
  FilesScene,
  WebScene,
} from "@/components/scenes/extra-scenes"
import { bitsToValue } from "@/lib/lesson-lab"

export type LessonSceneState = {
  lessonId: string
  placedIds: string[]
  selectedPart: string | null
  setSelectedPart: (id: string | null) => void
  exploded: boolean
  bits: boolean[]
  setBits: (v: boolean[] | ((p: boolean[]) => boolean[])) => void
  cpuPhase: CpuPhase
  regA: number
  regB: number
  cpuInstr: string
  ram: (string | null)[]
  disk: (string | null)[]
  powered: boolean
  processes: string[]
  gate: GateType
  gateA: boolean
  gateB: boolean
  onGateToggleA: () => void
  onGateToggleB: () => void
  sending: boolean
  netProgress: number
  variable: number
  condOn: boolean
  loops: number
  running: boolean
  outputCount: number
  strength: number
  encrypted: string
  phishingCaught: boolean
  filePlaced: Record<string, string>
  sortValues: number[]
  sortHighlight: [number, number] | null
  onlyOnes: boolean
  webHtml: boolean
  webCss: boolean
  webJs: boolean
  asked: string[]
  setInfo: (text: string) => void
  setTab: (tab: string) => void
  markTask: () => void
}

export function LessonScenes(s: LessonSceneState) {
  const openInfo = (text: string) => {
    s.setInfo(text)
    s.setTab("info")
  }

  switch (s.lessonId) {
    case "what-is-a-computer":
      return (
        <IntroScene
          placedIds={s.placedIds}
          onInfo={openInfo}
          onTaskProgress={s.markTask}
          onSelectPart={s.setSelectedPart}
        />
      )
    case "hardware":
      return (
        <HardwareScene
          placedIds={s.placedIds}
          exploded={s.exploded}
          onInfo={openInfo}
          onTaskProgress={s.markTask}
        />
      )
    case "bits-and-bytes":
      return (
        <BitsScene
          bits={s.bits}
          onToggle={(i) => {
            s.setBits((prev) => {
              const next = [...prev]
              next[i] = !next[i]
              if (bitsToValue(next) === 13) s.markTask()
              return next
            })
          }}
          onInfo={s.setInfo}
        />
      )
    case "cpu":
      return (
        <CpuScene
          phase={s.cpuPhase}
          registerA={s.regA}
          registerB={s.regB}
          instruction={s.cpuInstr}
          onInfo={openInfo}
        />
      )
    case "memory":
      return (
        <MemoryScene
          ramCells={s.powered ? s.ram : [null, null, null, null]}
          diskCells={s.disk}
          powered={s.powered}
          onInfo={openInfo}
        />
      )
    case "operating-system":
      return <OsScene processes={s.processes} onInfo={openInfo} />
    case "logic-gates":
      return (
        <GatesScene
          gate={s.gate}
          a={s.gateA}
          b={s.gateB}
          onToggleA={s.onGateToggleA}
          onToggleB={s.onGateToggleB}
          onInfo={openInfo}
        />
      )
    case "networking":
      return (
        <NetworkScene
          sending={s.sending}
          progress={s.netProgress}
          onInfo={openInfo}
        />
      )
    case "programming":
      return (
        <ProgrammingScene
          variable={s.variable}
          conditionOn={s.condOn}
          loops={s.loops}
          running={s.running}
          outputCount={s.outputCount}
          onInfo={openInfo}
        />
      )
    case "security":
      return (
        <SecurityScene
          strength={s.strength}
          encrypted={s.encrypted}
          phishingCaught={s.phishingCaught}
          onInfo={openInfo}
        />
      )
    case "files-and-folders":
      return <FilesScene placed={s.filePlaced} onInfo={openInfo} />
    case "algorithms":
      return (
        <AlgorithmsScene
          values={s.sortValues}
          highlight={s.sortHighlight}
          onInfo={openInfo}
        />
      )
    case "databases":
      return <DatabasesScene onlyOnes={s.onlyOnes} onInfo={openInfo} />
    case "web-and-html":
      return (
        <WebScene
          html={s.webHtml}
          css={s.webCss}
          js={s.webJs}
          onInfo={openInfo}
        />
      )
    case "ai-basics":
      return <AiScene asked={s.asked} onInfo={openInfo} />
    default:
      return null
  }
}
