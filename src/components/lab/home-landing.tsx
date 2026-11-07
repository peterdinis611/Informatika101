"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, MousePointer2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ConfettiOnView } from "@/components/lab/confetti"
import { useSceneLoadingLock } from "@/components/lab/scene-loading"
import { LESSONS } from "@/data/lessons"
import { lessonPath } from "@/lib/routes"
import { useProgressStore } from "@/lib/store"

const HomeSceneCanvas = dynamic(
  () =>
    import("@/components/lab/home-scene-canvas").then((m) => m.HomeSceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[var(--land-hero)]" aria-hidden />
    ),
  }
)

const STEPS = [
  {
    n: "01",
    title: "Klikni na diel",
    body: "Každý blok v 3D je súčasť počítača. Otvoríš detail a priblíženie.",
  },
  {
    n: "02",
    title: "Skladaj a skúšaj",
    body: "Pridávaš alebo berieš diely. Čo nie je na stole, v labe neexistuje.",
  },
  {
    n: "03",
    title: "Sleduj tok dát",
    body: "Vstup → procesor → pamäť → výstup. Vidíš, kadiaľ idú bity.",
  },
  {
    n: "04",
    title: "Tri otázky",
    body: "Krátky kvíz. Odznak ostane v prehliadači. Účet nepotrebuješ.",
  },
]

export function HomeLanding({ firstLessonId }: { firstLessonId: string }) {
  const completed = useProgressStore((s) => s.completedLessons)
  const [hydrated, setHydrated] = useState(false)
  const [hero3d, setHero3d] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [activeLesson, setActiveLesson] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const spotlight = useRef<HTMLDivElement>(null)

  // Hold fullscreen spinner until Canvas3D paints (covers idle delay + WebGL init).
  useSceneLoadingLock(!sceneReady, "Načítavam 3D scénu…")

  useEffect(() => setHydrated(true), [])

  useEffect(() => {
    let cancelled = false
    const run = () => {
      if (!cancelled) setHero3d(true)
    }
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(run, { timeout: 900 })
    } else {
      timeoutId = setTimeout(run, 280)
    }
    return () => {
      cancelled = true
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [])

  // Soft spotlight that follows the pointer in the hero
  useEffect(() => {
    const hero = heroRef.current
    const spot = spotlight.current
    if (!hero || !spot) return

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 100
      const y = ((e.clientY - r.top) / r.height) * 100
      spot.style.background = `radial-gradient(420px circle at ${x}% ${y}%, rgba(45,212,191,0.18), transparent 55%)`
    }
    hero.addEventListener("pointermove", onMove, { passive: true })
    return () => hero.removeEventListener("pointermove", onMove)
  }, [])

  const next = LESSONS.find((l) => !completed.includes(l.id)) ?? LESSONS[0]
  const startHref = lessonPath(hydrated ? next : firstLessonId)
  const doneCount = hydrated ? completed.length : 0
  const startLabel =
    hydrated && completed.length > 0
      ? `Pokračovať · ${next.shortTitle}`
      : "Začať prvú lekciu"
  const featured = LESSONS[activeLesson] ?? LESSONS[0]

  return (
    <div className="landing min-h-dvh">
      <ConfettiOnView />

      <section
        ref={heroRef}
        className="relative isolate min-h-dvh overflow-hidden bg-[var(--land-hero)]"
      >
        <div className="absolute inset-0 z-0">
          {hero3d ? (
            <HomeSceneCanvas
              cameraPosition={[5.8, 4.2, 5.6]}
              exploded
              onReady={() => setSceneReady(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--land-hero)]" aria-hidden />
          )}
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: "var(--land-wash)" }}
          aria-hidden
        />
        <div
          ref={spotlight}
          className="pointer-events-none absolute inset-0 z-10 mix-blend-screen transition-[background] duration-150"
          aria-hidden
        />

        <div className="relative z-20 flex min-h-dvh flex-col">
          <header className="flex items-center justify-between gap-4 px-5 pt-5 md:px-8 md:pt-7">
            <p className="font-heading text-[13px] font-bold uppercase tracking-[0.22em] text-[var(--land-ink)]/55">
              Informatika · SK
            </p>
            <nav
              aria-label="Hlavná navigácia"
              className="flex items-center gap-1 rounded-full px-1 py-1 text-[14px] font-semibold shadow-sm backdrop-blur-sm"
              style={{ background: "var(--land-nav)" }}
            >
              <a
                href="#ako"
                className="rounded-full px-3 py-1.5 transition hover:bg-[var(--land-ink)]/8"
              >
                Ako
              </a>
              <a
                href="#lessons"
                className="rounded-full px-3 py-1.5 transition hover:bg-[var(--land-ink)]/8"
              >
                Lekcie
              </a>
              <Link
                href={startHref}
                className="rounded-full px-3 py-1.5 transition hover:bg-[var(--land-ink)]/8"
              >
                Štart
              </Link>
              <ThemeToggle />
            </nav>
          </header>

          <div className="mt-auto flex max-w-xl flex-col px-5 pb-8 pt-8 md:px-8 md:pb-12">
            <p className="landing-reveal font-heading text-[clamp(2.2rem,6.2vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-[var(--land-ink)]">
              informatika{" "}
              <span className="text-[var(--land-accent)]">101</span>
            </p>

            <h1 className="landing-reveal landing-d1 mt-4 font-heading text-[clamp(1.15rem,2.4vw,1.55rem)] font-semibold leading-snug tracking-[-0.02em] text-[var(--land-ink)]">
              Otvor počítač. Nie slidy.
            </h1>
            <p className="landing-reveal landing-d1 mt-2 max-w-[34ch] text-[15px] leading-relaxed text-[var(--land-muted)]">
              {LESSONS.length} voľných 3D lekcií po slovensky — hardvér, bity,
              sieť, kód.
            </p>

            <div className="landing-reveal landing-d2 mt-5 flex flex-wrap items-center gap-3">
              <Link href={startHref} className="landing-cta group">
                {startLabel}
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
              <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--land-muted)]">
                <MousePointer2 className="size-3.5" />
                Ťahaj scénu · klikni diely v labe
              </p>
              {doneCount > 0 && (
                <p className="text-[13px] font-medium text-[var(--land-muted)]">
                  {doneCount}/{LESSONS.length} hotových
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="ako"
        className="scroll-mt-4 border-t border-[var(--land-ink)]/10 bg-[var(--land-panel)] px-5 py-20 md:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <p className="font-heading text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--land-accent)]">
            Postup
          </p>
          <h2 className="mt-2 max-w-[16ch] font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Štyri kroky. Žiadne slidy.
          </h2>

          <ol className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li key={step.n} className="landing-step relative">
                <span className="font-mono text-[13px] font-semibold text-[var(--land-accent)]">
                  {step.n}
                </span>
                <h3 className="mt-2 font-heading text-[1.15rem] font-bold tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--land-muted)]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Interactive preview — no second WebGL */}
      <section className="border-t border-white/10 bg-[var(--land-deep)] px-5 py-16 text-[var(--land-deep-ink)] md:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="font-heading text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--land-accent)]">
              Náhľad
            </p>
            <h2 className="mt-2 font-heading text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold leading-tight tracking-[-0.03em]">
              Vyber lekciu. Hneď vieš, čo ťa čaká.
            </h2>
            <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-[var(--land-deep-muted)]">
              Prejdi myšou po číslach — vpravo sa mení popis. Klik otvorí lab.
            </p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {LESSONS.map((lesson, i) => {
                const done = hydrated && completed.includes(lesson.id)
                const on = i === activeLesson
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onMouseEnter={() => setActiveLesson(i)}
                    onFocus={() => setActiveLesson(i)}
                    onClick={() => setActiveLesson(i)}
                    aria-pressed={on}
                    className={`flex size-9 items-center justify-center rounded-lg font-mono text-[12px] font-bold transition ${
                      on
                        ? "bg-[var(--land-accent)] text-[#042f2e] shadow-[2px_2px_0_rgba(0,0,0,0.35)]"
                        : done
                          ? "bg-[var(--land-accent)]/20 text-[var(--land-accent)]"
                          : "bg-white/5 text-[var(--land-deep-muted)] hover:bg-white/10 hover:text-[var(--land-deep-ink)]"
                    }`}
                    title={lesson.title}
                  >
                    {lesson.order}
                  </button>
                )
              })}
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border border-white/10 p-6 transition-[box-shadow] duration-300"
            style={{
              background: `linear-gradient(145deg, ${featured.accent}22, transparent 55%), var(--land-deep-panel)`,
              boxShadow: `0 0 0 1px ${featured.accent}33, 0 18px 40px rgba(0,0,0,0.25)`,
            }}
          >
            <p className="font-mono text-[12px] font-bold text-[var(--land-accent)]">
              {String(featured.order).padStart(2, "0")} · {featured.badge}
            </p>
            <h3 className="mt-3 font-heading text-[1.65rem] font-bold tracking-[-0.02em]">
              {featured.title}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--land-deep-muted)]">
              {featured.description}
            </p>
            <p className="mt-4 text-[13px] font-medium text-[var(--land-deep-ink)]/85">
              Úloha: {featured.task}
            </p>
            <Link
              href={lessonPath(featured)}
              className="landing-cta landing-cta-invert mt-6 inline-flex"
            >
              Otvoriť lab
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="lessons"
        className="scroll-mt-4 border-t border-white/10 bg-[var(--land-deep)] px-5 py-16 text-[var(--land-deep-ink)] md:px-8 md:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-heading text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--land-accent)]">
                Osnova
              </p>
              <h2 className="mt-2 font-heading text-[clamp(1.85rem,4vw,2.75rem)] font-bold leading-[0.95] tracking-[-0.03em]">
                {LESSONS.length} lekcií · jedna cesta
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <p className="font-mono text-[12px] font-semibold text-[var(--land-accent)]">
                {doneCount}/{LESSONS.length} hotových
              </p>
              <Link href={startHref} className="landing-cta landing-cta-invert">
                {startLabel}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <ol className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {LESSONS.map((lesson, i) => {
              const done = hydrated && completed.includes(lesson.id)
              return (
                <li key={lesson.id} className="bg-[var(--land-deep-panel)]">
                  <Link
                    href={lessonPath(lesson)}
                    prefetch={i < 3}
                    onMouseEnter={() => setActiveLesson(i)}
                    className="landing-lesson group relative flex h-full min-h-[6rem] flex-col justify-between gap-3 p-4"
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-1 opacity-90 transition group-hover:w-1.5"
                      style={{ background: lesson.accent }}
                      aria-hidden
                    />
                    <div className="flex items-start justify-between gap-2 pl-2.5">
                      <span className="font-mono text-[11px] font-bold text-[var(--land-accent)]">
                        {String(lesson.order).padStart(2, "0")}
                      </span>
                      {done ? (
                        <span className="rounded-full bg-[var(--land-accent)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--land-accent)]">
                          hotovo
                        </span>
                      ) : (
                        <ArrowUpRight className="size-3.5 text-white/25 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--land-accent)]" />
                      )}
                    </div>
                    <div className="pl-2.5">
                      <p className="font-heading text-[16px] font-bold leading-snug tracking-[-0.02em]">
                        {lesson.shortTitle}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[var(--land-deep-muted)]">
                        {lesson.description}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="border-t border-[var(--land-ink)]/10 bg-[var(--land-accent)] px-5 py-20 text-[#f0fffc] md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[0.95] tracking-[-0.03em]">
              Všetky lekcie
              <br />
              sú voľné.
            </h2>
            <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-[#f0fffc]/85">
              {LESSONS[0].task} Účet nepotrebuješ — postup ostane v tomto
              prehliadači.
            </p>
          </div>
          <Link
            href={startHref}
            className="landing-cta landing-cta-invert shrink-0"
          >
            {startLabel}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer
        id="koniec"
        className="flex flex-wrap items-center justify-between gap-4 bg-[var(--land-deep)] px-5 py-8 text-[13px] text-[var(--land-deep-muted)] md:px-8"
      >
        <p>
          informatika 101 · {LESSONS.length} lekcií · zadarmo
        </p>
        <Link
          href={startHref}
          className="font-semibold text-[var(--land-accent)] hover:underline"
        >
          {startLabel}
        </Link>
      </footer>
    </div>
  )
}
