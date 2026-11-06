"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { LESSONS } from "@/data/lessons"

export type BadgeId = string

type ProgressState = {
  completedLessons: string[]
  quizScores: Record<string, number>
  points: number
  badges: BadgeId[]
  taskDone: Record<string, boolean>
  completeTask: (lessonId: string) => void
  completeQuiz: (lessonId: string, score: number, badge: string) => void
  /** All lessons are free — always unlocked. */
  isUnlocked: (lessonId: string) => boolean
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: [],
      quizScores: {},
      points: 0,
      badges: [],
      taskDone: {},

      completeTask: (lessonId) =>
        set((s) => ({
          taskDone: { ...s.taskDone, [lessonId]: true },
          points: s.taskDone[lessonId] ? s.points : s.points + 10,
        })),

      completeQuiz: (lessonId, score, badge) =>
        set((s) => {
          const already = s.completedLessons.includes(lessonId)
          const passed = score >= 2
          if (!passed) {
            return {
              quizScores: { ...s.quizScores, [lessonId]: score },
            }
          }
          return {
            completedLessons: already
              ? s.completedLessons
              : [...s.completedLessons, lessonId],
            quizScores: { ...s.quizScores, [lessonId]: score },
            points: already ? s.points : s.points + 30 + score * 10,
            badges:
              already || s.badges.includes(badge)
                ? s.badges
                : [...s.badges, badge],
          }
        }),

      isUnlocked: () => true,

      resetProgress: () =>
        set({
          completedLessons: [],
          quizScores: {},
          points: 0,
          badges: [],
          taskDone: {},
        }),
    }),
    { name: "informatika-101-progress-v3" }
  )
)

export function totalProgressPercent(completed: string[]) {
  return Math.round((completed.length / LESSONS.length) * 100)
}
