import { ReactNode } from "react"

import { dashboardConfig } from "~/config/dashboard"
import { RecipesSidebar } from "~/components/nav"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex">
        <RecipesSidebar items={dashboardConfig.sidebarNav} />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
