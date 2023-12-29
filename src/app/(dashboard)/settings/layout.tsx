import {ReactNode} from "react";
import {RecipesSidebar} from "~/components/nav";
import {dashboardConfig} from "~/config/dashboard";
import {Toaster} from "~/components/ui/sonner";

export default function Layout({children}: { children: ReactNode }) {
  return (
      <div className="container flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
  )
}
