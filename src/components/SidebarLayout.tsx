type SidebarLayoutProps = {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export const SidebarLayout = ({ sidebar, children }: SidebarLayoutProps) => (
  <div className="flex h-full flex-1 flex-row">
    <div className="border-border sticky top-0 hidden w-[350px] max-w-sm overflow-y-auto border-r lg:flex">
      {sidebar}
    </div>
    <div className="flex-1 shrink-0 overflow-auto">
      <div className="h-full overflow-auto">{children}</div>
    </div>
  </div>
)
