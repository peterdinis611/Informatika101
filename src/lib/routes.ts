import type { Lesson } from "@/data/lessons"

export function lessonPath(lessonOrId: Lesson | string) {
  const id = typeof lessonOrId === "string" ? lessonOrId : lessonOrId.id
  return `/lesson/${id}`
}

export const ROUTES = {
  home: "/",
  lessons: "/#lessons",
  firstLesson: "/lesson/what-is-a-computer",
} as const
