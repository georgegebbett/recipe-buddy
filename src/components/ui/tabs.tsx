import * as React from "react"

import { cn } from "~/lib/utils"
import * as PrimativeTabs from "@radix-ui/react-tabs"

// const Tabs = PrimativeTabs.Root;
const Tabs = React.forwardRef<
  React.ElementRef<typeof PrimativeTabs.Root>,
  React.ComponentPropsWithoutRef<typeof PrimativeTabs.Root>
  >(({className, ...props}, ref) =>
    <PrimativeTabs.Root
     ref={ref}
     className={cn(className)}
     {...props}
    />
);

const TabsList = React.forwardRef<
  React.ElementRef<typeof PrimativeTabs.List>,
  React.ComponentPropsWithoutRef<typeof PrimativeTabs.List>
  >(({className, ...props}, ref) =>
    <PrimativeTabs.List
     ref={ref}
     className={cn("flex-row border-b", className)}
     {...props}
    />
);
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof PrimativeTabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof PrimativeTabs.Trigger>
  >(({className, ...props}, ref) =>
    <PrimativeTabs.Trigger
     ref={ref}
     className={cn("p-4 radix-state-active:rounded-t-md radix-state-active:border-x radix-state-active:border-t", className)}
     {...props}
    />
);
const TabContent = React.forwardRef<
  React.ElementRef<typeof PrimativeTabs.Content>,
React.ComponentPropsWithoutRef<typeof PrimativeTabs.Content>
  >(({className, ...props}, ref) =>
  <PrimativeTabs.Content
    ref={ref}
    className={cn(className)}
    {...props}
  />
);
Tabs.displayName = PrimativeTabs.Root.displayName;
TabsList.displayName = PrimativeTabs.List.displayName;
TabsTrigger.displayName = PrimativeTabs.List.displayName;
TabContent.displayName = PrimativeTabs.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabContent }
