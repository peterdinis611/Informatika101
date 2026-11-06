"use client"

import type { CpuPhase } from "@/components/scenes/cpu-scene"
import type { GateType } from "@/components/scenes/gates-scene"

type SchematicState = {
  bits: boolean[]
  bitValue: number
  exploded: boolean
  gate: GateType
  gateA: boolean
  gateB: boolean
  powered: boolean
  processes: string[]
  regA: number
  regB: number
  cpuPhase: CpuPhase
  strength: number
  encrypted: string
  sending: boolean
  netProgress: number
}

export function LessonSchematic({
  lessonId,
  state,
}: {
  lessonId: string
  state: SchematicState
}) {
  if (lessonId === "what-is-a-computer") {
    return (
      <SchematicCard title="Tok dát">
        <svg viewBox="0 0 280 90" className="w-full">
          <Defs />
          {[
            ["VSTUP", 20],
            ["CPU", 90],
            ["DISK", 160],
            ["VÝSTUP", 230],
          ].map(([label, x], i) => (
            <g key={label}>
              <rect
                x={x}
                y={28}
                width={48}
                height={34}
                rx={6}
                fill="#fffcf7"
                stroke="#1c2430"
                strokeWidth={1.6}
              />
              <text
                x={Number(x) + 24}
                y={49}
                textAnchor="middle"
                fill="#102033"
                fontSize="8"
                fontWeight="700"
              >
                {label}
              </text>
              {i < 3 && (
                <path
                  d={`M${Number(x) + 50} 45 H${Number(x) + 68}`}
                  stroke="#1f6f5b"
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                />
              )}
            </g>
          ))}
        </svg>
      </SchematicCard>
    )
  }

  if (lessonId === "hardware") {
    return (
      <SchematicCard title={state.exploded ? "Rozložený model" : "Poskladaný PC"}>
        <svg viewBox="0 0 280 120" className="w-full">
          <rect x="70" y="20" width="140" height="80" rx="8" fill="#e8e1d4" stroke="#1c2430" strokeWidth="1.6" />
          <rect x="90" y="40" width="100" height="12" rx="2" fill="#1f6f5b" />
          <rect x="95" y="58" width="24" height="24" rx="3" fill="#c44536" />
          <rect x="130" y="58" width="14" height="28" rx="2" fill="#2f6fed" />
          <rect x="160" y="62" width="40" height="16" rx="2" fill="#5b4b8a" />
          <text x="140" y="110" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor">
            {state.exploded ? "EXPLODED VIEW" : "CASE CLOSED"}
          </text>
        </svg>
      </SchematicCard>
    )
  }

  if (lessonId === "bits-and-bytes") {
    return (
      <SchematicCard title="1 bajt = 8 bitov">
        <div className="flex justify-center gap-1 py-2">
          {state.bits.map((on, i) => (
            <div
              key={i}
              className="flex h-10 w-7 items-center justify-center rounded-md border border-[#102033] font-mono text-xs font-bold"
              style={{
                background: on ? "#1f6f5b" : "#fffcf7",
                color: on ? "#fff" : "#102033",
              }}
            >
              {on ? 1 : 0}
            </div>
          ))}
        </div>
        <p className="text-center font-mono text-sm font-semibold">
          = {state.bitValue}
          {state.bitValue >= 32 && state.bitValue < 127
            ? ` · „${String.fromCharCode(state.bitValue)}“`
            : ""}
        </p>
      </SchematicCard>
    )
  }

  if (lessonId === "cpu") {
    return (
      <SchematicCard title="Cyklus CPU">
        <svg viewBox="0 0 280 100" className="w-full">
          <Defs />
          {(
            [
              ["FETCH", 30, "fetch"],
              ["DECODE", 110, "decode"],
              ["EXECUTE", 190, "execute"],
            ] as const
          ).map(([label, x, phase]) => {
            const active = state.cpuPhase === phase
            return (
              <g key={label}>
                <rect
                  x={x}
                  y={30}
                  width={60}
                  height={32}
                  rx={6}
                  fill={active ? "#1f6f5b" : "#fffcf7"}
                  stroke="#1c2430"
                  strokeWidth={1.6}
                />
                <text
                  x={x + 30}
                  y={50}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="700"
                  fill={active ? "#fff" : "#1c2430"}
                >
                  {label}
                </text>
              </g>
            )
          })}
          <text x="40" y="88" fontSize="10" fontFamily="monospace">
            A={state.regA} · B={state.regB}
          </text>
        </svg>
      </SchematicCard>
    )
  }

  if (lessonId === "memory") {
    return (
      <SchematicCard title="RAM vs Disk">
        <div className="grid grid-cols-2 gap-3 text-center text-xs">
          <div className="rounded-xl border border-lab-line p-3">
            <p className="mb-1 font-bold">RAM</p>
            <p className="font-mono text-lab-good">
              {state.powered ? "AKTÍVNA" : "PRÁZDNA"}
            </p>
          </div>
          <div className="rounded-xl border border-lab-line p-3">
            <p className="mb-1 font-bold">DISK</p>
            <p className="font-mono text-[#5b4b8a]">TRVALÝ</p>
          </div>
        </div>
      </SchematicCard>
    )
  }

  if (lessonId === "operating-system") {
    return (
      <SchematicCard title="Vrstvy systému">
        <div className="space-y-1.5">
          {["APLIKÁCIE", "OPERAČNÝ SYSTÉM", "HARDVÉR"].map((l, i) => (
            <div
              key={l}
              className="rounded-lg border border-[#102033]/40 px-3 py-2 text-center text-[11px] font-bold text-white"
              style={{
                background: ["#2f6fed", "#1f6f5b", "#8a8578"][i],
              }}
            >
              {l}
              {i === 0 && state.processes.length > 0
                ? ` · ${state.processes.join(", ")}`
                : ""}
            </div>
          ))}
        </div>
      </SchematicCard>
    )
  }

  if (lessonId === "logic-gates") {
    const out =
      state.gate === "AND"
        ? state.gateA && state.gateB
        : state.gate === "OR"
          ? state.gateA || state.gateB
          : !state.gateA
    return (
      <SchematicCard title={`Hradlo ${state.gate}`}>
        <svg viewBox="0 0 280 100" className="w-full">
          <circle cx="40" cy="35" r="10" fill={state.gateA ? "#1f6f5b" : "#cfc5b4"} stroke="#1c2430" />
          <text x="40" y="60" textAnchor="middle" fontSize="9" fontWeight="700">
            A
          </text>
          {state.gate !== "NOT" && (
            <>
              <circle cx="40" cy="75" r="10" fill={state.gateB ? "#1f6f5b" : "#cfc5b4"} stroke="#1c2430" />
              <text x="55" y="79" fontSize="9" fontWeight="700">
                B
              </text>
            </>
          )}
          <rect x="110" y="40" width="60" height="30" rx="6" fill="#ea580c" stroke="#1c2430" />
          <text x="140" y="59" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
            {state.gate}
          </text>
          <circle cx="230" cy="55" r="16" fill={out ? "#f6e27a" : "#8a8578"} stroke="#1c2430" strokeWidth="1.6" />
          <text x="230" y="88" textAnchor="middle" fontSize="10" fontFamily="monospace">
            OUT={out ? 1 : 0}
          </text>
          <line x1="50" y1="35" x2="110" y2="50" stroke="#1c2430" strokeWidth="1.5" />
          {state.gate !== "NOT" && (
            <line x1="50" y1="75" x2="110" y2="60" stroke="#1c2430" strokeWidth="1.5" />
          )}
          <line x1="170" y1="55" x2="214" y2="55" stroke="#1c2430" strokeWidth="1.5" />
        </svg>
      </SchematicCard>
    )
  }

  if (lessonId === "networking") {
    return (
      <SchematicCard title="Cesta paketu">
        <svg viewBox="0 0 280 80" className="w-full">
          <Defs />
          {["PC", "RTR", "DNS", "SRV"].map((n, i) => (
            <g key={n}>
              <rect x={20 + i * 70} y={24} width={44} height={28} rx={5} fill="#fffcf7" stroke="#1c2430" />
              <text x={42 + i * 70} y={42} textAnchor="middle" fontSize="9" fontWeight="700" fill="#102033">
                {n}
              </text>
              {i < 3 && (
                <path
                  d={`M${64 + i * 70} 38 H${86 + i * 70}`}
                  stroke="#1f6f5b"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
              )}
            </g>
          ))}
          {state.sending && (
            <text x="140" y="72" textAnchor="middle" fontSize="9" fontFamily="monospace">
              progress {(state.netProgress * 100).toFixed(0)}%
            </text>
          )}
        </svg>
      </SchematicCard>
    )
  }

  if (lessonId === "programming") {
    return (
      <SchematicCard title="Blokový program">
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="rounded-md bg-[#3d8bfd] px-2 py-1.5 text-white">premenná</div>
          <div className="rounded-md bg-[#db2777] px-2 py-1.5 text-white">podmienka</div>
          <div className="rounded-md bg-[#1f6f5b] px-2 py-1.5 text-white">cyklus</div>
        </div>
      </SchematicCard>
    )
  }

  if (lessonId === "security") {
    return (
      <SchematicCard title="Ochrana">
        <div className="space-y-2 text-sm">
          <p className="font-mono">
            Heslo: <strong>{state.strength}%</strong>
          </p>
          <p className="rounded-lg bg-[#102033] px-2 py-1.5 font-mono text-[11px] text-[#f6e27a]">
            cipher: {state.encrypted || "…"}
          </p>
        </div>
      </SchematicCard>
    )
  }

  if (lessonId === "files-and-folders") {
    return (
      <SchematicCard title="Strom súborov">
        <p className="text-sm">Domov → Dokumenty / Obrázky / Hudba</p>
      </SchematicCard>
    )
  }
  if (lessonId === "algorithms") {
    return (
      <SchematicCard title="Bubble sort">
        <p className="text-sm">Porovnaj susedov. Ak sú naopak, vymeň ich. Opakuj.</p>
      </SchematicCard>
    )
  }
  if (lessonId === "databases") {
    return (
      <SchematicCard title="Dopyt">
        <p className="font-mono text-xs">SELECT * FROM ziaci WHERE znamka = 1</p>
      </SchematicCard>
    )
  }
  if (lessonId === "web-and-html") {
    return (
      <SchematicCard title="Vrstvy webu">
        <p className="text-sm">HTML štruktúra → CSS vzhľad → JS správanie</p>
      </SchematicCard>
    )
  }
  if (lessonId === "ai-basics") {
    return (
      <SchematicCard title="Model">
        <p className="text-sm">Vstup (otázka) → vzory v dátach → výstup + istota</p>
      </SchematicCard>
    )
  }

  return null
}

function SchematicCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-lab-line bg-muted/50 dark:bg-muted/30">
      <div className="border-b border-lab-line px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

function Defs() {
  return (
    <defs>
      <marker
        id="arrow"
        markerWidth="6"
        markerHeight="6"
        refX="5"
        refY="3"
        orient="auto"
      >
        <path d="M0,0 L6,3 L0,6 Z" fill="#1f6f5b" />
      </marker>
    </defs>
  )
}
