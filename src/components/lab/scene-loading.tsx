"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { LabSpinner } from "@/components/lab/lab-spinner"

type SceneLoadingApi = {
  /** Keep a fullscreen spinner up until the returned release() runs. */
  acquire: (label?: string) => () => void
  busy: boolean
}

const SceneLoadingContext = createContext<SceneLoadingApi | null>(null)

let tokenSeq = 0

export function SceneLoadingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [tokens, setTokens] = useState<Map<number, string>>(() => new Map())

  const acquire = useCallback((label = "Načítavam 3D scénu…") => {
    const id = ++tokenSeq
    setTokens((prev) => {
      const next = new Map(prev)
      next.set(id, label)
      return next
    })
    return () => {
      setTokens((prev) => {
        if (!prev.has(id)) return prev
        const next = new Map(prev)
        next.delete(id)
        return next
      })
    }
  }, [])

  const busy = tokens.size > 0
  const label = useMemo(() => {
    const first = tokens.values().next()
    return first.value ?? "Načítavam 3D scénu…"
  }, [tokens])

  const api = useMemo(() => ({ acquire, busy }), [acquire, busy])

  return (
    <SceneLoadingContext.Provider value={api}>
      {children}
      {busy && (
        <div
          className="lab-wash fixed inset-0 z-[200] flex items-center justify-center"
          role="alertdialog"
          aria-modal="true"
          aria-busy="true"
          aria-label={label}
        >
          <LabSpinner label={label} />
        </div>
      )}
    </SceneLoadingContext.Provider>
  )
}

export function useSceneLoading() {
  const ctx = useContext(SceneLoadingContext)
  if (!ctx) {
    throw new Error("useSceneLoading must be used within SceneLoadingProvider")
  }
  return ctx
}

/**
 * While `active` is true, keeps the app-wide spinner visible.
 * Safe no-op outside the provider (e.g. rare edge cases).
 */
export function useSceneLoadingLock(active: boolean, label?: string) {
  const ctx = useContext(SceneLoadingContext)
  const labelRef = useRef(label)
  labelRef.current = label

  useEffect(() => {
    if (!active || !ctx) return
    return ctx.acquire(labelRef.current)
  }, [active, ctx])
}
