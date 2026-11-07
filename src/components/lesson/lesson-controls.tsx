"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { GateType } from "@/components/scenes/gates-scene"
import {
  AI_QUESTIONS,
  DB_CORRECT_QUERY,
  DB_QUERY_OPTIONS,
  PHISHING_MESSAGES,
  filesCorrectlyPlaced,
  gateOutput,
  gatesAndTrue,
  gatesOrSingle,
  isSortedAscending,
  passwordStrength,
} from "@/lib/lesson-lab"

export type LessonControlsProps = {
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
  gateGoals: { andTrue: boolean; orSingle: boolean }
  setGateGoals: (
    v:
      | { andTrue: boolean; orSingle: boolean }
      | ((p: { andTrue: boolean; orSingle: boolean }) => {
          andTrue: boolean
          orSingle: boolean
        })
  ) => void
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
  setFilePlaced: (
    v:
      | Record<string, string>
      | ((p: Record<string, string>) => Record<string, string>)
  ) => void
  sortValues: number[]
  setSortValues: (v: number[] | ((p: number[]) => number[])) => void
  setSortHighlight: (v: [number, number] | null) => void
  onlyOnes: boolean
  setOnlyOnes: (v: boolean) => void
  dbQuery: string | null
  setDbQuery: (v: string | null) => void
  webHtml: boolean
  setWebHtml: (v: boolean) => void
  webCss: boolean
  setWebCss: (v: boolean) => void
  webJs: boolean
  setWebJs: (v: boolean) => void
  asked: string[]
  setAsked: (v: string[] | ((p: string[]) => string[])) => void
  aiFlagged: string | null
  setAiFlagged: (v: string | null) => void
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

export function LessonControls(p: LessonControlsProps) {
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
          Obnoviť registre
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
    const out = gateOutput(p.gate, p.gateA, p.gateB)
    function applyGate(
      nextGate: GateType,
      nextA: boolean,
      nextB: boolean
    ) {
      p.setGate(nextGate)
      p.setGateA(nextA)
      p.setGateB(nextB)
      p.setGateGoals((prev) => {
        const next = {
          andTrue:
            prev.andTrue || gatesAndTrue(nextGate, nextA, nextB),
          orSingle:
            prev.orSingle || gatesOrSingle(nextGate, nextA, nextB),
        }
        if (next.andTrue && next.orSingle) {
          p.markTask()
          p.setInfo("Splnené: AND=1 (oba vstupy) aj OR=1 (jeden vstup).")
        }
        return next
      })
    }

    return (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Cieľ: ukáž AND s výstupom 1 (oba vstupy) a OR s výstupom 1 (práve
          jeden vstup).
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(["AND", "OR", "NOT"] as GateType[]).map((g) => (
            <Button
              key={g}
              variant={p.gate === g ? "default" : "outline"}
              onClick={() => applyGate(g, p.gateA, p.gateB)}
            >
              {g}
            </Button>
          ))}
        </div>
        <ToggleRow
          label="Vstup A"
          checked={p.gateA}
          onChange={(v) => applyGate(p.gate, v, p.gateB)}
        />
        {p.gate !== "NOT" && (
          <ToggleRow
            label="Vstup B"
            checked={p.gateB}
            onChange={(v) => applyGate(p.gate, p.gateA, v)}
          />
        )}
        <p className="font-mono text-sm">
          Výstup = <strong>{out ? "1" : "0"}</strong>
        </p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>{p.gateGoals.andTrue ? "✓" : "○"} AND → 1 (A=1, B=1)</li>
          <li>{p.gateGoals.orSingle ? "✓" : "○"} OR → 1 (práve jeden vstup)</li>
        </ul>
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
    return <SecurityControls {...p} />
  }

  if (p.lessonId === "files-and-folders") {
    const moves = [
      { file: "uloha", folder: "docs", label: "úloha.docx → Dokumenty" },
      { file: "foto", folder: "pics", label: "foto.png → Obrázky" },
      { file: "song", folder: "music", label: "song.mp3 → Hudba" },
      {
        file: "foto",
        folder: "music",
        label: "foto.png → Hudba (nesprávne)",
        wrong: true,
      },
    ]
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Úloha platí len pri správnych priečinkoch. Zlá cesta sa nepočíta.
        </p>
        {moves.map((m) => (
          <Button
            key={`${m.file}-${m.folder}`}
            className="w-full"
            variant={
              p.filePlaced[m.file] === m.folder ? "secondary" : "outline"
            }
            onClick={() => {
              p.setFilePlaced((prev) => {
                const next = { ...prev, [m.file]: m.folder }
                if (filesCorrectlyPlaced(next)) {
                  p.markTask()
                  p.setInfo("Všetky tri súbory sú na správnej ceste.")
                } else if (m.wrong) {
                  p.setInfo(
                    "To nie je správny priečinok — foto.png nepatrí do Hudby."
                  )
                } else {
                  p.setInfo(`${m.label}. Cesta hovorí, kde súbor leží.`)
                }
                return next
              })
            }}
          >
            {m.label}
          </Button>
        ))}
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => p.setFilePlaced({})}
        >
          Vyprázdniť priečinky
        </Button>
      </div>
    )
  }

  if (p.lessonId === "algorithms") {
    return (
      <div className="space-y-2">
        <p className="font-mono text-xs text-muted-foreground">
          [{p.sortValues.join(", ")}]
          {isSortedAscending(p.sortValues) ? " — zoradené ✓" : ""}
        </p>
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
              if (isSortedAscending(arr)) p.markTask()
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
          Obnoviť veže
        </Button>
      </div>
    )
  }

  if (p.lessonId === "databases") {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Vyber správny dopyt. Filter sa zapne až pri správnej voľbe.
        </p>
        {DB_QUERY_OPTIONS.map((q) => (
          <Button
            key={q}
            className="w-full justify-start font-mono text-[11px]"
            variant={p.dbQuery === q ? "secondary" : "outline"}
            onClick={() => {
              p.setDbQuery(q)
              if (q === DB_CORRECT_QUERY) {
                p.setOnlyOnes(true)
                p.markTask()
                p.setInfo("Správny dopyt — ostali len jednotkári.")
              } else {
                p.setOnlyOnes(false)
                p.setInfo(
                  q.includes("DELETE")
                    ? "DELETE by zmazal dáta — to nechceme."
                    : "Tento dopyt nefiltruje známku = 1."
                )
              }
            }}
          >
            {q}
          </Button>
        ))}
      </div>
    )
  }

  if (p.lessonId === "web-and-html") {
    const layers = [
      {
        key: "html" as const,
        on: p.webHtml,
        set: p.setWebHtml,
        label: "Zapnúť HTML",
      },
      {
        key: "css" as const,
        on: p.webCss,
        set: p.setWebCss,
        label: "Zapnúť CSS",
      },
      {
        key: "js" as const,
        on: p.webJs,
        set: p.setWebJs,
        label: "Zapnúť JavaScript",
      },
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
              p.setInfo(
                `${l.label.replace("Zapnúť ", "")} je kostra, štýl alebo správanie stránky.`
              )
            }}
          >
            {l.label}
          </Button>
        ))}
      </div>
    )
  }

  if (p.lessonId === "ai-basics") {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Polož všetky tri otázky a označ, ktorá odpoveď je neistá (hápanie).
        </p>
        {AI_QUESTIONS.map((c) => (
          <Button
            key={c.q}
            className="w-full"
            variant={p.asked.includes(c.q) ? "secondary" : "outline"}
            onClick={() => {
              p.setAsked((prev) =>
                prev.includes(c.q) ? prev : [...prev, c.q]
              )
              p.setInfo(
                c.uncertain
                  ? "Nízka istota — model háda. Over si fakt."
                  : "Vysoká istota — jednoduchý fakt."
              )
            }}
          >
            Opýtať: {c.q}
          </Button>
        ))}
        {p.asked.length >= 3 && (
          <div className="space-y-2 border-t border-lab-line pt-2">
            <p className="text-xs font-medium">Ktorá odpoveď je neistá?</p>
            {AI_QUESTIONS.map((c) => (
              <Button
                key={`flag-${c.q}`}
                className="w-full"
                size="sm"
                variant={p.aiFlagged === c.q ? "secondary" : "outline"}
                onClick={() => {
                  p.setAiFlagged(c.q)
                  if (c.uncertain) {
                    p.markTask()
                    p.setInfo("Správne — počasie mal model s nízkou istotou.")
                  } else {
                    p.setInfo("Táto odpoveď mala vysokú istotu. Skús inú.")
                  }
                }}
              >
                {c.q}
              </Button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}

function SecurityControls(p: LessonControlsProps) {
  const [picked, setPicked] = useState<string | null>(null)
  const strongEnough = p.strength >= 70

  return (
    <div className="space-y-3">
      <label className="block text-sm">
        Skús heslo (aspoň ~70 % sily)
        <input
          type="text"
          value={p.password}
          onChange={(e) => {
            const value = e.target.value
            p.setPassword(value)
            if (p.phishingCaught && passwordStrength(value) >= 70) {
              p.markTask()
            }
          }}
          className="mt-1 w-full rounded-lg border border-lab-line bg-background px-3 py-2"
          placeholder="Napr. Domcek#2026"
        />
        <span className="mt-1 block font-mono text-xs text-muted-foreground">
          Sila: {p.strength}%
        </span>
      </label>

      <div className="space-y-2">
        <p className="text-xs font-medium">Ktorá správa je phishing?</p>
        {PHISHING_MESSAGES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setPicked(m.id)
              if (m.phishing) {
                p.setPhishingCaught(true)
                p.setInfo(
                  "Správne: nátlak, cudzí odkaz, žiadosť o heslo. Neklikaj!"
                )
                if (strongEnough || passwordStrength(p.password) >= 70) {
                  p.markTask()
                } else {
                  p.setInfo(
                    "Phishing odhalený. Ešte nastav silnejšie heslo (≥ 70 %)."
                  )
                }
              } else {
                p.setInfo("Toto vyzerá ako bežná správa — skús inú.")
              }
            }}
            className={cn(
              "w-full rounded-xl border px-3 py-2 text-left text-xs transition",
              picked === m.id
                ? m.phishing
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                  : "border-red-400 bg-red-50 dark:bg-red-950"
                : "border-lab-line hover:bg-muted"
            )}
          >
            <span className="font-semibold">{m.subject}</span>
            <span className="mt-0.5 block text-muted-foreground">
              Od: {m.from}
            </span>
            <span className="mt-1 block">{m.body}</span>
          </button>
        ))}
      </div>

      <label className="block text-sm">
        Text na šifrovanie
        <input
          type="text"
          value={p.plain}
          onChange={(e) => p.setPlain(e.target.value)}
          className="mt-1 w-full rounded-lg border border-lab-line bg-background px-3 py-2"
        />
      </label>

      {p.phishingCaught && strongEnough && (
        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
          Úloha: silné heslo + odhalený phishing ✓
        </p>
      )}
    </div>
  )
}
