"use client"

import { Hotspot } from "@/components/scenes/hotspot"
import { useLabFloorColor } from "@/components/scenes/hardware-models"
import { FloatTag, ToonBox } from "@/components/scenes/toon"

type SecuritySceneProps = {
  strength: number
  encrypted: string
  phishingCaught: boolean
  onInfo: (text: string) => void
}

export function SecurityScene({
  strength,
  encrypted,
  phishingCaught,
  onInfo,
}: SecuritySceneProps) {
  const color =
    strength < 40 ? "#ef4444" : strength < 70 ? "#f59e0b" : "#22c55e"
  const floor = useLabFloorColor()

  return (
    <group>
      <ToonBox args={[6.4, 0.1, 2.6]} position={[0, -0.95, 0]} color={floor} radius={0.04} />

      <Hotspot
        tag="Sila hesla"
        tagY={0.85}
        ringY={-0.55}
        target={{
          id: "sec-password",
          position: [-2, 0.6, 0],
          offset: [2.0, 1.4, 2.2],
          title: "Sila hesla",
          summary:
            "Silné heslo je dlhé a mieša veľké/malé písmená, čísla a symboly. Krátke slovníkové heslá padnú rýchlo.",
          facts: [
            `Aktuálna sila: ${strength}%`,
            "Dĺžka pomáha viac než jedno ! na konci.",
            "Správca hesiel > rovnaké heslo všade.",
          ],
          tip: "V Lab paneli skús rôzne heslá a sleduj farbu bloku.",
        }}
        onOpen={() =>
          onInfo("Silné heslo je dlhé a obsahuje rôzne typy znakov.")
        }
      >
        <ToonBox args={[2.2, 0.8, 0.5]} color={color} radius={0.08} />
        <FloatTag
          position={[0, 0, 0.28]}
          text={`${strength}%`}
          tone="dark"
        />
      </Hotspot>

      <Hotspot
        tag="Phishing"
        tagY={0.85}
        ringY={-0.55}
        target={{
          id: "sec-phish",
          position: [0.3, 0.6, 0],
          offset: [1.8, 1.4, 2.2],
          title: "Podozrivá správa (phishing)",
          summary:
            "Phishing ťa láka kliknúť na falošný odkaz. Nátlak („ihneď!“), chyby v adrese a neznámy odosielateľ sú varovania.",
          facts: [
            phishingCaught
              ? "Odhalené — správne si to zachytil."
              : "Ešte neodhalené — použij tlačidlo v Lab paneli.",
            "Over URL: banka.sk ≠ banka-secure.xyz",
            "Nikdy nezadávaj heslo z e-mailového odkazu.",
          ],
          tip: "Keď niečo tlačí na čas — spomaľ a over zdroj.",
        }}
        onOpen={() =>
          onInfo(
            phishingCaught
              ? "Správne! Podozrivý odkaz a nátlak sú znaky phishingu."
              : "Pozor na správy, ktoré ťa nútia okamžite kliknúť."
          )
        }
      >
        <ToonBox
          args={[2.2, 0.8, 0.5]}
          color={phishingCaught ? "#22c55e" : "#f97316"}
          radius={0.08}
        />
        <FloatTag
          position={[0, 0, 0.28]}
          text={phishingCaught ? "Odhalené ✓" : "Pozor!"}
          tone="dark"
        />
      </Hotspot>

      <Hotspot
        tag="Šifrovanie"
        tagY={0.7}
        ringY={-0.55}
        target={{
          id: "sec-cipher",
          position: [0, -0.9, 0],
          offset: [2.0, 1.6, 2.4],
          title: "Šifrovanie (Caesar)",
          summary:
            "Šifrovanie mení text tak, že bez kľúča nejde prečítať. Caesar posúva písmená o N miest v abecede — učebný príklad, nie moderná ochrana.",
          facts: [
            encrypted ? `Šifrovaný text: ${encrypted}` : "Zatiaľ prázdne — zadaj text v Lab.",
            "HTTPS používa silné šifry (nie Caesar).",
            "Kľúč musí zostať tajný — inak je šifra zbytočná.",
          ],
          tip: "Porovnaj otvorený a zašifrovaný text v paneli.",
        }}
        onOpen={() =>
          onInfo("Šifrovanie mení text tak, že bez kľúča nejde prečítať.")
        }
      >
        <ToonBox args={[2.4, 0.9, 0.5]} color="#0ea5e9" radius={0.08} />
        <FloatTag
          position={[0, 0, 0.28]}
          text={encrypted || "…"}
          tone="dark"
        />
      </Hotspot>
    </group>
  )
}
