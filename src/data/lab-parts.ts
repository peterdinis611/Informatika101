export type LabPartDef = {
  id: string
  label: string
  color: string
  hint: string
}

export const INTRO_LAB_PARTS: LabPartDef[] = [
  {
    id: "vstup",
    label: "Vstup",
    color: "#2563eb",
    hint: "Klávesnica / myš — dáta do PC",
  },
  {
    id: "spracovanie",
    label: "Procesor",
    color: "#e11d48",
    hint: "CPU počíta a rozhoduje",
  },
  {
    id: "ulozenie",
    label: "Pamäť",
    color: "#7c3aed",
    hint: "RAM / disk — uloženie dát",
  },
  {
    id: "vystup",
    label: "Výstup",
    color: "#0d9488",
    hint: "Monitor — výsledok pre teba",
  },
]

export const HARDWARE_LAB_PARTS: LabPartDef[] = [
  {
    id: "case",
    label: "Skrinka",
    color: "#64748b",
    hint: "Chrání súčiastky",
  },
  {
    id: "mb",
    label: "Základná doska",
    color: "#22c55e",
    hint: "Spája všetky diely",
  },
  {
    id: "cpu",
    label: "CPU",
    color: "#f43f5e",
    hint: "Mozog počítača",
  },
  {
    id: "ram",
    label: "RAM",
    color: "#3b82f6",
    hint: "Rýchla dočasná pamäť",
  },
  {
    id: "disk",
    label: "SSD",
    color: "#a855f7",
    hint: "Trvalé uloženie",
  },
  {
    id: "psu",
    label: "Zdroj",
    color: "#f59e0b",
    hint: "Dodáva elektrinu",
  },
  {
    id: "gpu",
    label: "GPU",
    color: "#06b6d4",
    hint: "Kreslí obraz",
  },
]

export function getLabParts(lessonId: string): LabPartDef[] | null {
  if (lessonId === "what-is-a-computer") return INTRO_LAB_PARTS
  if (lessonId === "hardware") return HARDWARE_LAB_PARTS
  return null
}
