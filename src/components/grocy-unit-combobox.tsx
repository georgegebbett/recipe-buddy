"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import {api} from "~/trpc/react";

export function GrocyUnitCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const {data} = api.grocy.getQuantityUnits.useQuery()

  return data && (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
          >
            {value
                ? data.find((product) => product.id === value)?.name
                : "Select unit..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search units..." />
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup className="max-h-52 overflow-y-scroll">
              {data.map((product) => (
                  <CommandItem
                      key={product.id}
                      value={product.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === product.id ? "" : product.id)
                        setOpen(false)
                      }}
                  >
                    {product.name}
                  </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
  )
}
