export const GLOSSARY_OPEN_EVENT = "informatika-glossary-open"

export function openGlossaryTerm(termId: string) {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent(GLOSSARY_OPEN_EVENT, { detail: { termId } })
  )
}
