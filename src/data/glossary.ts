export type GlossaryTerm = {
  id: string
  term: string
  definition: string
  lessonId?: string
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "bit",
    term: "Bit",
    definition: "Najmenšia jednotka informácie. Má hodnotu 0 alebo 1.",
    lessonId: "bits-and-bytes",
  },
  {
    id: "bajt",
    term: "Bajt",
    definition: "Skupina 8 bitov. Často reprezentuje jedno písmeno alebo malé číslo.",
    lessonId: "bits-and-bytes",
  },
  {
    id: "cpu",
    term: "CPU / Procesor",
    definition: "„Mozog“ počítača. Vykonáva inštrukcie v cykle načítaj–dekóduj–vykonaj.",
    lessonId: "cpu",
  },
  {
    id: "ram",
    term: "RAM",
    definition: "Rýchla dočasná pamäť. Po vypnutí sa obsah stratí.",
    lessonId: "memory",
  },
  {
    id: "disk",
    term: "Disk / SSD",
    definition: "Trvalé úložisko súborov. Údaje ostanú aj po vypnutí.",
    lessonId: "memory",
  },
  {
    id: "os",
    term: "Operačný systém (OS)",
    definition: "Softvér, ktorý riadi hardvér a umožňuje spúšťať programy.",
    lessonId: "operating-system",
  },
  {
    id: "proces",
    term: "Proces",
    definition: "Bežiaca inštancia programu v operačnom systéme.",
    lessonId: "operating-system",
  },
  {
    id: "and",
    term: "Hradlo AND",
    definition: "Výstup je 1 len keď sú oba vstupy 1.",
    lessonId: "logic-gates",
  },
  {
    id: "or",
    term: "Hradlo OR",
    definition: "Výstup je 1, ak je aspoň jeden vstup 1.",
    lessonId: "logic-gates",
  },
  {
    id: "not",
    term: "Hradlo NOT",
    definition: "Otočí vstup: 0→1, 1→0.",
    lessonId: "logic-gates",
  },
  {
    id: "ip",
    term: "IP adresa",
    definition: "Číselná adresa zariadenia v sieti (ako číslo domu).",
    lessonId: "networking",
  },
  {
    id: "dns",
    term: "DNS",
    definition: "Služba, ktorá prekladá mená webov na IP adresy.",
    lessonId: "networking",
  },
  {
    id: "paket",
    term: "Paket",
    definition: "Malý balík dát putujúci po sieti.",
    lessonId: "networking",
  },
  {
    id: "premenna",
    term: "Premenná",
    definition: "Pomenované miesto na uloženie hodnoty v programe.",
    lessonId: "programming",
  },
  {
    id: "podmienka",
    term: "Podmienka",
    definition: "Príkaz typu „ak platí X, urob Y“.",
    lessonId: "programming",
  },
  {
    id: "cyklus",
    term: "Cyklus",
    definition: "Opakovanie príkazov, kým platí podmienka alebo daný počet krát.",
    lessonId: "programming",
  },
  {
    id: "malver",
    term: "Malvér",
    definition: "Škodlivý softvér (vírusy, ransomware…).",
    lessonId: "security",
  },
  {
    id: "sifrovanie",
    term: "Šifrovanie",
    definition: "Premena údajov tak, aby ich bez kľúča nebolo možné prečítať.",
    lessonId: "security",
  },
  {
    id: "phishing",
    term: "Phishing",
    definition: "Podvodná správa, ktorá ťa núti prezradiť heslo alebo kliknúť na nebezpečný odkaz.",
    lessonId: "security",
  },
  {
    id: "ascii",
    term: "ASCII",
    definition: "Tabuľka, ktorá priraďuje čísla písmenám a znakom.",
    lessonId: "bits-and-bytes",
  },
  {
    id: "hardware",
    term: "Hardvér",
    definition: "Fyzické súčasti počítača — to, na čo môžeš siahnuť.",
    lessonId: "hardware",
  },
  {
    id: "subor",
    term: "Súbor",
    definition: "Pomenovaný balík dát. Prípona (.png, .docx) napovie typ.",
    lessonId: "files-and-folders",
  },
  {
    id: "priecinok",
    term: "Priečinok",
    definition: "Kontajner, ktorý zbiera súbory a ďalšie priečinky do stromu.",
    lessonId: "files-and-folders",
  },
  {
    id: "cesta",
    term: "Cesta (path)",
    definition: "Adresa súboru v strome priečinkov, napr. /Domov/Obrázky/pes.png.",
    lessonId: "files-and-folders",
  },
  {
    id: "algoritmus",
    term: "Algoritmus",
    definition: "Presný postup krokov na vyriešenie úlohy.",
    lessonId: "algorithms",
  },
  {
    id: "bubble-sort",
    term: "Bubble sort",
    definition: "Triedenie: porovnáva susedov a vymieňa ich, kým nie je pole zoradené.",
    lessonId: "algorithms",
  },
  {
    id: "databaza",
    term: "Databáza",
    definition: "Usporiadané údaje v tabuľkách. Riadok = záznam, stĺpec = vlastnosť.",
    lessonId: "databases",
  },
  {
    id: "dopyt",
    term: "Dopyt (query)",
    definition: "Otázka na tabuľku — napr. SELECT … WHERE známka = 1.",
    lessonId: "databases",
  },
  {
    id: "html",
    term: "HTML",
    definition: "Jazyk štruktúry webovej stránky — nadpisy, odseky, odkazy.",
    lessonId: "web-and-html",
  },
  {
    id: "css",
    term: "CSS",
    definition: "Jazyk vzhľadu — farby, písmo, rozloženie stránky.",
    lessonId: "web-and-html",
  },
  {
    id: "javascript",
    term: "JavaScript",
    definition: "Jazyk správania stránky — kliky, výpočty, dynamický obsah.",
    lessonId: "web-and-html",
  },
  {
    id: "ai",
    term: "Umelá inteligencia",
    definition: "Systém, ktorý hľadá vzory v dátach a predvída. Vie sa mýliť.",
    lessonId: "ai-basics",
  },
  {
    id: "halucinacia",
    term: "Halucinácia (AI)",
    definition: "Keď model tipuje pravdepodobnú odpoveď, aj keď fakt nevie — treba overiť.",
    lessonId: "ai-basics",
  },
  {
    id: "vstup",
    term: "Vstup",
    definition: "Údaje, ktoré do počítača posielame (klávesnica, myš, mikrofon…).",
    lessonId: "what-is-a-computer",
  },
  {
    id: "vystup",
    term: "Výstup",
    definition: "Výsledok, ktorý počítač ukáže alebo prehrá (monitor, zvuk, tlač).",
    lessonId: "what-is-a-computer",
  },
]

export function getGlossaryTerm(id: string) {
  return GLOSSARY.find((t) => t.id === id)
}

export function glossaryTermsForLesson(lessonId: string) {
  return GLOSSARY.filter((t) => t.lessonId === lessonId)
}
