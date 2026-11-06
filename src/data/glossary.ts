export type GlossaryTerm = {
  term: string
  definition: string
  lessonId?: string
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Bit",
    definition: "Najmenšia jednotka informácie. Má hodnotu 0 alebo 1.",
    lessonId: "bits-and-bytes",
  },
  {
    term: "Bajt",
    definition: "Skupina 8 bitov. Často reprezentuje jedno písmeno alebo malé číslo.",
    lessonId: "bits-and-bytes",
  },
  {
    term: "CPU / Procesor",
    definition: "„Mozog“ počítača. Vykonáva inštrukcie v cykle načítaj–dekóduj–vykonaj.",
    lessonId: "cpu",
  },
  {
    term: "RAM",
    definition: "Rýchla dočasná pamäť. Po vypnutí sa obsah stratí.",
    lessonId: "memory",
  },
  {
    term: "Disk / SSD",
    definition: "Trvalé úložisko súborov. Údaje ostanú aj po vypnutí.",
    lessonId: "memory",
  },
  {
    term: "Operačný systém (OS)",
    definition: "Softvér, ktorý riadi hardvér a umožňuje spúšťať programy.",
    lessonId: "operating-system",
  },
  {
    term: "Proces",
    definition: "Bežiaca inštancia programu v operačnom systéme.",
    lessonId: "operating-system",
  },
  {
    term: "Hradlo AND",
    definition: "Výstup je 1 len keď sú oba vstupy 1.",
    lessonId: "logic-gates",
  },
  {
    term: "Hradlo OR",
    definition: "Výstup je 1, ak je aspoň jeden vstup 1.",
    lessonId: "logic-gates",
  },
  {
    term: "Hradlo NOT",
    definition: "Otočí vstup: 0→1, 1→0.",
    lessonId: "logic-gates",
  },
  {
    term: "IP adresa",
    definition: "Číselná adresa zariadenia v sieti (ako číslo domu).",
    lessonId: "networking",
  },
  {
    term: "DNS",
    definition: "Služba, ktorá prekladá mená webov na IP adresy.",
    lessonId: "networking",
  },
  {
    term: "Paket",
    definition: "Malý balík dát putujúci po sieti.",
    lessonId: "networking",
  },
  {
    term: "Premenná",
    definition: "Pomenované miesto na uloženie hodnoty v programe.",
    lessonId: "programming",
  },
  {
    term: "Podmienka",
    definition: "Príkaz typu „ak platí X, urob Y“.",
    lessonId: "programming",
  },
  {
    term: "Cyklus",
    definition: "Opakovanie príkazov, kým platí podmienka alebo daný počet krát.",
    lessonId: "programming",
  },
  {
    term: "Malvér",
    definition: "Škodlivý softvér (vírusy, ransomware…).",
    lessonId: "security",
  },
  {
    term: "Šifrovanie",
    definition: "Premena údajov tak, aby ich bez kľúča nebolo možné prečítať.",
    lessonId: "security",
  },
  {
    term: "ASCII",
    definition: "Tabuľka, ktorá priraďuje čísla písmenám a znakom.",
    lessonId: "bits-and-bytes",
  },
  {
    term: "Hardvér",
    definition: "Fyzické súčasti počítača — to, na čo môžeš siahnuť.",
    lessonId: "hardware",
  },
  {
    term: "Súbor",
    definition: "Pomenovaný balík dát. Prípona (.png, .docx) napovie typ.",
    lessonId: "files-and-folders",
  },
  {
    term: "Algoritmus",
    definition: "Presný postup krokov na vyriešenie úlohy.",
    lessonId: "algorithms",
  },
  {
    term: "Databáza",
    definition: "Usporiadané údaje v tabuľkách. Riadok = záznam, stĺpec = vlastnosť.",
    lessonId: "databases",
  },
  {
    term: "HTML",
    definition: "Jazyk štruktúry webovej stránky — nadpisy, odseky, odkazy.",
    lessonId: "web-and-html",
  },
  {
    term: "Umelá inteligencia",
    definition: "Systém, ktorý hľadá vzory v dátach a predvída. Vie sa mýliť.",
    lessonId: "ai-basics",
  },
]
