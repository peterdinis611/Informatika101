import { LabSpinner } from "@/components/lab/lab-spinner"

export default function Loading() {
  return (
    <div className="lab-wash fixed inset-0 z-[200] flex items-center justify-center">
      <LabSpinner label="Pripravujem 3D lab…" />
    </div>
  )
}
