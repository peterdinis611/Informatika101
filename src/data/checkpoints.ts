export type Checkpoint = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

/** Mid-lesson formative check — one per lesson, before the final quiz. */
export const CHECKPOINTS: Record<string, Checkpoint> = {
  "what-is-a-computer": {
    id: "cp-intro",
    question: "V akom poradí ide tok dát v počítači?",
    options: [
      "Vstup → spracovanie → uloženie → výstup",
      "Výstup → vstup → disk",
      "Len CPU → monitor",
      "Wi‑Fi → heslo → výstup",
    ],
    correctIndex: 0,
    explanation: "Najprv údaje prídu, potom sa spracujú, uložia a ukážu.",
  },
  hardware: {
    id: "cp-hw",
    question: "Ktorá súčasť vykonáva inštrukcie?",
    options: ["CPU", "Monitor", "Klávesnica", "Reproduktor"],
    correctIndex: 0,
    explanation: "CPU (procesor) je „mozog“ — počíta a riadi.",
  },
  "bits-and-bytes": {
    id: "cp-bits",
    question: "Koľko bitov má jeden bajt?",
    options: ["8", "2", "16", "100"],
    correctIndex: 0,
    explanation: "1 bajt = 8 bitov.",
  },
  cpu: {
    id: "cp-cpu",
    question: "Čo ide v CPU cykle ako prvé?",
    options: ["Fetch (načítaj)", "Execute", "Vypni PC", "Pošli e‑mail"],
    correctIndex: 0,
    explanation: "Najprv sa inštrukcia načita, potom dekóduje a vykoná.",
  },
  memory: {
    id: "cp-mem",
    question: "Čo sa stane s RAM po vypnutí?",
    options: [
      "Obsah sa stratí",
      "Ostane navždy",
      "Presunie sa do myši",
      "Zmení sa na SSD",
    ],
    correctIndex: 0,
    explanation: "RAM je volatilná — bez napájania zmizne.",
  },
  "operating-system": {
    id: "cp-os",
    question: "Čo je proces?",
    options: [
      "Bežiaca inštancia programu",
      "Typ kábla",
      "Súbor .png",
      "Heslo k Wi‑Fi",
    ],
    correctIndex: 0,
    explanation: "OS spúšťa programy ako procesy a strieda ich.",
  },
  "logic-gates": {
    id: "cp-gates",
    question: "AND dáva 1 len keď…",
    options: [
      "sú oba vstupy 1",
      "je aspoň jeden vstup 1",
      "sú vstupy rôzne",
      "je PC vypnutý",
    ],
    correctIndex: 0,
    explanation: "AND = „a zároveň“.",
  },
  networking: {
    id: "cp-net",
    question: "DNS prekladá…",
    options: [
      "meno webu na IP adresu",
      "heslo na bit",
      "RAM na disk",
      "HTML na CSS",
    ],
    correctIndex: 0,
    explanation: "DNS je telefónny zoznam internetu.",
  },
  programming: {
    id: "cp-prog",
    question: "Cyklus v programe…",
    options: [
      "opakuje príkazy",
      "maže disk",
      "vypína router",
      "kreslí len 3D",
    ],
    correctIndex: 0,
    explanation: "Cyklus opakuje blok kódu daný počet krát alebo kým platí podmienka.",
  },
  security: {
    id: "cp-sec",
    question: "Znak phishingu je často…",
    options: [
      "nátlak a žiadosť o heslo cez cudzí odkaz",
      "oficiálny mail bez odkazu",
      "správa od učiteľa o úlohe",
      "novinky z knižnice",
    ],
    correctIndex: 0,
    explanation: "Podozrivý nátlak + žiadosť o údaje = pozor.",
  },
  "files-and-folders": {
    id: "cp-files",
    question: "Prípona .mp3 najčastejšie znamená…",
    options: ["hudbu / zvuk", "obrázok", "tabuľku", "procesor"],
    correctIndex: 0,
    explanation: "Prípona napovedá typ súboru.",
  },
  algorithms: {
    id: "cp-algo",
    question: "Bubble sort robí čo?",
    options: [
      "Porovnáva susedov a vymieňa ich, ak sú naopak",
      "Maže najväčšie číslo",
      "Posiela pakety",
      "Šifruje heslo",
    ],
    correctIndex: 0,
    explanation: "Jednoduché triedenie výmenou susedov.",
  },
  databases: {
    id: "cp-db",
    question: "WHERE v dopyte…",
    options: [
      "filtruje riadky podľa podmienky",
      "mení farbu monitora",
      "vypína Wi‑Fi",
      "pridáva RAM",
    ],
    correctIndex: 0,
    explanation: "WHERE = „len tie riadky, kde platí…“.",
  },
  "web-and-html": {
    id: "cp-web",
    question: "CSS určuje predovšetkým…",
    options: ["vzhľad stránky", "IP adresu", "veľkosť disku", "heslo"],
    correctIndex: 0,
    explanation: "HTML = štruktúra, CSS = vzhľad, JS = správanie.",
  },
  "ai-basics": {
    id: "cp-ai",
    question: "Nízka istota modelu znamená…",
    options: [
      "odpoveď radšej overiť inde",
      "že je vždy správna",
      "že treba zmazať RAM",
      "že internet nefunguje",
    ],
    correctIndex: 0,
    explanation: "Istota ≠ záruka — dôležité fakty overuj.",
  },
}
