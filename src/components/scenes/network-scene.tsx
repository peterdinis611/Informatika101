"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"
import { ToonBox } from "@/components/scenes/toon"
import {
  InkCyl,
  Monitor,
  PcCase,
  useLabFloorColor,
} from "@/components/scenes/hardware-models"
import { Hotspot } from "@/components/scenes/hotspot"
import { useInspect } from "@/components/three/inspect-context"

type NetworkSceneProps = {
  sending: boolean
  progress: number
  onInfo: (text: string) => void
}

export function NetworkScene({ sending, progress, onInfo }: NetworkSceneProps) {
  const packet = useRef<Mesh>(null)
  const { focused, focus } = useInspect()
  const floor = useLabFloorColor()
  const path: [number, number, number][] = [
    [-2.6, 0.7, 0],
    [-0.55, 0.85, 0],
    [0.35, 1.85, 0],
    [2.55, 0.95, 0],
    [-0.55, 0.85, 0],
    [-2.6, 0.7, 0],
  ]

  useFrame(() => {
    if (!packet.current) return
    if (!sending) {
      packet.current.visible = false
      return
    }
    packet.current.visible = true
    const total = path.length - 1
    const f = Math.min(progress, 0.999) * total
    const i = Math.floor(f)
    const local = f - i
    const a = path[i]
    const b = path[Math.min(i + 1, path.length - 1)]
    packet.current.position.set(
      a[0] + (b[0] - a[0]) * local,
      a[1] + (b[1] - a[1]) * local,
      a[2] + (b[2] - a[2]) * local
    )
  })

  return (
    <group>
      <ToonBox args={[8.4, 0.1, 3.2]} position={[0, -0.85, 0]} color={floor} radius={0.04} />

      <Hotspot
        tag="Tvoj PC"
        tagY={1.15}
        target={{
          id: "net-pc",
          position: [-2.7, -0.05, 0],
          offset: [2.1, 1.5, 2.4],
          title: "Tvoj počítač",
          summary:
            "Každý počítač v sieti má IP adresu — ako číslo domu. Bez nej paket nevie, kam ísť.",
          facts: [
            "Príklad IP: 192.168.1.10 (lokálna sieť).",
            "MAC adresa je „výrobné číslo“ sieťovej karty.",
            "Prehliadač posiela požiadavku ako paket dát.",
          ],
          tip: "Klikni na Router a sleduj, kam paket pôjde ďalej.",
        }}
        onOpen={() => onInfo("Tvoj PC · IP 192.168.1.10 — klikni Router / DNS / Server pre detaily.")}
      >
        <group scale={0.42} position={[0, -0.3, 0]}>
          <PcCase selected={focused?.id === "net-pc"} />
          <group position={[1.6, -0.4, 0.2]} scale={1.3}>
            <Monitor selected={focused?.id === "net-pc"} />
          </group>
        </group>
      </Hotspot>

      <Hotspot
        tag="Router"
        tagY={1.05}
        target={{
          id: "net-router",
          position: [-0.5, -0.15, 0],
          offset: [2.0, 1.6, 2.2],
          title: "Router",
          summary:
            "Router je poštový uzol siete. Číta cieľovú IP a rozhodne, ktorým káblom / Wi‑Fi paket pošle.",
          facts: [
            "Spája tvoju domácu sieť s internetom.",
            "Vie NAT — viac zariadení, jedna verejná IP.",
            "Antény = Wi‑Fi; porty = káble Ethernet.",
          ],
          tip: "Pri odosielaní paketu sleduj oranžovú gulôčku cez router.",
        }}
        onOpen={() => onInfo("Router · posiela pakety správnym smerom.")}
      >
        <ToonBox
          args={[1.15, 0.28, 0.72]}
          color="#1e293b"
          radius={0.06}
          selected={focused?.id === "net-router"}
        />
        <ToonBox args={[0.9, 0.08, 0.5]} position={[0, 0.18, 0]} color="#f59e0b" radius={0.03} />
        {[-0.28, 0, 0.28].map((x) => (
          <InkCyl
            key={x}
            args={[0.025, 0.025, 0.55, 8]}
            position={[x, 0.48, -0.18]}
            color="#94a3b8"
          />
        ))}
        <InkCyl args={[0.04, 0.04, 0.06, 10]} position={[0.4, 0.08, 0.28]} color="#22c55e" />
      </Hotspot>

      <Hotspot
        tag="DNS"
        tagY={0.85}
        target={{
          id: "net-dns",
          position: [0.4, 1.35, 0],
          offset: [1.8, 1.2, 2.0],
          title: "DNS server",
          summary:
            "DNS je telefónny zoznam internetu: meno skola.sk preloží na IP, ktorú router a servery rozumejú.",
          facts: [
            "Bez DNS by si musel pamätať čísla namiesto mien.",
            "Odpoveď DNS sa často kešuje, aby bola rýchla.",
            "Príklad: skola.sk → 203.0.113.40",
          ],
          tip: "Najprv DNS, potom cesta k serveru — v tomto poradí ide aj skutočný web.",
        }}
        onOpen={() => onInfo("DNS · meno stránky → IP adresa.")}
      >
        <ToonBox
          args={[1.05, 0.85, 0.45]}
          color="#7c3aed"
          radius={0.06}
          selected={focused?.id === "net-dns"}
        />
        <ToonBox args={[0.85, 0.08, 0.08]} position={[0, 0.18, 0.22]} color="#fde68a" radius={0.02} />
        <ToonBox args={[0.85, 0.08, 0.08]} position={[0, -0.02, 0.22]} color="#fde68a" radius={0.02} />
        <ToonBox args={[0.85, 0.08, 0.08]} position={[0, -0.22, 0.22]} color="#fde68a" radius={0.02} />
      </Hotspot>

      <Hotspot
        tag="Server"
        tagY={1.15}
        target={{
          id: "net-server",
          position: [2.55, -0.05, 0],
          offset: [-2.2, 1.7, 2.3],
          title: "Webový server",
          summary:
            "Server drží stránku (HTML, obrázky…). Keď príde požiadavka, pošle odpoveď späť k tvojmu PC.",
          facts: [
            "Jeden server zvládne tisíce návštevníkov.",
            "Odpoveď ide rovnakou cestou späť (cez routery).",
            "HTTPS = šifrovaná cesta medzi tebou a serverom.",
          ],
          tip: "Spusti „Pošli paket“ v paneli Lab a sleduj celú cestu.",
        }}
        onOpen={() => onInfo("Server · odpovie stránkou a paket ide späť.")}
      >
        <ToonBox
          args={[1.15, 1.45, 0.7]}
          color="#334155"
          radius={0.05}
          selected={focused?.id === "net-server"}
        />
        {[0.38, 0.1, -0.18, -0.46].map((y, i) => (
          <ToonBox
            key={y}
            args={[0.95, 0.18, 0.55]}
            position={[0, y, 0.08]}
            color={i % 2 === 0 ? "#22c55e" : "#0ea5e9"}
            radius={0.03}
          />
        ))}
      </Hotspot>

      <mesh
        ref={packet}
        onClick={(e) => {
          e.stopPropagation()
          const p = packet.current?.position
          focus({
            id: "net-packet",
            position: p ? [p.x, p.y, p.z] : [-1.6, 0.55, 0],
            offset: [1.6, 1.4, 1.8],
            title: "Paket",
            summary:
              "Paket je balíček dát: hlavička (odkiaľ / kam) + obsah (napr. požiadavka na stránku).",
            facts: [
              "Veľké súbory sa rozbijú na veľa paketov.",
              "Ak sa paket stratí, sieť ho často pošle znova (TCP).",
              "Oranžová gulôčka = práve putujúci paket.",
            ],
            tip: "Zapni odosielanie v Lab paneli, aby gulôčka ožila.",
          })
          onInfo("Paket · balík dát putujúci sieťou.")
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto"
        }}
      >
        <octahedronGeometry args={[0.16, 0]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>
      {!sending && (
        <mesh
          position={[-1.6, 0.45, 0.35]}
          onClick={(e) => {
            e.stopPropagation()
            focus({
              id: "net-packet",
              position: [-1.6, 0.45, 0.35],
              offset: [1.6, 1.4, 1.8],
              title: "Paket",
              summary:
                "Paket je balíček dát: hlavička (odkiaľ / kam) + obsah (napr. požiadavka na stránku).",
              facts: [
                "Veľké súbory sa rozbijú na veľa paketov.",
                "Ak sa paket stratí, sieť ho často pošle znova (TCP).",
                "Oranžová gulôčka = práve putujúci paket.",
              ],
              tip: "Zapni odosielanie v Lab paneli, aby gulôčka ožila.",
            })
            onInfo("Paket · balík dát putujúci sieťou.")
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = "pointer"
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto"
          }}
        >
          <octahedronGeometry args={[0.14, 0]} />
          <meshBasicMaterial color="#fdba74" transparent opacity={0.75} />
        </mesh>
      )}

      <ToonBox args={[1.9, 0.05, 0.05]} position={[-1.55, 0.05, -0.2]} color="#64748b" radius={0.02} />
      <ToonBox args={[2.4, 0.05, 0.05]} position={[1.05, 0.25, -0.2]} color="#64748b" radius={0.02} />
    </group>
  )
}
