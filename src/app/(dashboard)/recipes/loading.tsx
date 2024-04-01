import { CardSkeleton } from "~/components/card-skeleton"
import { DashboardHeader } from "~/components/header"
import { NewRecipeDialog } from "~/components/new-recipe-dialog"
import { DashboardShell } from "~/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Recipes" text="Add and manage recipes.">
        <NewRecipeDialog />
      </DashboardHeader>
      <div className="grid grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
