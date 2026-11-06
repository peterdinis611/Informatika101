"use client"

import { useEffect, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useInspect } from "@/components/three/inspect-context"
import * as THREE from "three"

const DEFAULT_OFFSET: [number, number, number] = [2.4, 1.8, 2.8]

/**
 * Smoothly flies OrbitControls toward the inspected part.
 * Expects OrbitControls with makeDefault.
 */
export function CameraFocus() {
  const { focused } = useInspect()
  const { controls } = useThree() as {
    controls: {
      target: THREE.Vector3
      object: THREE.Camera & { position: THREE.Vector3 }
      update: () => void
      enabled: boolean
      minDistance: number
      maxDistance: number
    } | null
  }
  const goalTarget = useRef(new THREE.Vector3(0, 0.45, 0))
  const goalCam = useRef(new THREE.Vector3(5.8, 4.6, 5.8))
  const homeTarget = useRef(new THREE.Vector3(0, 0.45, 0))
  const homeCam = useRef(new THREE.Vector3(5.8, 4.6, 5.8))
  const savedHome = useRef(false)
  const active = useRef(false)

  useEffect(() => {
    if (!controls) return
    if (!savedHome.current) {
      homeCam.current.copy(controls.object.position)
      homeTarget.current.copy(controls.target)
      savedHome.current = true
    }

    if (focused) {
      const [ox, oy, oz] = focused.offset ?? DEFAULT_OFFSET
      const [x, y, z] = focused.position
      goalTarget.current.set(x, y, z)
      goalCam.current.set(x + ox, y + oy, z + oz)
      active.current = true
      controls.minDistance = 1.2
    } else if (active.current) {
      goalTarget.current.copy(homeTarget.current)
      goalCam.current.copy(homeCam.current)
      active.current = true
      controls.minDistance = 4
    }
  }, [focused, controls])

  useFrame((_, dt) => {
    if (!controls || !active.current) return
    const k = 1 - Math.pow(0.0004, dt)
    controls.target.lerp(goalTarget.current, k)
    controls.object.position.lerp(goalCam.current, k)
    controls.update()

    const tDone = controls.target.distanceTo(goalTarget.current) < 0.02
    const cDone = controls.object.position.distanceTo(goalCam.current) < 0.04
    if (tDone && cDone && !focused) {
      active.current = false
      controls.minDistance = 4
    }
  })

  return null
}
