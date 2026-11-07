"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "informatika-101-a11y-v1"

export type A11yPrefs = {
  /** Skip WebGL — show 2D schematic / text lab instead */
  lowPower: boolean
  /** Respect or force reduced motion */
  reducedMotion: boolean
}

const DEFAULTS: A11yPrefs = {
  lowPower: false,
  reducedMotion: false,
}

function readPrefs(): A11yPrefs {
  if (typeof window === "undefined") return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

export function useA11yPrefs() {
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULTS)
  const [systemReduced, setSystemReduced] = useState(false)

  useEffect(() => {
    setPrefs(readPrefs())
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setSystemReduced(mq.matches)
    const onChange = () => setSystemReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  function update(partial: Partial<A11yPrefs>) {
    setPrefs((prev) => {
      const next = { ...prev, ...partial }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const reduceMotion = prefs.reducedMotion || systemReduced

  return {
    prefs,
    update,
    reduceMotion,
    lowPower: prefs.lowPower,
  }
}
