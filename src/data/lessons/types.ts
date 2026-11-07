export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type Lesson = {
  id: string
  order: number
  title: string
  shortTitle: string
  description: string
  guideIntro: string
  task: string
  taskHint: string
  badge: string
  accent: string
  quiz: QuizQuestion[]
}
