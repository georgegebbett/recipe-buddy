import { Skeleton } from "~/components/ui/skeleton"
import { DashboardShell } from "~/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <Skeleton className="h-16" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
      </div>
    </DashboardShell>
  )
}
