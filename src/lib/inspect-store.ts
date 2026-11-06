"use client"

import { create } from "zustand"

export type InspectTarget = {
  id: string
  title: string
  summary: string
  facts?: string[]
  tip?: string
  position: [number, number, number]
  offset?: [number, number, number]
}

type InspectState = {
  focused: InspectTarget | null
  focus: (target: InspectTarget) => void
  clear: () => void
}

export const useInspectStore = create<InspectState>((set) => ({
  focused: null,
  focus: (target) => set({ focused: target }),
  clear: () => set({ focused: null }),
}))

if (typeof window !== "undefined") {
  ;(window as Window & { __labInspect?: typeof useInspectStore }).__labInspect =
    useInspectStore
}
