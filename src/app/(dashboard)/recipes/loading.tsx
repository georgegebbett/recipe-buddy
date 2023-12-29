import { DashboardHeader } from "~/components/header"
import { DashboardShell } from "~/components/shell"
import {NewRecipeDialog} from "~/components/new-recipe-dialog";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <NewRecipeDialog />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        {/*<PostItem.Skeleton />*/}
        {/*<PostItem.Skeleton />*/}
        {/*<PostItem.Skeleton />*/}
        {/*<PostItem.Skeleton />*/}
        {/*<PostItem.Skeleton />*/}
      </div>
    </DashboardShell>
  )
}
