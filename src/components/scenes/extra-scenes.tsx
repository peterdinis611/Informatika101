"use client"

import { useLabFloorColor } from "@/components/scenes/hardware-models"
import { FloatTag, ToonBox } from "@/components/scenes/toon"
import { Hotspot } from "@/components/scenes/hotspot"

export function FilesScene({
  placed,
  onInfo,
}: {
  placed: Record<string, string>
  onInfo: (text: string) => void
}) {
  const folders = [
    {
      id: "docs",
      label: "Dokumenty",
      color: "#2563eb",
      x: -1.8,
      summary: "Priečinok na textové súbory — .docx, .pdf, .txt…",
      facts: [
        "Cesta môže vyzerať ako Dokumenty/úloha.docx",
        "Jeden priečinok = jedna „škatuľa“ na disku",
      ],
    },
    {
      id: "pics",
      label: "Obrázky",
      color: "#db2777",
      x: 0,
      summary: "Sem patria fotky a grafika — .png, .jpg, .webp…",
      facts: [
        "Prípona súboru napovedá typ obsahu",
        "Veľké fotky zaberajú viac miesta na disku",
      ],
    },
    {
      id: "music",
      label: "Hudba",
      color: "#ca8a04",
      x: 1.8,
      summary: "Zvukové súbory — .mp3, .wav, .flac…",
      facts: [
        "Organizácia podľa typu uľahčuje hľadanie",
        "Súbor mimo správneho priečinka sa ťažšie nájde",
      ],
    },
  ]
  const files = [
    { id: "uloha", label: "úloha.docx", want: "docs", color: "#93c5fd" },
    { id: "foto", label: "foto.png", want: "pics", color: "#f9a8d4" },
    { id: "song", label: "song.mp3", want: "music", color: "#fde68a" },
  ]

  const floor = useLabFloorColor()

  return (
    <group>
      <ToonBox args={[6.4, 0.1, 2.4]} position={[0, -0.85, 0]} color={floor} radius={0.04} />
      {folders.map((f) => (
        <Hotspot
          key={f.id}
          tag={f.label}
          tagY={0.75}
          ringY={-0.55}
          ringScale={0.85}
          target={{
            id: `file-folder-${f.id}`,
            position: [f.x, 0.15, 0],
            offset: [1.8, 1.5, 2.2],
            title: `Priečinok ${f.label}`,
            summary: f.summary,
            facts: f.facts,
            tip: "V paneli Úloha priraď súbory do správnych priečinkov.",
            glossaryId: "priecinok",
          }}
          onOpen={() => onInfo(`Priečinok ${f.label} zbiera súbory rovnakého typu.`)}
        >
          <ToonBox args={[1.35, 0.2, 1.05]} position={[0, -0.2, 0]} color="#1e293b" radius={0.04} />
          <ToonBox args={[1.45, 0.95, 1.15]} color={f.color} radius={0.06} />
          {files
            .filter((file) => placed[file.id] === f.id)
            .map((file, i) => (
              <ToonBox
                key={file.id}
                args={[0.9, 0.12, 0.7]}
                position={[0, 0.15 + i * 0.16, 0.15]}
                color={file.color}
                radius={0.03}
              />
            ))}
        </Hotspot>
      ))}
      <group position={[0, -0.35, 1.05]}>
        {files
          .filter((file) => !placed[file.id])
          .map((file, i) => (
            <Hotspot
              key={file.id}
              tag={file.label}
              tagY={0.35}
              ringY={-0.25}
              ringScale={0.55}
              beacon={false}
              target={{
                id: `file-item-${file.id}`,
                position: [(i - 1) * 1.2, 0, 0],
                offset: [1.4, 1.2, 1.6],
                title: file.label,
                summary: `Súbor má patriť do priečinka „${
                  folders.find((x) => x.id === file.want)?.label
                }“.`,
                facts: [
                  "Názov + prípona identifikujú súbor",
                  "Presun do priečinka = zmena cesty, nie obsahu",
                ],
                tip: "Použi panel Úloha na umiestnenie súboru.",
                glossaryId: "subor",
              }}
              onOpen={() => onInfo(`${file.label} → ${file.want}`)}
            >
              <ToonBox args={[0.95, 0.14, 0.7]} color={file.color} radius={0.04} />
            </Hotspot>
          ))}
      </group>
    </group>
  )
}

export function AlgorithmsScene({
  values,
  highlight,
  onInfo,
}: {
  values: number[]
  highlight: [number, number] | null
  onInfo?: (text: string) => void
}) {
  const floor = useLabFloorColor()
  return (
    <group>
      <ToonBox args={[6.2, 0.1, 2.2]} position={[0, -0.85, 0]} color={floor} radius={0.04} />
      {values.map((v, i) => {
        const active = highlight && (highlight[0] === i || highlight[1] === i)
        const h = 0.25 + v * 0.28
        return (
          <Hotspot
            key={i}
            tag={String(v)}
            tagY={0.9}
            ringY={-0.45}
            ringScale={0.55}
            beacon={!active}
            target={{
              id: `algo-bar-${i}`,
              position: [(i - 2) * 1.05, 0, 0],
              offset: [1.5, 1.4, 2.0],
              title: `Prvok [${i}] = ${v}`,
              summary:
                "Bubble sort porovnáva susedov a vymení ich, ak sú v zlom poradí. Opakuje sa, kým pole nie je zoradené.",
              facts: [
                active ? "Tento stĺpec sa práve porovnáva / vymieňa." : "Čaká na ďalší krok.",
                "Najväčšie hodnoty „bublajú“ doprava.",
                "Jednoduchý, ale pri veľkých dátach pomalý.",
              ],
              tip: "V paneli Úloha stlač Ďalší krok a sleduj zvýraznené stĺpce.",
              glossaryId: "bubble-sort",
            }}
            onOpen={() => onInfo?.(`Index ${i}, hodnota ${v}`)}
          >
            <ToonBox
              args={[0.7, h, 0.7]}
              position={[0, h / 2 - 0.55, 0]}
              color={active ? "#e23d2a" : "#0ea5e9"}
              selected={Boolean(active)}
              radius={0.06}
            />
          </Hotspot>
        )
      })}
      <FloatTag position={[0, 1.45, 0]} text="Bubble sort" />
    </group>
  )
}

const DB_ROWS = [
  { name: "Anna", grade: 1 },
  { name: "Boris", grade: 2 },
  { name: "Cyril", grade: 1 },
  { name: "Dana", grade: 3 },
]

export function DatabasesScene({
  onlyOnes,
  onInfo,
}: {
  onlyOnes: boolean
  onInfo: (text: string) => void
}) {
  const rows = onlyOnes ? DB_ROWS.filter((r) => r.grade === 1) : DB_ROWS
  return (
    <group>
      <ToonBox args={[5.4, 0.12, 2.6]} position={[0, -0.7, 0]} color="#1e293b" radius={0.05} />
      <ToonBox args={[5.1, 0.08, 2.3]} position={[0, -0.55, 0]} color="#2563eb" radius={0.04} />
      <FloatTag
        position={[0, 1.35, 0]}
        text={onlyOnes ? "SELECT * WHERE známka = 1" : "Tabuľka žiaci"}
      />
      {rows.map((row, i) => (
        <Hotspot
          key={row.name}
          tag={`${row.name} · ${row.grade}`}
          tagY={0.32}
          ringY={-0.28}
          ringScale={1.1}
          beacon={row.grade === 1}
          target={{
            id: `db-row-${row.name}`,
            position: [0, 0.55 - i * 0.42, 0],
            offset: [2.2, 1.2, 2.0],
            title: `Riadok: ${row.name}`,
            summary: "Riadok = jeden záznam. Stĺpce sú vlastnosti (meno, známka…).",
            facts: [
              `známka = ${row.grade}`,
              "SELECT filtruje, ktoré riadky uvidíš",
              "WHERE známka = 1 nechá len jednotkárov",
            ],
            tip: "Vyber správny dopyt v paneli Úloha a porovnaj počet riadkov.",
            glossaryId: "dopyt",
          }}
          onOpen={() => onInfo(`${row.name}: známka ${row.grade}. Riadok = jeden záznam.`)}
        >
          <ToonBox
            args={[4.4, 0.32, 1.4]}
            color={row.grade === 1 ? "#86efac" : "#e2e8f0"}
            radius={0.05}
          />
        </Hotspot>
      ))}
    </group>
  )
}

export function WebScene({
  html,
  css,
  js,
  onInfo,
}: {
  html: boolean
  css: boolean
  js: boolean
  onInfo?: (text: string) => void
}) {
  const layers = [
    {
      id: "web-html",
      label: "HTML",
      color: html ? "#ea580c" : "#94a3b8",
      y: 0.35,
      on: html,
      title: "HTML — kostra",
      summary: "HTML popisuje štruktúru stránky: nadpisy, odseky, tlačidlá, obrázky.",
      facts: [
        "Tagy ako <h1>, <p>, <button>",
        "Bez HTML by CSS/JS nemali čo štýlovať",
        html ? "Zapnuté — kostra je viditeľná" : "Vypnuté — stránka je prázdna",
      ],
    },
    {
      id: "web-css",
      label: "CSS",
      color: css ? "#2563eb" : "#94a3b8",
      y: -0.25,
      on: css,
      title: "CSS — vzhľad",
      summary: "CSS hovorí, ako má HTML vyzerať: farby, veľkosti, rozloženie.",
      facts: [
        "Farba, font, margin, flex/grid…",
        "Oddelenie obsahu (HTML) a štýlu (CSS)",
        css ? "Zapnuté — stránka má štýl" : "Vypnuté — len surová kostra",
      ],
    },
    {
      id: "web-js",
      label: "JS",
      color: js ? "#eab308" : "#94a3b8",
      y: -0.85,
      on: js,
      title: "JavaScript — správanie",
      summary: "JS pridáva interakciu: kliky, animácie, načítanie dát.",
      facts: [
        "Reaguje na udalosti (click, input…)",
        "Beží v prehliadači u návštevníka",
        js ? "Zapnuté — tlačidlo ožilo" : "Vypnuté — stránka je statická",
      ],
    },
  ]

  return (
    <group>
      <Hotspot
        tag="Náhľad"
        tagY={1.2}
        ringY={-0.75}
        ringScale={1.05}
        target={{
          id: "web-preview",
          position: [-1.7, 0.2, 0],
          offset: [2.4, 1.6, 2.4],
          title: "Prehliadač — náhľad stránky",
          summary:
            "Prehliadač skladá HTML + CSS + JS do toho, čo vidíš. Vypni vrstvu a sleduj, čo zmizne.",
          facts: [
            html ? "HTML ✓" : "Bez HTML",
            css ? "CSS ✓" : "Bez CSS",
            js ? "JS ✓" : "Bez JS",
          ],
          tip: "V paneli Úloha zapínaj vrstvy po jednej.",
          glossaryId: "html",
        }}
        onOpen={() => onInfo?.("Náhľad stránky v prehliadači.")}
      >
        <ToonBox args={[2.4, 1.7, 0.18]} color="#0f172a" radius={0.05} />
        {html && (
          <ToonBox args={[2.05, 1.35, 0.08]} position={[0, 0.02, 0.12]} color="#f8fafc" radius={0.03} />
        )}
        {html && css && (
          <>
            <ToonBox args={[2.05, 0.28, 0.04]} position={[0, 0.52, 0.16]} color="#ea580c" radius={0.02} />
            <ToonBox args={[1.4, 0.18, 0.04]} position={[0, 0.18, 0.16]} color="#fb923c" radius={0.02} />
          </>
        )}
        {html && css && js && (
          <ToonBox args={[0.7, 0.22, 0.06]} position={[0, -0.35, 0.18]} color="#22c55e" radius={0.03} />
        )}
      </Hotspot>

      {layers.map((l) => (
        <Hotspot
          key={l.id}
          tag={l.label}
          tagY={0.45}
          ringY={-0.35}
          ringScale={0.75}
          target={{
            id: l.id,
            position: [1.5, l.y, 0],
            offset: [-1.8, 1.2, 2.0],
            title: l.title,
            summary: l.summary,
            facts: l.facts,
            tip: "Zapni vrstvu v paneli Úloha a pozoruj náhľad vľavo.",
            glossaryId: l.id === "web-html" ? "html" : l.id === "web-css" ? "css" : "javascript",
          }}
          onOpen={() => onInfo?.(l.title)}
        >
          <ToonBox args={[1.5, 0.45, 0.45]} color={l.color} radius={0.06} selected={l.on} />
        </Hotspot>
      ))}
    </group>
  )
}

export function AiScene({
  asked,
  onInfo,
}: {
  asked: string[]
  onInfo: (text: string) => void
}) {
  const cards = [
    { q: "2+2?", a: "4", conf: 98 },
    { q: "Hlavné mesto SK?", a: "Bratislava", conf: 92 },
    { q: "Zajtrajšie počasie?", a: "Neviem iste", conf: 34 },
  ]
  return (
    <group>
      <Hotspot
        tag="Model"
        tagY={1.05}
        ringY={-0.7}
        target={{
          id: "ai-model",
          position: [-1.6, 0.1, 0],
          offset: [2.2, 1.6, 2.4],
          title: "AI model",
          summary:
            "Model odhaduje odpoveď podľa vzorov z tréningových dát. Nie vždy vie — istota (confidence) to ukazuje.",
          facts: [
            "Vysoká istota ≠ vždy pravda",
            "Nízka istota = radšej overiť inde",
            "AI ne„chápe“ ako človek — predikuje tokeny",
          ],
          tip: "Klikni na otázky vpravo a porovnaj istotu odpovedí.",
          glossaryId: "ai",
        }}
        onOpen={() => onInfo("AI model odhaduje odpovede — overuj fakty.")}
      >
        <ToonBox args={[2.2, 1.4, 1.1]} color="#0f766e" radius={0.08} />
        <ToonBox args={[1.6, 0.7, 0.7]} position={[0, 0.25, 0.2]} color="#5eead4" radius={0.06} />
      </Hotspot>
      {cards.map((c, i) => {
        const done = asked.includes(c.q)
        return (
          <Hotspot
            key={c.q}
            tag={done ? `${c.a} · ${c.conf}%` : c.q}
            tagY={0.48}
            ringY={-0.4}
            ringScale={0.85}
            target={{
              id: `ai-q-${i}`,
              position: [1.4, 0.85 - i * 0.75, 0],
              offset: [-1.8, 1.2, 2.0],
              title: c.q,
              summary: done
                ? `Odpoveď: ${c.a}. Model hlási istotu ${c.conf}%.`
                : "Zatiaľ nepoložené — pošli otázku z panela Úloha.",
              facts: [
                done
                  ? c.conf < 50
                    ? "Nízka istota — over si to inde."
                    : "Vysoká istota — stále môžeš overiť."
                  : "Klikni v paneli Úloha, aby si otázku poslal.",
                "Istota ≠ záruka pravdy",
              ],
              tip: "Porovnaj otázku s istotou 98% vs 34%.",
              glossaryId: c.conf < 50 ? "halucinacia" : "ai",
            }}
            onOpen={() =>
              onInfo(
                done
                  ? `Otázka „${c.q}“ → ${c.a} (istota ${c.conf}%).`
                  : "Klikni v paneli Úloha, aby si otázku poslal modelu."
              )
            }
          >
            <ToonBox
              args={[2.2, 0.55, 0.55]}
              color={done ? "#86efac" : "#e2e8f0"}
              radius={0.06}
              selected={done}
            />
          </Hotspot>
        )
      })}
    </group>
  )
}
