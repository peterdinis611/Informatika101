"use client"

/**
 * Inspect state lives in zustand (`inspect-store`) so it works both
 * outside and inside the R3F Canvas (separate React roots).
 */
export type { InspectTarget } from "@/lib/inspect-store"
export { useInspectStore as useInspect } from "@/lib/inspect-store"
