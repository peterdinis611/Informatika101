import { LabSpinner } from "@/components/lab/lab-spinner"

export default function LessonLoading() {
  return (
    <div className="lab-wash fixed inset-0 z-[200] flex items-center justify-center">
      <LabSpinner label="…" />
    </div>
  )
}
