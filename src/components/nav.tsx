"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {SidebarNavItem} from "~/types";
import {Icons} from "~/components/icons";
import {cn} from "~/lib/utils";
import {api} from "~/trpc/react";


interface DashboardNavProps {
  items: SidebarNavItem[]
}

export function RecipesSidebar({ items }: DashboardNavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  const {data:recipes, isLoading} = api.recipe.list.useQuery()

  return (
    <nav className="grid items-start gap-2">
      {recipes && recipes.map((item, index) => {
        // const Icon = Icons[item.icon || "arrowRight"]
        return (
          // item.href && (
            <Link key={index} href={`/recipes/${item.id}`}>
              <span
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  path === `/recipes/${item.id}` ? "bg-accent" : "transparent",
                )}
              >
                {/*<Icon className="mr-2 h-4 w-4" />*/}
                <span>{item.name}</span>
              </span>
            </Link>
          // )
        )
      })}
    </nav>
  )
}
