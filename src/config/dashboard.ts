import { DashboardConfig } from "~/types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Recipes",
      href: "/recipes",
    },
    {
      title: "Settings",
      href: "/settings",
    },
  ],
  sidebarNav: [
    {
      title: "Recipes",
      href: "/recipes",
      icon: "post",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
    },
  ],
}
