"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Sparkles, Volume2 } from "lucide-react"
import type { Lesson } from "@/data/lessons"
import { getNextLesson, LESSONS } from "@/data/lessons"
import { lessonPath } from "@/lib/routes"
import { useProgressStore } from "@/lib/store"
import { Canvas3D } from "@/components/three/canvas-3d"
import { QuizPanel } from "@/components/quiz-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IntroScene, INTRO_PARTS } from "@/components/scenes/intro-scene"
import { HardwareScene } from "@/components/scenes/hardware-scene"
import { BitsScene } from "@/components/scenes/bits-scene"
import { CpuScene, type CpuPhase } from "@/components/scenes/cpu-scene"
import { MemoryScene } from "@/components/scenes/memory-scene"
import { OsScene } from "@/components/scenes/os-scene"
import { GatesScene, type GateType } from "@/components/scenes/gates-scene"
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
import { LessonSchematic } from "@/components/lab/lesson-schematic"
import { PartsBuilder } from "@/components/lab/parts-builder"
import {
  getLabParts,
  HARDWARE_LAB_PARTS,
  INTRO_LAB_PARTS,
} from "@/data/lab-parts"
import { cn } from "@/lib/utils"
import { useInspectStore } from "@/lib/inspect-store"

type LessonWorkspaceProps = {
  lesson: Lesson
}

const CPU_PROGRAM = [
  {
    text: "LOAD 5 → A",
    fetch: "Načítavam LOAD 5",
    decode: "Chápem: ulož 5 do A",
    execute: "A = 5",
    apply: (a: number, b: number) => ({ a: 5, b }),
  },
  {
    text: "ADD 3",
    fetch: "Načítavam ADD 3",
    decode: "Chápem: pripočítaj 3 k A",
    execute: "A = A + 3",
    apply: (a: number, b: number) => ({ a: a + 3, b }),
  },
  {
    text: "STORE A → B",
    fetch: "Načítavam STORE",
    decode: "Chápem: skopíruj A do B",
    execute: "B = A",
    apply: (a: number, b: number) => ({ a, b: a }),
  },
]

function caesar(text: string, shift: number) {
  return text
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0)
      if (code >= 65 && code <= 90)
        return String.fromCharCode(((code - 65 + shift) % 26) + 65)
      if (code >= 97 && code <= 122)
        return String.fromCharCode(((code - 97 + shift) % 26) + 97)
      return ch
    })
    .join("")
}

function passwordStrength(pw: string) {
  let s = 0
  if (pw.length >= 8) s += 25
  if (pw.length >= 12) s += 15
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 20
  if (/\d/.test(pw)) s += 20
  if (/[^A-Za-z0-9]/.test(pw)) s += 20
  return Math.min(100, s)
}

export function LessonWorkspace({ lesson }: LessonWorkspaceProps) {
  const completeTask = useProgressStore((s) => s.completeTask)
  const taskDone = useProgressStore((s) => s.taskDone[lesson.id])
  const completed = useProgressStore((s) =>
    s.completedLessons.includes(lesson.id)
  )
  const [info, setInfo] = useState(lesson.description)
  const [guideMsg, setGuideMsg] = useState(lesson.guideIntro)
  const [tab, setTab] = useState("lab")
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const labCatalog = getLabParts(lesson.id)
  const [placedIds, setPlacedIds] = useState<string[]>(() =>
    labCatalog ? labCatalog.map((p) => p.id) : []
  )
  const next = getNextLesson(lesson.id)

  useEffect(() => {
    setInfo(lesson.description)
    setGuideMsg(lesson.guideIntro)
    setTab("lab")
    setSelectedPart(null)
    const catalog = getLabParts(lesson.id)
    setPlacedIds(catalog ? catalog.map((p) => p.id) : [])
    setFilePlaced({})
    setSortValues([4, 1, 5, 2, 3])
    setSortHighlight(null)
    setOnlyOnes(false)
    setWebHtml(false)
    setWebCss(false)
    setWebJs(false)
    setAsked([])
    useInspectStore.getState().clear()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [lesson.id, lesson.description, lesson.guideIntro])

  function addPart(id: string) {
    setPlacedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  function removePart(id: string) {
    setPlacedIds((prev) => prev.filter((x) => x !== id))
    if (selectedPart === id) setSelectedPart(null)
  }

  function addAllParts() {
    if (!labCatalog) return
    setPlacedIds(labCatalog.map((p) => p.id))
  }

  function clearParts() {
    setPlacedIds([])
    setSelectedPart(null)
  }

  useEffect(() => {
    if (taskDone && !completed) setTab("quiz")
  }, [taskDone, completed])

  const [exploded, setExploded] = useState(false)
  const [bits, setBits] = useState([
    false,
    false,
    false,
    false,
    true,
    true,
    false,
    true,
  ])
  const [cpuStep, setCpuStep] = useState(0)
  const [cpuPhase, setCpuPhase] = useState<CpuPhase>("idle")
  const [regA, setRegA] = useState(0)
  const [regB, setRegB] = useState(0)
  const [cpuInstr, setCpuInstr] = useState("")
  const [ram, setRam] = useState<(string | null)[]>([null, null, null, null])
  const [disk, setDisk] = useState<(string | null)[]>([null, null, null, null])
  const [powered, setPowered] = useState(true)
  const [processes, setProcesses] = useState<string[]>([])
  const [gate, setGate] = useState<GateType>("AND")
  const [gateA, setGateA] = useState(false)
  const [gateB, setGateB] = useState(false)
  const [sending, setSending] = useState(false)
  const [netProgress, setNetProgress] = useState(0)
  const [variable, setVariable] = useState(3)
  const [condOn, setCondOn] = useState(true)
  const [loops, setLoops] = useState(3)
  const [running, setRunning] = useState(false)
  const [outputCount, setOutputCount] = useState(0)
  const [password, setPassword] = useState("")
  const [plain, setPlain] = useState("ahoj")
  const [phishingCaught, setPhishingCaught] = useState(false)
  const [filePlaced, setFilePlaced] = useState<Record<string, string>>({})
  const [sortValues, setSortValues] = useState([4, 1, 5, 2, 3])
  const [sortHighlight, setSortHighlight] = useState<[number, number] | null>(
    null
  )
  const [onlyOnes, setOnlyOnes] = useState(false)
  const [webHtml, setWebHtml] = useState(false)
  const [webCss, setWebCss] = useState(false)
  const [webJs, setWebJs] = useState(false)
  const [asked, setAsked] = useState<string[]>([])

  const strength = useMemo(() => passwordStrength(password), [password])
  const encrypted = useMemo(() => caesar(plain, 3), [plain])
  const bitValue = useMemo(
    () => bits.reduce((acc, b, i) => acc + (b ? 1 << (7 - i) : 0), 0),
    [bits]
  )

  function markTask() {
    completeTask(lesson.id)
    setGuideMsg("Úloha splnená! Teraz skús mini kvíz v paneli vpravo.")
  }

  useEffect(() => {
    if (!sending) return
    setNetProgress(0)
    const id = window.setInterval(() => {
      setNetProgress((p) => {
        if (p >= 1) {
          window.clearInterval(id)
          setSending(false)
          markTask()
          setInfo("Paket sa vrátil! DNS pomohol nájsť server podľa mena.")
          return 1
        }
        return p + 0.02
      })
    }, 40)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sending])

  function stepCpu() {
    const progIndex = Math.floor(cpuStep / 3)
    if (progIndex >= CPU_PROGRAM.length) {
      setCpuPhase("idle")
      setCpuInstr("Program hotový!")
      markTask()
      return
    }
    const phaseIndex = cpuStep % 3
    const instr = CPU_PROGRAM[progIndex]
    if (phaseIndex === 0) {
      setCpuPhase("fetch")
      setCpuInstr(instr.fetch)
    } else if (phaseIndex === 1) {
      setCpuPhase("decode")
      setCpuInstr(instr.decode)
    } else {
      setCpuPhase("execute")
      setCpuInstr(instr.execute)
      const nextRegs = instr.apply(regA, regB)
      setRegA(nextRegs.a)
      setRegB(nextRegs.b)
    }
    setCpuStep((s) => s + 1)
  }

  function runProgram() {
    if (!condOn || variable <= 0) {
      setOutputCount(0)
      setInfo("Podmienka neplatí — program nič nevypísal.")
      return
    }
    setRunning(true)
    setOutputCount(0)
    let i = 0
    const id = window.setInterval(() => {
      i++
      setOutputCount(i)
      if (i >= loops) {
        window.clearInterval(id)
        setRunning(false)
        markTask()
        setInfo(`Program vypísal „Ahoj!“ ${loops}-krát.`)
      }
    }, 400)
  }

  function speakGuide() {
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(guideMsg)
    u.lang = "sk-SK"
    u.rate = 0.95
    window.speechSynthesis.speak(u)
  }

  const schematicState = {
    bits,
    bitValue,
    exploded,
    gate,
    gateA,
    gateB,
    powered,
    processes,
    regA,
    regB,
    cpuPhase,
    strength,
    encrypted,
    sending,
    netProgress,
  }

  const introLegend =
    lesson.id === "what-is-a-computer" ? (
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Diely:
        </span>
        {INTRO_PARTS.map((part) => {
          const onTable = placedIds.includes(part.id)
          const active = selectedPart === part.id
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => {
                if (!onTable) {
                  addPart(part.id)
                  setInfo(`${part.text} (pridané na stôl)`)
                  return
                }
                setSelectedPart(part.id)
                setInfo(part.text)
                setTab("info")
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                if (onTable) removePart(part.id)
              }}
              title={
                onTable
                  ? "Klik = info · pravý klik = odobrať"
                  : "Klik = pridať na stôl"
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition",
                !onTable && "border-dashed opacity-70",
                active
                  ? "border-foreground bg-foreground text-background shadow-sm"
                  : "border-border bg-card text-card-foreground hover:border-foreground/40"
              )}
            >
              <span
                className="size-2.5 rounded-full ring-2 ring-card"
                style={{ backgroundColor: part.color }}
              />
              {part.label}
              {!onTable && <span className="text-[10px] opacity-70">+</span>}
            </button>
          )
        })}
      </div>
    ) : lesson.id === "hardware" ? (
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Diely:
        </span>
        {HARDWARE_LAB_PARTS.map((part) => {
          const onTable = placedIds.includes(part.id)
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => {
                if (onTable) removePart(part.id)
                else addPart(part.id)
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition",
                onTable
                  ? "border-border bg-card text-card-foreground"
                  : "border-dashed border-border bg-muted/40 text-muted-foreground"
              )}
              title={onTable ? "Klik = odobrať" : "Klik = pridať"}
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: part.color }}
              />
              {part.label}
            </button>
          )
        })}
      </div>
    ) : null

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col lg:flex-row">
      <section className="relative flex min-h-[52vh] min-w-0 flex-1 flex-col gap-3 p-3 sm:min-h-[460px] sm:p-5">
        <div className="reveal-up space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="h-6 px-2.5 font-heading font-semibold">
              {lesson.order} / {LESSONS.length}
            </Badge>
            {taskDone && (
              <Badge variant="secondary" className="h-6 gap-1">
                <Sparkles className="size-3" /> Úloha hotová
              </Badge>
            )}
            {completed && (
              <Badge variant="secondary" className="h-6 gap-1 bg-accent text-accent-foreground">
                <Check className="size-3" /> Splnené
              </Badge>
            )}
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {lesson.title}
          </h1>
          <Alert variant="primary">
            <Sparkles />
            <AlertTitle>Tvoja úloha</AlertTitle>
            <AlertDescription className="font-semibold text-foreground">
              {lesson.task}
            </AlertDescription>
          </Alert>
        </div>

        <div className="min-h-0 flex-1">
          <Canvas3D
            banner={
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-card-foreground/75 sm:text-sm">
                  {info}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => setTab("lab")}
                >
                  Ovládanie
                </Button>
              </div>
            }
            legend={introLegend}
          >
            {lesson.id === "what-is-a-computer" && (
              <IntroScene
                placedIds={placedIds}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
                onTaskProgress={markTask}
                onSelectPart={setSelectedPart}
              />
            )}
            {lesson.id === "hardware" && (
              <HardwareScene
                placedIds={placedIds}
                exploded={exploded}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
                onTaskProgress={markTask}
              />
            )}
            {lesson.id === "bits-and-bytes" && (
              <BitsScene
                bits={bits}
                onToggle={(i) => {
                  setBits((prev) => {
                    const next = [...prev]
                    next[i] = !next[i]
                    const val = next.reduce(
                      (acc, b, idx) => acc + (b ? 1 << (7 - idx) : 0),
                      0
                    )
                    if (val === 13) markTask()
                    return next
                  })
                }}
                onInfo={setInfo}
              />
            )}
            {lesson.id === "cpu" && (
              <CpuScene
                phase={cpuPhase}
                registerA={regA}
                registerB={regB}
                instruction={cpuInstr}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
            {lesson.id === "memory" && (
              <MemoryScene
                ramCells={powered ? ram : [null, null, null, null]}
                diskCells={disk}
                powered={powered}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
            {lesson.id === "operating-system" && (
              <OsScene
                processes={processes}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
            {lesson.id === "logic-gates" && (
              <GatesScene
                gate={gate}
                a={gateA}
                b={gateB}
                onToggleA={() => {
                  setGateA((v) => !v)
                  markTask()
                }}
                onToggleB={() => {
                  setGateB((v) => !v)
                  markTask()
                }}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
            {lesson.id === "networking" && (
              <NetworkScene
                sending={sending}
                progress={netProgress}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
            {lesson.id === "programming" && (
              <ProgrammingScene
                variable={variable}
                conditionOn={condOn}
                loops={loops}
                running={running}
                outputCount={outputCount}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
            {lesson.id === "security" && (
              <SecurityScene
                strength={strength}
                encrypted={encrypted}
                phishingCaught={phishingCaught}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
            {lesson.id === "files-and-folders" && (
              <FilesScene
                placed={filePlaced}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
            {lesson.id === "algorithms" && (
              <AlgorithmsScene
                values={sortValues}
                highlight={sortHighlight}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
            {lesson.id === "databases" && (
              <DatabasesScene
                onlyOnes={onlyOnes}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
            {lesson.id === "web-and-html" && (
              <WebScene
                html={webHtml}
                css={webCss}
                js={webJs}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
            {lesson.id === "ai-basics" && (
              <AiScene
                asked={asked}
                onInfo={(text) => {
                  setInfo(text)
                  setTab("info")
                }}
              />
            )}
          </Canvas3D>
        </div>
      </section>

      <aside className="flex max-h-[42vh] w-full shrink-0 flex-col border-t border-border bg-card/90 text-card-foreground backdrop-blur lg:max-h-none lg:w-[360px] lg:border-l lg:border-t-0 xl:w-[380px]">
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(String(value))}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="border-b border-lab-line px-3 pt-3">
            <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-muted p-1">
              <TabsTrigger value="lab" className="rounded-xl text-[11px] font-extrabold sm:text-xs">
                Lab
              </TabsTrigger>
              <TabsTrigger value="schema" className="rounded-xl text-[11px] font-extrabold sm:text-xs">
                Schéma
              </TabsTrigger>
              <TabsTrigger value="info" className="rounded-xl text-[11px] font-extrabold sm:text-xs">
                Info
              </TabsTrigger>
              <TabsTrigger value="quiz" className="relative rounded-xl text-[11px] font-extrabold sm:text-xs">
                Kvíz
                {taskDone && !completed && (
                  <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary" />
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <TabsContent value="schema" className="mt-0 space-y-4">
              <LessonSchematic lessonId={lesson.id} state={schematicState} />
              <div className="rounded-xl border border-dashed border-lab-line p-3">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Tip
                </p>
                <p className="text-xs text-muted-foreground">{lesson.taskHint}</p>
              </div>
            </TabsContent>

            <TabsContent value="lab" className="mt-0 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Ovládanie scény
              </p>
              <p className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm font-medium text-foreground">
                {lesson.task}
              </p>
              <p className="text-xs text-muted-foreground">{lesson.taskHint}</p>
              {labCatalog && (
                <PartsBuilder
                  catalog={labCatalog}
                  placed={placedIds}
                  onAdd={addPart}
                  onRemove={removePart}
                  onAddAll={addAllParts}
                  onClear={clearParts}
                  selectedId={selectedPart}
                  onSelect={(id) => {
                    setSelectedPart(id)
                    const part =
                      INTRO_LAB_PARTS.find((p) => p.id === id) ??
                      HARDWARE_LAB_PARTS.find((p) => p.id === id)
                    if (part) setInfo(part.hint)
                  }}
                />
              )}
              <LessonControls
                lessonId={lesson.id}
                exploded={exploded}
                setExploded={setExploded}
                bits={bits}
                setBits={setBits}
                stepCpu={stepCpu}
                resetCpu={() => {
                  setCpuStep(0)
                  setCpuPhase("idle")
                  setRegA(0)
                  setRegB(0)
                  setCpuInstr("")
                }}
                setRam={setRam}
                setDisk={setDisk}
                powered={powered}
                setPowered={setPowered}
                setProcesses={setProcesses}
                gate={gate}
                setGate={setGate}
                gateA={gateA}
                setGateA={setGateA}
                gateB={gateB}
                setGateB={setGateB}
                sending={sending}
                setSending={setSending}
                variable={variable}
                setVariable={setVariable}
                condOn={condOn}
                setCondOn={setCondOn}
                loops={loops}
                setLoops={setLoops}
                runProgram={runProgram}
                password={password}
                setPassword={setPassword}
                plain={plain}
                setPlain={setPlain}
                phishingCaught={phishingCaught}
                setPhishingCaught={setPhishingCaught}
                markTask={markTask}
                setInfo={setInfo}
                strength={strength}
                filePlaced={filePlaced}
                setFilePlaced={setFilePlaced}
                sortValues={sortValues}
                setSortValues={setSortValues}
                setSortHighlight={setSortHighlight}
                onlyOnes={onlyOnes}
                setOnlyOnes={setOnlyOnes}
                webHtml={webHtml}
                setWebHtml={setWebHtml}
                webCss={webCss}
                setWebCss={setWebCss}
                webJs={webJs}
                setWebJs={setWebJs}
                asked={asked}
                setAsked={setAsked}
              />
            </TabsContent>

            <TabsContent value="info" className="mt-0 space-y-4">
              <div className="rounded-2xl border border-lab-line bg-gradient-to-br from-sky-50 to-rose-50 p-3 dark:from-sky-950/40 dark:to-rose-950/30">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Sprievodca Byte
                  </p>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={speakGuide}
                    aria-label="Prečítať"
                  >
                    <Volume2 className="size-3.5" />
                  </Button>
                </div>
                <p className="text-sm leading-relaxed">{guideMsg}</p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Výber / meranie
                </p>
                <p className="rounded-xl border-2 border-border bg-background p-3 text-sm font-medium text-foreground shadow-sm">
                  {info}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{lesson.description}</p>
            </TabsContent>

            <TabsContent value="quiz" className="mt-0">
              {!taskDone && !completed && (
                <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
                  Najprv skús úlohu v 3D (tab Lab). Potom kvíz pôjde ľahšie.
                </p>
              )}
              <QuizPanel
                lesson={lesson}
                onPassed={() =>
                  setGuideMsg(
                    next
                      ? `Gratulujem! Odomkla sa lekcia „${next.title}“.`
                      : "Hotovo! Prešiel/a si všetky lekcie."
                  )
                }
              />
              {completed && next && (
                <Button
                  className="mt-4 w-full"
                  nativeButton={false}
                  render={<Link href={lessonPath(next)} />}
                >
                  Next lesson
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </aside>
    </div>
  )
}

type ControlsProps = {
  lessonId: string
  exploded: boolean
  setExploded: (v: boolean) => void
  bits: boolean[]
  setBits: (v: boolean[] | ((p: boolean[]) => boolean[])) => void
  stepCpu: () => void
  resetCpu: () => void
  setRam: (v: (string | null)[]) => void
  setDisk: (v: (string | null)[]) => void
  powered: boolean
  setPowered: (v: boolean) => void
  setProcesses: (v: string[] | ((p: string[]) => string[])) => void
  gate: GateType
  setGate: (g: GateType) => void
  gateA: boolean
  setGateA: (v: boolean | ((p: boolean) => boolean)) => void
  gateB: boolean
  setGateB: (v: boolean | ((p: boolean) => boolean)) => void
  sending: boolean
  setSending: (v: boolean) => void
  variable: number
  setVariable: (n: number) => void
  condOn: boolean
  setCondOn: (v: boolean) => void
  loops: number
  setLoops: (n: number) => void
  runProgram: () => void
  password: string
  setPassword: (s: string) => void
  plain: string
  setPlain: (s: string) => void
  phishingCaught: boolean
  setPhishingCaught: (v: boolean) => void
  markTask: () => void
  setInfo: (s: string) => void
  strength: number
  filePlaced: Record<string, string>
  setFilePlaced: (v: Record<string, string> | ((p: Record<string, string>) => Record<string, string>)) => void
  sortValues: number[]
  setSortValues: (v: number[] | ((p: number[]) => number[])) => void
  setSortHighlight: (v: [number, number] | null) => void
  onlyOnes: boolean
  setOnlyOnes: (v: boolean) => void
  webHtml: boolean
  setWebHtml: (v: boolean) => void
  webCss: boolean
  setWebCss: (v: boolean) => void
  webJs: boolean
  setWebJs: (v: boolean) => void
  asked: string[]
  setAsked: (v: string[] | ((p: string[]) => string[])) => void
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-lab-line bg-muted/50 px-3 py-2.5 dark:bg-muted/40">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition",
          checked ? "bg-lab-good" : "bg-[#cfc5b4]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition",
            checked && "translate-x-5"
          )}
        />
      </button>
    </label>
  )
}

function LessonControls(p: ControlsProps) {
  if (p.lessonId === "what-is-a-computer") {
    return (
      <p className="text-sm text-muted-foreground">
        Pridaj alebo odober diely vyššie. Keď sú všetky na stole, klikni na ne v
        3D a sleduj gulôčku dát.
      </p>
    )
  }

  if (p.lessonId === "hardware") {
    return (
      <div className="space-y-2">
        <ToggleRow
          label={p.exploded ? "Model rozložený" : "Model poskladaný"}
          checked={p.exploded}
          onChange={p.setExploded}
        />
        <p className="text-xs text-muted-foreground">
          Skladaj PC: pridávaj CPU, RAM, SSD… alebo ich odober zo stola.
        </p>
      </div>
    )
  }

  if (p.lessonId === "bits-and-bytes") {
    return (
      <div className="space-y-2">
        <Button
          className="w-full"
          variant="outline"
          onClick={() =>
            p.setBits([false, false, false, false, true, true, false, true])
          }
        >
          Nastav hodnotu 13
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            p.setBits([false, true, false, false, false, false, false, true])
            p.markTask()
            p.setInfo('ASCII 65 = písmeno „A“.')
          }}
        >
          Ukáž „A“ (65)
        </Button>
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => p.setBits(Array(8).fill(false))}
        >
          Vynulovať
        </Button>
      </div>
    )
  }

  if (p.lessonId === "cpu") {
    return (
      <div className="flex flex-col gap-2">
        <Button onClick={p.stepCpu}>Ďalší krok cyklu</Button>
        <Button variant="outline" onClick={p.resetCpu}>
          Reset registrov
        </Button>
      </div>
    )
  }

  if (p.lessonId === "memory") {
    return (
      <div className="space-y-2">
        <Button
          className="w-full"
          onClick={() => {
            if (!p.powered) {
              p.setInfo("Najprv zapni počítač.")
              return
            }
            p.setRam(["Ahoj", null, "42", null])
            p.setDisk(["úloha.docx", "foto.png", null, null])
            p.markTask()
            p.setInfo("Údaje sú v RAM aj na disku.")
          }}
        >
          Uložiť ukážkové dáta
        </Button>
        <ToggleRow
          label={p.powered ? "Počítač zapnutý" : "Počítač vypnutý"}
          checked={p.powered}
          onChange={(on) => {
            p.setPowered(on)
            p.setInfo(
              on
                ? "Zapnuté: RAM je znova pripravená."
                : "Vypnuté: RAM zmizla, disk ostal."
            )
            if (!on) p.markTask()
          }}
        />
      </div>
    )
  }

  if (p.lessonId === "operating-system") {
    const apps = ["Prehliadač", "Editor", "Hudba"]
    return (
      <div className="space-y-2">
        {apps.map((app) => (
          <Button
            key={app}
            className="w-full"
            variant="outline"
            onClick={() => {
              p.setProcesses((prev) => {
                if (prev.includes(app)) return prev
                const next = [...prev, app]
                if (next.length >= 2) p.markTask()
                return next
              })
              p.setInfo(`Spustený proces: ${app}`)
            }}
          >
            Spustiť {app}
          </Button>
        ))}
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => p.setProcesses([])}
        >
          Ukončiť všetko
        </Button>
      </div>
    )
  }

  if (p.lessonId === "logic-gates") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {(["AND", "OR", "NOT"] as GateType[]).map((g) => (
            <Button
              key={g}
              variant={p.gate === g ? "default" : "outline"}
              onClick={() => p.setGate(g)}
            >
              {g}
            </Button>
          ))}
        </div>
        <ToggleRow
          label="Vstup A"
          checked={p.gateA}
          onChange={(v) => {
            p.setGateA(v)
            p.markTask()
          }}
        />
        {p.gate !== "NOT" && (
          <ToggleRow
            label="Vstup B"
            checked={p.gateB}
            onChange={(v) => {
              p.setGateB(v)
              p.markTask()
            }}
          />
        )}
      </div>
    )
  }

  if (p.lessonId === "networking") {
    return (
      <Button
        className="w-full"
        disabled={p.sending}
        onClick={() => p.setSending(true)}
      >
        Odoslať paket
      </Button>
    )
  }

  if (p.lessonId === "programming") {
    return (
      <div className="space-y-3">
        <label className="block text-sm">
          Premenná počet
          <input
            type="number"
            min={0}
            max={5}
            value={p.variable}
            onChange={(e) => p.setVariable(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-lab-line bg-background px-3 py-2"
          />
        </label>
        <ToggleRow
          label="Podmienka zapnutá"
          checked={p.condOn}
          onChange={p.setCondOn}
        />
        <label className="block text-sm">
          Počet cyklov
          <input
            type="number"
            min={1}
            max={5}
            value={p.loops}
            onChange={(e) => p.setLoops(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-lab-line bg-background px-3 py-2"
          />
        </label>
        <Button className="w-full" onClick={p.runProgram}>
          Spustiť program
        </Button>
      </div>
    )
  }

  if (p.lessonId === "security") {
    return (
      <div className="space-y-3">
        <label className="block text-sm">
          Skús heslo
          <input
            type="text"
            value={p.password}
            onChange={(e) => {
              p.setPassword(e.target.value)
              if (passwordStrength(e.target.value) >= 70) p.markTask()
            }}
            className="mt-1 w-full rounded-lg border border-lab-line bg-background px-3 py-2"
            placeholder="Napr. Domcek#2026"
          />
          <span className="mt-1 block font-mono text-xs text-muted-foreground">
            Sila: {p.strength}%
          </span>
        </label>
        <Button
          className="w-full"
          variant={p.phishingCaught ? "secondary" : "outline"}
          onClick={() => {
            p.setPhishingCaught(true)
            p.setInfo(
              "Podozrivé: nátlak, cudzí odkaz, žiadosť o heslo. Neklikaj!"
            )
            p.markTask()
          }}
        >
          Odhaľ phishing správu
        </Button>
        <label className="block text-sm">
          Text na šifrovanie
          <input
            type="text"
            value={p.plain}
            onChange={(e) => p.setPlain(e.target.value)}
            className="mt-1 w-full rounded-lg border border-lab-line bg-background px-3 py-2"
          />
        </label>
      </div>
    )
  }

  if (p.lessonId === "files-and-folders") {
    const moves = [
      { file: "uloha", folder: "docs", label: "úloha.docx → Dokumenty" },
      { file: "foto", folder: "pics", label: "foto.png → Obrázky" },
      { file: "song", folder: "music", label: "song.mp3 → Hudba" },
    ]
    return (
      <div className="space-y-2">
        {moves.map((m) => (
          <Button
            key={m.file}
            className="w-full"
            variant={p.filePlaced[m.file] ? "secondary" : "outline"}
            onClick={() => {
              p.setFilePlaced((prev) => {
                const next = { ...prev, [m.file]: m.folder }
                if (Object.keys(next).length >= 3) p.markTask()
                return next
              })
              p.setInfo(`${m.label}. Cesta hovorí, kde súbor leží.`)
            }}
          >
            {m.label}
          </Button>
        ))}
      </div>
    )
  }

  if (p.lessonId === "algorithms") {
    return (
      <div className="space-y-2">
        <Button
          className="w-full"
          onClick={() => {
            const arr = [...p.sortValues]
            let swapped = false
            for (let i = 0; i < arr.length - 1; i++) {
              if (arr[i] > arr[i + 1]) {
                p.setSortHighlight([i, i + 1])
                ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
                swapped = true
                p.setSortValues(arr)
                p.setInfo(`Vymenili sme ${arr[i + 1]} a ${arr[i]}.`)
                break
              }
            }
            if (!swapped) {
              p.setSortHighlight(null)
              p.setInfo("Hotovo — pole je zoradené.")
              p.markTask()
            }
          }}
        >
          Ďalší krok triedenia
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            p.setSortValues([4, 1, 5, 2, 3])
            p.setSortHighlight(null)
          }}
        >
          Reset veží
        </Button>
      </div>
    )
  }

  if (p.lessonId === "databases") {
    return (
      <Button
        className="w-full"
        variant={p.onlyOnes ? "secondary" : "default"}
        onClick={() => {
          p.setOnlyOnes(true)
          p.markTask()
          p.setInfo("Dopyt nechal len riadky, kde známka = 1.")
        }}
      >
        Len jednotkári
      </Button>
    )
  }

  if (p.lessonId === "web-and-html") {
    const layers = [
      { key: "html" as const, on: p.webHtml, set: p.setWebHtml, label: "Zapnúť HTML" },
      { key: "css" as const, on: p.webCss, set: p.setWebCss, label: "Zapnúť CSS" },
      { key: "js" as const, on: p.webJs, set: p.setWebJs, label: "Zapnúť JavaScript" },
    ]
    return (
      <div className="space-y-2">
        {layers.map((l) => (
          <Button
            key={l.key}
            className="w-full"
            variant={l.on ? "secondary" : "outline"}
            onClick={() => {
              l.set(true)
              const html = l.key === "html" ? true : p.webHtml
              const css = l.key === "css" ? true : p.webCss
              const js = l.key === "js" ? true : p.webJs
              if (html && css && js) p.markTask()
              p.setInfo(`${l.label.replace("Zapnúť ", "")} je kostra, štýl alebo správanie stránky.`)
            }}
          >
            {l.label}
          </Button>
        ))}
      </div>
    )
  }

  if (p.lessonId === "ai-basics") {
    const qs = ["2+2?", "Hlavné mesto SK?", "Zajtrajšie počasie?"]
    return (
      <div className="space-y-2">
        {qs.map((q) => (
          <Button
            key={q}
            className="w-full"
            variant={p.asked.includes(q) ? "secondary" : "outline"}
            onClick={() => {
              p.setAsked((prev) => {
                const next = prev.includes(q) ? prev : [...prev, q]
                if (next.length >= 3) p.markTask()
                return next
              })
              p.setInfo(
                q.includes("počasie")
                  ? "Nízka istota — model háda. Over si fakt."
                  : "Vysoká istota — jednoduchý fakt."
              )
            }}
          >
            Opýtať: {q}
          </Button>
        ))}
      </div>
    )
  }

  return null
}
