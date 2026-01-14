import { redirect } from "next/navigation"
import { authOptions } from "~/server/auth"

import { getCurrentUser } from "~/lib/session"
import { GrocyStatus } from "~/components/grocy-status"
import { DashboardHeader } from "~/components/header"
import { DashboardShell } from "~/components/shell"
import { UserTable } from "~/components/user-table"
import { ApiKeyTable } from "~/components/api-key-table"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  // Get the base URL from NEXTAUTH_URL for API examples
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" />
      <div className="grid gap-10">
        <ApiKeyTable baseUrl={baseUrl} />
        <GrocyStatus />
        <UserTable />
      </div>
    </DashboardShell>
  )
}
