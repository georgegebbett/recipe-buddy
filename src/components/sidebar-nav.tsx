"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {cn} from "~/lib/utils"
import {Icons} from "~/components/icons";


export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
}

export function DocsSidebarNav({items}: DocsSidebarNavProps) {
  const pathname = usePathname()

  return items.length ? (
      <div className="w-full">
        {items.map((item, index) => (
            <div key={index} className={cn("pb-8")}>
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
                {item.title}
              </h4>
              {item.items ? (
                  <DocsSidebarNavItems items={item.items} pathname={pathname}/>
              ) : null}
            </div>
        ))}
      </div>
  ) : null
}

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
    | {
  href: string
  items?: never
}
    | {
  href?: string
  items: NavItem[]
}
    )

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function DocsSidebarNavItems({
                                      items,
                                      pathname,
                                    }: DocsSidebarNavItemsProps) {
  return items?.length ? (
      <div className="grid grid-flow-row auto-rows-max text-sm">
        {items.map((item, index) =>
            !item.disabled && item.href ? (
                <Link
                    key={index}
                    href={item.href}
                    className={cn(
                        "flex w-full items-center rounded-md p-2 hover:underline",
                        {
                          "bg-muted": pathname === item.href,
                        }
                    )}
                    target={item.external ? "_blank" : ""}
                    rel={item.external ? "noreferrer" : ""}
                >
                  {item.title}
                </Link>
            ) : (
                <span className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60">
            {item.title}
          </span>
            )
        )}
      </div>
  ) : null
}
