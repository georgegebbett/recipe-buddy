import { redirect } from "next/navigation"

// import { UserNameForm } from "@/components/user-name-form"
import {authOptions} from "~/server/auth";
import {getCurrentUser} from "~/lib/session";
import {DashboardShell} from "~/components/shell";
import {DashboardHeader} from "~/components/header";
import {GrocyStatus} from "~/components/grocy-status";
import {NewUserDialog} from "~/components/new-user-dialog";
import {UserTable} from "~/components/user-table";

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }


  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
      />
      <div className="grid gap-10">
        <GrocyStatus/>
        <UserTable/>
      </div>
    </DashboardShell>
  )
}
