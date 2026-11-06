"use client"

import type { ThreeEvent } from "@react-three/fiber"
import { useTheme } from "next-themes"
import { ToonBox } from "@/components/scenes/toon"
import * as THREE from "three"

export function useLabFloorColor(light = "#e8d5b5", dark = "#5a4530") {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === "dark" ? dark : light
}

export function InkCyl({
  args,
  position,
  rotation,
  color,
}: {
  args: [number, number, number] | [number, number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  color: string
}) {
  const r = args[0]
  const h = args[2] ?? args[1]
  const rBottom = args[1]
  const segs = typeof args[3] === "number" ? args[3] : 16
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[r * 1.12, rBottom * 1.12, h * 1.04, segs]} />
        <meshBasicMaterial color="#0b1f3a" side={THREE.BackSide} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[r, rBottom, h, segs]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

type Clickable = {
  selected?: boolean
  onClick?: (e: ThreeEvent<MouseEvent>) => void
}

/** Compact desk keyboard + optical mouse. */
export function KeyboardAndMouse({
  selected,
  onClick,
}: Clickable) {
  const rows = [
    { z: -0.22, offset: 0, count: 13, w: 0.1 },
    { z: -0.08, offset: 0.04, count: 12, w: 0.1 },
    { z: 0.06, offset: 0.08, count: 11, w: 0.1 },
  ]
  return (
    <group>
      <ToonBox
        args={[1.88, 0.08, 0.72]}
        position={[0, 0.05, 0.06]}
        color="#334155"
        radius={0.05}
        selected={selected}
        onClick={onClick}
      />
      <ToonBox
        args={[1.78, 0.04, 0.62]}
        position={[0, 0.1, 0.06]}
        color="#1e293b"
        radius={0.03}
      />
      {rows.map((row, ri) =>
        Array.from({ length: row.count }).map((_, c) => {
          const wasd = ri === 1 && c >= 1 && c <= 3
          return (
            <ToonBox
              key={`${ri}-${c}`}
              args={[row.w, 0.06, 0.1]}
              position={[
                -0.78 + row.offset + c * 0.125,
                0.16,
                row.z,
              ]}
              color={wasd ? "#38bdf8" : "#f1f5f9"}
              radius={0.018}
            />
          )
        })
      )}
      <ToonBox args={[0.22, 0.06, 0.1]} position={[-0.72, 0.16, 0.2]} color="#cbd5e1" radius={0.018} />
      <ToonBox args={[0.85, 0.06, 0.1]} position={[0.02, 0.16, 0.2]} color="#f8fafc" radius={0.02} />
      <ToonBox args={[0.28, 0.06, 0.1]} position={[0.72, 0.16, 0.2]} color="#e23d2a" radius={0.018} />
      <ToonBox
        args={[0.08, 0.04, 0.55]}
        position={[-0.98, 0.08, -0.35]}
        color="#64748b"
        radius={0.02}
      />

      <ToonBox
        args={[0.32, 0.08, 0.42]}
        position={[1.18, 0.08, 0]}
        color="#e2e8f0"
        radius={0.1}
        selected={selected}
        onClick={onClick}
      />
      <ToonBox args={[0.28, 0.06, 0.22]} position={[1.18, 0.14, -0.08]} color="#f8fafc" radius={0.08} />
      <ToonBox args={[0.12, 0.03, 0.16]} position={[1.1, 0.18, -0.12]} color="#94a3b8" radius={0.02} />
      <ToonBox args={[0.12, 0.03, 0.16]} position={[1.26, 0.18, -0.12]} color="#94a3b8" radius={0.02} />
      <InkCyl
        args={[0.028, 0.028, 0.09, 10]}
        position={[1.18, 0.18, 0.02]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#1e293b"
      />
      <InkCyl
        args={[0.05, 0.05, 0.03, 12]}
        position={[1.18, 0.02, 0.12]}
        color="#ef4444"
      />
    </group>
  )
}

/** LGA-style CPU: substrate, nickel IHS, gold pin grid. */
export function CpuChip({ selected, onClick, scale = 1 }: Clickable & { scale?: number }) {
  const pins: React.ReactNode[] = []
  for (let x = -5; x <= 5; x++) {
    for (let z = -5; z <= 5; z++) {
      if (Math.abs(x) < 3 && Math.abs(z) < 3) continue
      pins.push(
        <ToonBox
          key={`${x}-${z}`}
          args={[0.035, 0.045, 0.035]}
          position={[x * 0.068, -0.05, z * 0.068]}
          color="#facc15"
          radius={0.006}
        />
      )
    }
  }
  return (
    <group scale={scale}>
      <ToonBox
        args={[0.92, 0.07, 0.92]}
        position={[0, 0.03, 0]}
        color="#292524"
        radius={0.03}
        selected={selected}
        onClick={onClick}
      />
      <ToonBox
        args={[0.68, 0.08, 0.68]}
        position={[0, 0.1, 0]}
        color="#d6d3d1"
        radius={0.02}
      />
      <ToonBox
        args={[0.52, 0.03, 0.52]}
        position={[0, 0.15, 0]}
        color="#a8a29e"
        radius={0.015}
      />
      <ToonBox
        args={[0.16, 0.02, 0.16]}
        position={[0, 0.175, 0]}
        color="#1e293b"
        radius={0.01}
      />
      <ToonBox
        args={[0.1, 0.035, 0.1]}
        position={[-0.34, 0.1, -0.34]}
        color="#eab308"
        radius={0.012}
      />
      {[-0.28, 0.28].map((x) =>
        [-0.28, 0.28].map((z) => (
          <InkCyl
            key={`${x}${z}`}
            args={[0.03, 0.03, 0.04, 8]}
            position={[x, 0.08, z]}
            color="#78716c"
          />
        ))
      )}
      {pins}
    </group>
  )
}

/** DIMM stick: green PCB, chips, gold fingers. */
export function RamStick({
  selected,
  onClick,
  rotation,
}: Clickable & { rotation?: [number, number, number] }) {
  return (
    <group rotation={rotation}>
      <ToonBox
        args={[0.08, 0.72, 1.05]}
        color="#15803d"
        radius={0.02}
        selected={selected}
        onClick={onClick}
      />
      {[-0.36, -0.18, 0, 0.18, 0.36].map((z) => (
        <ToonBox
          key={z}
          args={[0.05, 0.22, 0.16]}
          position={[0.05, 0.12, z]}
          color="#0f172a"
          radius={0.015}
        />
      ))}
      <ToonBox
        args={[0.05, 0.1, 1.02]}
        position={[0, -0.34, 0]}
        color="#eab308"
        radius={0.01}
      />
      <ToonBox
        args={[0.09, 0.12, 0.08]}
        position={[0, -0.28, -0.12]}
        color="#15803d"
        radius={0.01}
      />
    </group>
  )
}

/** 2.5" SSD with SATA connector. */
export function SsdDrive({ selected, onClick }: Clickable) {
  return (
    <group>
      <ToonBox
        args={[1.15, 0.12, 0.72]}
        color="#334155"
        radius={0.03}
        selected={selected}
        onClick={onClick}
      />
      <ToonBox
        args={[0.7, 0.04, 0.42]}
        position={[0.05, 0.08, 0]}
        color="#1e293b"
        radius={0.02}
      />
      <ToonBox
        args={[0.38, 0.05, 0.18]}
        position={[-0.42, 0, 0.18]}
        color="#eab308"
        radius={0.01}
      />
      <ToonBox
        args={[0.22, 0.05, 0.12]}
        position={[-0.48, 0, -0.18]}
        color="#64748b"
        radius={0.01}
      />
      {[-0.4, 0.4].map((x) =>
        [-0.24, 0.24].map((z) => (
          <InkCyl
            key={`${x}${z}`}
            args={[0.035, 0.035, 0.03, 10]}
            position={[x, 0.08, z]}
            color="#94a3b8"
          />
        ))
      )}
    </group>
  )
}

/** Flat desktop monitor: thin bezel, desktop UI, C-stand. */
export function Monitor({ selected, onClick }: Clickable) {
  return (
    <group>
      <ToonBox
        args={[0.78, 0.05, 0.48]}
        position={[0, 0.03, 0.12]}
        color="#1e293b"
        radius={0.03}
      />
      <ToonBox
        args={[0.14, 0.62, 0.1]}
        position={[0, 0.36, 0.04]}
        color="#334155"
        radius={0.03}
      />
      <ToonBox
        args={[1.72, 1.08, 0.1]}
        position={[0, 1.08, -0.04]}
        color="#0f172a"
        radius={0.04}
        selected={selected}
        onClick={onClick}
      />
      <ToonBox
        args={[1.58, 0.9, 0.04]}
        position={[0, 1.1, 0.03]}
        color="#7dd3fc"
        radius={0.015}
        emissiveIntensity={0.4}
      />
      <ToonBox
        args={[1.58, 0.28, 0.03]}
        position={[0, 1.4, 0.055]}
        color="#38bdf8"
        radius={0.01}
        emissiveIntensity={0.25}
      />
      <ToonBox
        args={[0.62, 0.42, 0.03]}
        position={[-0.28, 1.12, 0.07]}
        color="#ffffff"
        radius={0.02}
      />
      <ToonBox
        args={[0.48, 0.26, 0.03]}
        position={[0.42, 0.98, 0.07]}
        color="#fbbf24"
        radius={0.02}
      />
      <ToonBox
        args={[1.58, 0.1, 0.03]}
        position={[0, 0.7, 0.07]}
        color="#1d4ed8"
        radius={0.01}
      />
      <InkCyl args={[0.025, 0.025, 0.04, 10]} position={[0, 1.64, 0]} color="#64748b" />
      <InkCyl args={[0.02, 0.02, 0.03, 8]} position={[0.72, 0.58, 0.06]} color="#22c55e" />
    </group>
  )
}

/** Mid-tower PC case with front I/O and a side window. */
export function PcCase({ selected, onClick }: Clickable) {
  return (
    <group>
      <ToonBox
        args={[1.15, 2.35, 2.05]}
        color="#1e293b"
        radius={0.05}
        selected={selected}
        onClick={onClick}
      />
      {/* side window */}
      <ToonBox
        args={[0.04, 1.7, 1.45]}
        position={[0.58, 0.05, 0.05]}
        color="#7dd3fc"
        radius={0.02}
        emissiveIntensity={0.2}
      />
      {/* front mesh */}
      <ToonBox
        args={[0.95, 1.35, 0.06]}
        position={[0, -0.15, 1.05]}
        color="#334155"
        radius={0.03}
      />
      {[0.28, 0, -0.28].map((y) => (
        <ToonBox
          key={y}
          args={[0.72, 0.06, 0.04]}
          position={[0, y - 0.15, 1.09]}
          color="#64748b"
          radius={0.01}
        />
      ))}
      <InkCyl
        args={[0.07, 0.07, 0.05, 12]}
        position={[-0.28, 0.95, 1.06]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#22c55e"
      />
      <ToonBox
        args={[0.28, 0.08, 0.05]}
        position={[0.18, 0.95, 1.06]}
        color="#0ea5e9"
        radius={0.015}
      />
      <ToonBox
        args={[0.18, 0.05, 0.05]}
        position={[0.18, 0.82, 1.06]}
        color="#eab308"
        radius={0.01}
      />
    </group>
  )
}

/** ATX motherboard with socket, RAM slots, PCIe. */
export function Motherboard({ selected, onClick }: Clickable) {
  return (
    <group>
      <ToonBox
        args={[1.85, 0.07, 1.55]}
        color="#166534"
        radius={0.03}
        selected={selected}
        onClick={onClick}
      />
      {/* traces */}
      <ToonBox args={[1.4, 0.01, 0.04]} position={[0, 0.04, 0.2]} color="#4ade80" radius={0.005} />
      <ToonBox args={[0.04, 0.01, 0.9]} position={[-0.35, 0.04, -0.1]} color="#4ade80" radius={0.005} />
      {/* CPU socket */}
      <ToonBox args={[0.48, 0.06, 0.48]} position={[-0.35, 0.08, 0.15]} color="#a8a29e" radius={0.02} />
      <ToonBox args={[0.32, 0.04, 0.32]} position={[-0.35, 0.12, 0.15]} color="#eab308" radius={0.01} />
      {/* RAM slots */}
      {[0.28, 0.42, 0.56, 0.7].map((x) => (
        <ToonBox
          key={x}
          args={[0.08, 0.16, 0.95]}
          position={[x, 0.12, 0.05]}
          color={x === 0.28 || x === 0.56 ? "#1d4ed8" : "#0f172a"}
          radius={0.015}
        />
      ))}
      {/* PCIe */}
      <ToonBox args={[1.15, 0.08, 0.12]} position={[-0.05, 0.08, -0.55]} color="#4338ca" radius={0.015} />
      {/* chipset */}
      <ToonBox args={[0.28, 0.08, 0.28]} position={[-0.15, 0.08, -0.18]} color="#1e293b" radius={0.02} />
      {/* I/O ports */}
      <ToonBox args={[0.12, 0.18, 0.7]} position={[-0.92, 0.12, 0.2]} color="#eab308" radius={0.02} />
      <ToonBox args={[0.08, 0.1, 0.12]} position={[-0.92, 0.16, 0.42]} color="#0ea5e9" radius={0.01} />
      <ToonBox args={[0.08, 0.1, 0.12]} position={[-0.92, 0.16, 0.22]} color="#f97316" radius={0.01} />
      <ToonBox args={[0.08, 0.1, 0.12]} position={[-0.92, 0.16, 0.02]} color="#22c55e" radius={0.01} />
    </group>
  )
}

/** ATX power supply with fan and cables. */
export function PowerSupply({ selected, onClick }: Clickable) {
  return (
    <group>
      <ToonBox
        args={[1.45, 0.58, 0.85]}
        color="#334155"
        radius={0.04}
        selected={selected}
        onClick={onClick}
      />
      <InkCyl
        args={[0.28, 0.28, 0.06, 18]}
        position={[0.35, 0.12, 0.44]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#64748b"
      />
      <InkCyl
        args={[0.08, 0.08, 0.05, 10]}
        position={[0.35, 0.12, 0.46]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#1e293b"
      />
      <ToonBox args={[0.22, 0.16, 0.08]} position={[-0.5, 0.05, 0.44]} color="#0f172a" radius={0.02} />
      {[
        ["#facc15", -0.35],
        ["#ef4444", -0.18],
        ["#1e293b", -0.01],
        ["#22c55e", 0.16],
      ].map(([c, x]) => (
        <ToonBox
          key={String(x)}
          args={[0.08, 0.08, 0.45]}
          position={[Number(x), 0.08, -0.55]}
          color={String(c)}
          radius={0.02}
        />
      ))}
    </group>
  )
}

/** Graphics card with dual fans and display ports. */
export function GpuCard({ selected, onClick }: Clickable) {
  return (
    <group>
      <ToonBox
        args={[1.85, 0.1, 0.55]}
        position={[0, -0.08, 0]}
        color="#15803d"
        radius={0.02}
        selected={selected}
        onClick={onClick}
      />
      <ToonBox
        args={[1.55, 0.38, 0.58]}
        position={[-0.05, 0.16, 0]}
        color="#0f172a"
        radius={0.04}
      />
      {[-0.32, 0.28].map((x) => (
        <InkCyl
          key={x}
          args={[0.2, 0.2, 0.08, 16]}
          position={[x, 0.22, 0.22]}
          rotation={[Math.PI / 2, 0, 0]}
          color="#64748b"
        />
      ))}
      <ToonBox
        args={[0.12, 0.22, 0.48]}
        position={[-0.92, 0.05, 0]}
        color="#334155"
        radius={0.02}
      />
      {[-0.14, 0, 0.14].map((z) => (
        <ToonBox
          key={z}
          args={[0.06, 0.08, 0.08]}
          position={[-0.96, 0.08, z]}
          color="#0ea5e9"
          radius={0.01}
        />
      ))}
      <ToonBox
        args={[0.08, 0.06, 0.52]}
        position={[0.55, -0.14, 0]}
        color="#eab308"
        radius={0.01}
      />
    </group>
  )
}

export function Desk() {
  const top = useLabFloorColor("#e8d5b5", "#5a4530")
  const edge = useLabFloorColor("#c4a574", "#3d2e1f")
  return (
    <group>
      <ToonBox
        args={[9.2, 0.16, 4.2]}
        position={[0, -0.58, 0]}
        color={edge}
        radius={0.05}
      />
      <ToonBox
        args={[8.7, 0.04, 3.75]}
        position={[0, -0.48, 0]}
        color={top}
        radius={0.03}
      />
    </group>
  )
}
