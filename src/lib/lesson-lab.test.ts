import { describe, expect, it } from "vitest"
import {
  bitsToValue,
  caesar,
  filesCorrectlyPlaced,
  gateOutput,
  gatesAndTrue,
  gatesOrSingle,
  isSortedAscending,
  passwordStrength,
} from "@/lib/lesson-lab"
import { didPassQuiz } from "@/lib/quiz"

describe("lesson lab helpers", () => {
  it("computes bit values", () => {
    expect(bitsToValue([false, false, false, false, true, true, false, true])).toBe(13)
    expect(bitsToValue([false, true, false, false, false, false, false, true])).toBe(65)
  })

  it("evaluates gates and task goals", () => {
    expect(gateOutput("AND", true, true)).toBe(true)
    expect(gateOutput("AND", true, false)).toBe(false)
    expect(gateOutput("OR", true, false)).toBe(true)
    expect(gateOutput("NOT", true, false)).toBe(false)
    expect(gatesAndTrue("AND", true, true)).toBe(true)
    expect(gatesAndTrue("OR", true, true)).toBe(false)
    expect(gatesOrSingle("OR", true, false)).toBe(true)
    expect(gatesOrSingle("OR", true, true)).toBe(false)
  })

  it("requires correct file placements", () => {
    expect(
      filesCorrectlyPlaced({ uloha: "docs", foto: "pics", song: "music" })
    ).toBe(true)
    expect(
      filesCorrectlyPlaced({ uloha: "docs", foto: "music", song: "music" })
    ).toBe(false)
  })

  it("detects sorted arrays", () => {
    expect(isSortedAscending([1, 2, 3, 4, 5])).toBe(true)
    expect(isSortedAscending([4, 1, 5, 2, 3])).toBe(false)
  })

  it("scores password strength", () => {
    expect(passwordStrength("a")).toBeLessThan(70)
    expect(passwordStrength("Domcek#2026")).toBeGreaterThanOrEqual(70)
  })

  it("applies caesar cipher", () => {
    expect(caesar("ahoj", 3)).toBe("dkrm")
  })
})

describe("store quiz threshold (shared rule)", () => {
  it("matches progress completeQuiz pass bar", () => {
    expect(didPassQuiz(2)).toBe(true)
  })
})
