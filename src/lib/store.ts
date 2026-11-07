"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { LESSONS } from "@/data/lessons"
import { didPassQuiz } from "@/lib/quiz"

export type BadgeId = string

type ProgressState = {
  completedLessons: string[]
  quizScores: Record<string, number>
  points: number
  badges: BadgeId[]
  taskDone: Record<string, boolean>
  checkpoints: Record<string, boolean>
  completeTask: (lessonId: string) => void
  completeCheckpoint: (lessonId: string) => void
  completeQuiz: (lessonId: string, score: number, badge: string) => void
  /** Free-explore: všetky lekcie sú vždy otvorené. */
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
      checkpoints: {},

      completeTask: (lessonId) =>
        set((s) => ({
          taskDone: { ...s.taskDone, [lessonId]: true },
          points: s.taskDone[lessonId] ? s.points : s.points + 10,
        })),

      completeCheckpoint: (lessonId) =>
        set((s) => ({
          checkpoints: { ...s.checkpoints, [lessonId]: true },
          points: s.checkpoints[lessonId] ? s.points : s.points + 5,
        })),

      completeQuiz: (lessonId, score, badge) =>
        set((s) => {
          const already = s.completedLessons.includes(lessonId)
          const passed = didPassQuiz(score)
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
          checkpoints: {},
        }),
    }),
    { name: "informatika-101-progress-v4" }
  )
)

export function totalProgressPercent(completed: string[]) {
  return Math.round((completed.length / LESSONS.length) * 100)
}
