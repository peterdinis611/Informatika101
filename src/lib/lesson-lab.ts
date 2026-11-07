export type GateType = "AND" | "OR" | "NOT"

export const CPU_PROGRAM = [
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
] as const

export function caesar(text: string, shift: number) {
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

export function passwordStrength(pw: string) {
  let s = 0
  if (pw.length >= 8) s += 25
  if (pw.length >= 12) s += 15
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 20
  if (/\d/.test(pw)) s += 20
  if (/[^A-Za-z0-9]/.test(pw)) s += 20
  return Math.min(100, s)
}

export function gateOutput(gate: GateType, a: boolean, b: boolean) {
  if (gate === "AND") return a && b
  if (gate === "OR") return a || b
  return !a
}

export function bitsToValue(bits: boolean[]) {
  return bits.reduce((acc, b, i) => acc + (b ? 1 << (7 - i) : 0), 0)
}

/** AND with both inputs true → output 1 */
export function gatesAndTrue(gate: GateType, a: boolean, b: boolean) {
  return gate === "AND" && a && b && gateOutput(gate, a, b)
}

/** OR with exactly one input true → output 1 */
export function gatesOrSingle(gate: GateType, a: boolean, b: boolean) {
  return gate === "OR" && a !== b && gateOutput(gate, a, b)
}

export const FILE_TARGETS: Record<string, string> = {
  uloha: "docs",
  foto: "pics",
  song: "music",
}

export function filesCorrectlyPlaced(placed: Record<string, string>) {
  return Object.entries(FILE_TARGETS).every(
    ([file, folder]) => placed[file] === folder
  )
}

export function isSortedAscending(values: number[]) {
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] > values[i + 1]) return false
  }
  return true
}

export const DB_QUERY_OPTIONS = [
  "SELECT * FROM ziaci",
  "SELECT * FROM ziaci WHERE znamka = 1",
  "DELETE FROM ziaci",
  "SELECT * FROM ziaci WHERE znamka = 5",
] as const

export const DB_CORRECT_QUERY =
  "SELECT * FROM ziaci WHERE znamka = 1" as const

export const PHISHING_MESSAGES = [
  {
    id: "bank",
    from: "banka@secure-login.sk",
    subject: "Overenie účtu do 10 minút!",
    body: "Klikni sem a zadaj heslo, inak účet zablokujeme.",
    phishing: true,
  },
  {
    id: "school",
    from: "ucitel@skola.sk",
    subject: "Domáca úloha na piatok",
    body: "Prosím odovzdaj projekt do piatka. Otázky napíš na tento mail.",
    phishing: false,
  },
  {
    id: "news",
    from: "newsletter@kniznica.sk",
    subject: "Nové knihy v knižnici",
    body: "Tento týždeň pribudli knihy o programovaní. Príď si pozrieť.",
    phishing: false,
  },
] as const

export const AI_QUESTIONS = [
  { q: "2+2?", a: "4", conf: 98, uncertain: false },
  { q: "Hlavné mesto SK?", a: "Bratislava", conf: 92, uncertain: false },
  { q: "Zajtrajšie počasie?", a: "Neviem iste", conf: 34, uncertain: true },
] as const
