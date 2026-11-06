import { redirect } from "next/navigation"

/** Legacy Slovak route → English `/lesson/[id]` */
const LEGACY: Record<string, string> = {
  "co-je-pocitac": "what-is-a-computer",
  hardware: "hardware",
  "bity-bajty": "bits-and-bytes",
  procesor: "cpu",
  pamat: "memory",
  os: "operating-system",
  hradla: "logic-gates",
  siet: "networking",
  programovanie: "programming",
  bezpecnost: "security",
  subory: "files-and-folders",
  algoritmy: "algorithms",
  databazy: "databases",
  web: "web-and-html",
  ai: "ai-basics",
}

export function generateStaticParams() {
  return Object.keys(LEGACY).map((id) => ({ id }))
}

type Props = { params: Promise<{ id: string }> }

export default async function LegacyLessonRedirect({ params }: Props) {
  const { id } = await params
  const next = LEGACY[id] ?? id
  redirect(`/lesson/${next}`)
}
