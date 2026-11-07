"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Sparkles, Volume2 } from "lucide-react"
import type { Lesson } from "@/data/lessons"
import { getNextLesson, LESSONS } from "@/data/lessons"
import { CHECKPOINTS } from "@/data/checkpoints"
import { lessonPath } from "@/lib/routes"
import { useProgressStore } from "@/lib/store"
import { useA11yPrefs } from "@/lib/a11y"
import {
  CPU_PROGRAM,
  caesar,
  gatesAndTrue,
  gatesOrSingle,
  passwordStrength,
} from "@/lib/lesson-lab"
import { Canvas3D } from "@/components/three/canvas-3d"
import { QuizPanel } from "@/components/quiz-panel"
import { CheckpointPanel } from "@/components/checkpoint-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { INTRO_PARTS } from "@/components/scenes/intro-scene"
import type { CpuPhase } from "@/components/scenes/cpu-scene"
import type { GateType } from "@/components/scenes/gates-scene"
import { LessonSchematic } from "@/components/lab/lesson-schematic"
import { PartsBuilder } from "@/components/lab/parts-builder"
import {
  getLabParts,
  HARDWARE_LAB_PARTS,
  INTRO_LAB_PARTS,
} from "@/data/lab-parts"
import { cn } from "@/lib/utils"
import { useInspectStore } from "@/lib/inspect-store"
import { LessonControls } from "@/components/lesson/lesson-controls"
import { LessonScenes } from "@/components/lesson/lesson-scenes"
import { LowPowerView } from "@/components/lesson/low-power-view"
import { bitsToValue } from "@/lib/lesson-lab"
import { glossaryTermsForLesson } from "@/data/glossary"
import { openGlossaryTerm } from "@/lib/glossary-events"

type LessonWorkspaceProps = {
  lesson: Lesson
}

export function LessonWorkspace({ lesson }: LessonWorkspaceProps) {
  const completeTask = useProgressStore((s) => s.completeTask)
  const taskDone = useProgressStore((s) => s.taskDone[lesson.id])
  const checkpointDone = useProgressStore((s) => s.checkpoints[lesson.id])
  const completed = useProgressStore((s) =>
    s.completedLessons.includes(lesson.id)
  )
  const {
    prefs: a11yPrefs,
    lowPower,
    reduceMotion,
    update: updateA11y,
  } = useA11yPrefs()

  const [info, setInfo] = useState(lesson.description)
  const [guideMsg, setGuideMsg] = useState(lesson.guideIntro)
  const [tab, setTab] = useState("lab")
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const labCatalog = getLabParts(lesson.id)
  const [placedIds, setPlacedIds] = useState<string[]>(() =>
    labCatalog ? labCatalog.map((p) => p.id) : []
  )
  const next = getNextLesson(lesson.id)
  const checkpoint = CHECKPOINTS[lesson.id]
  const glossaryLinks = glossaryTermsForLesson(lesson.id)

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
  const [gateGoals, setGateGoals] = useState({
    andTrue: false,
    orSingle: false,
  })
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
  const [dbQuery, setDbQuery] = useState<string | null>(null)
  const [webHtml, setWebHtml] = useState(false)
  const [webCss, setWebCss] = useState(false)
  const [webJs, setWebJs] = useState(false)
  const [asked, setAsked] = useState<string[]>([])
  const [aiFlagged, setAiFlagged] = useState<string | null>(null)

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
    setDbQuery(null)
    setWebHtml(false)
    setWebCss(false)
    setWebJs(false)
    setAsked([])
    setAiFlagged(null)
    setGateGoals({ andTrue: false, orSingle: false })
    setPhishingCaught(false)
    setPassword("")
    useInspectStore.getState().clear()
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }, [lesson.id, lesson.description, lesson.guideIntro, reduceMotion])

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
    if (taskDone && checkpointDone && !completed) setTab("quiz")
  }, [taskDone, checkpointDone, completed])

  const strength = useMemo(() => passwordStrength(password), [password])
  const encrypted = useMemo(() => caesar(plain, 3), [plain])
  const bitValue = useMemo(() => bitsToValue(bits), [bits])

  function markTask() {
    completeTask(lesson.id)
    setGuideMsg(
      checkpointDone
        ? "Úloha splnená! Teraz skús mini kvíz v paneli vpravo."
        : "Úloha splnená! Ešte rýchla kontrola v paneli Úloha."
    )
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
        return p + (reduceMotion ? 0.08 : 0.02)
      })
    }, reduceMotion ? 80 : 40)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sending, reduceMotion])

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
    }, reduceMotion ? 120 : 400)
  }

  function speakGuide() {
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(guideMsg)
    u.lang = "sk-SK"
    u.rate = 0.95
    window.speechSynthesis.speak(u)
  }

  function syncGateGoals(nextGate: GateType, nextA: boolean, nextB: boolean) {
    setGateGoals((prev) => {
      const next = {
        andTrue: prev.andTrue || gatesAndTrue(nextGate, nextA, nextB),
        orSingle: prev.orSingle || gatesOrSingle(nextGate, nextA, nextB),
      }
      if (next.andTrue && next.orSingle) markTask()
      return next
    })
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
    filePlaced,
    sortValues,
    sortHighlight,
    onlyOnes,
    dbQuery,
    webHtml,
    webCss,
    webJs,
    asked,
    aiFlagged,
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
            {checkpointDone && (
              <Badge variant="secondary" className="h-6 gap-1">
                <Check className="size-3" /> Kontrola
              </Badge>
            )}
            {completed && (
              <Badge
                variant="secondary"
                className="h-6 gap-1 bg-accent text-accent-foreground"
              >
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
          {lowPower ? (
            <LowPowerView lesson={lesson} state={schematicState} />
          ) : (
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
              <LessonScenes
                lessonId={lesson.id}
                placedIds={placedIds}
                selectedPart={selectedPart}
                setSelectedPart={setSelectedPart}
                exploded={exploded}
                bits={bits}
                setBits={setBits}
                cpuPhase={cpuPhase}
                regA={regA}
                regB={regB}
                cpuInstr={cpuInstr}
                ram={ram}
                disk={disk}
                powered={powered}
                processes={processes}
                gate={gate}
                gateA={gateA}
                gateB={gateB}
                onGateToggleA={() => {
                  const next = !gateA
                  setGateA(next)
                  syncGateGoals(gate, next, gateB)
                }}
                onGateToggleB={() => {
                  const next = !gateB
                  setGateB(next)
                  syncGateGoals(gate, gateA, next)
                }}
                sending={sending}
                netProgress={netProgress}
                variable={variable}
                condOn={condOn}
                loops={loops}
                running={running}
                outputCount={outputCount}
                strength={strength}
                encrypted={encrypted}
                phishingCaught={phishingCaught}
                filePlaced={filePlaced}
                sortValues={sortValues}
                sortHighlight={sortHighlight}
                onlyOnes={onlyOnes}
                webHtml={webHtml}
                webCss={webCss}
                webJs={webJs}
                asked={asked}
                setInfo={setInfo}
                setTab={setTab}
                markTask={markTask}
              />
            </Canvas3D>
          )}
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
              <TabsTrigger
                value="lab"
                className="rounded-xl text-[11px] font-extrabold sm:text-xs"
              >
                Úloha
              </TabsTrigger>
              <TabsTrigger
                value="schema"
                className="rounded-xl text-[11px] font-extrabold sm:text-xs"
              >
                Schéma
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="rounded-xl text-[11px] font-extrabold sm:text-xs"
              >
                Info
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                className="relative rounded-xl text-[11px] font-extrabold sm:text-xs"
              >
                Kvíz
                {taskDone && checkpointDone && !completed && (
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
                gateGoals={gateGoals}
                setGateGoals={setGateGoals}
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
                dbQuery={dbQuery}
                setDbQuery={setDbQuery}
                webHtml={webHtml}
                setWebHtml={setWebHtml}
                webCss={webCss}
                setWebCss={setWebCss}
                webJs={webJs}
                setWebJs={setWebJs}
                asked={asked}
                setAsked={setAsked}
                aiFlagged={aiFlagged}
                setAiFlagged={setAiFlagged}
              />
              {checkpoint && (
                <CheckpointPanel
                  lessonId={lesson.id}
                  checkpoint={checkpoint}
                />
              )}
              <div className="space-y-2 rounded-xl border border-lab-line p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Prístupnosť
                </p>
                <label className="flex items-center justify-between gap-2 text-xs">
                  <span>Ľahký režim (bez 3D)</span>
                  <input
                    type="checkbox"
                    checked={lowPower}
                    onChange={(e) => updateA11y({ lowPower: e.target.checked })}
                  />
                </label>
                <label className="flex items-center justify-between gap-2 text-xs">
                  <span>Menej animácií</span>
                  <input
                    type="checkbox"
                    checked={a11yPrefs.reducedMotion}
                    onChange={(e) =>
                      updateA11y({ reducedMotion: e.target.checked })
                    }
                  />
                </label>
              </div>
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
              <p className="text-sm text-muted-foreground">
                {lesson.description}
              </p>
              {glossaryLinks.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Pojmy z tejto lekcie
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {glossaryLinks.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => openGlossaryTerm(t.id)}
                        className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-muted"
                      >
                        {t.term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="quiz" className="mt-0">
              {(!taskDone || !checkpointDone) && !completed && (
                <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
                  Najprv splň úlohu v 3D (záložka Úloha) a rýchlu kontrolu.
                  Potom kvíz pôjde ľahšie.
                </p>
              )}
              <QuizPanel
                lesson={lesson}
                onPassed={() =>
                  setGuideMsg(
                    next
                      ? `Gratulujem! Môžeš pokračovať na „${next.title}“ — alebo skáč kam chceš, všetky lekcie sú voľné.`
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
                  Ďalšia lekcia
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
