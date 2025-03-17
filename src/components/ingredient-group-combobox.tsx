import * as React from "react"
import { useState } from "react"
import { ChevronsUpDown, PlusCircleIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command"
import { InputProps } from "~/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

interface IngredientGroupComboboxProps extends InputProps {
  setValue: (newValue: string) => void
  groups: string[]
  addGroup: (newGroup: string) => void
}

export function IngredientGroupCombobox({
  disabled,
  value,
  setValue,
  groups,
  addGroup,
}: IngredientGroupComboboxProps) {
  const [open, setOpen] = useState(false)

  const onCreateNewGroup = (groupName: string) => {
    if (groups.includes(groupName)) {
      setValue(groupName)
      setOpen(false)
      return
    }

    addGroup(groupName)
    setValue(groupName)
    setOpen(false)
  }

  const [textVal, setTextVal] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={disabled}
        >
          <div className="overflow-x-clip text-ellipsis">
            {value ?? "Select group..."}
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search groups..."
            value={textVal}
            onValueChange={setTextVal}
          />
          <CommandList>
            <CommandGroup forceMount>
              <CommandItem
                forceMount
                value="e388b184-9b92-4969-a5e9-a7d25df8dc72"
                onSelect={() => onCreateNewGroup(textVal)}
                disabled={textVal.length === 0 || groups.includes(textVal)}
              >
                <div className="flex items-center gap-2">
                  <PlusCircleIcon className="size-4 fill-black text-white" />
                  <p>Add {textVal}</p>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup className="max-h-52 overflow-y-scroll">
              {groups.map((group) => (
                <CommandItem
                  key={group}
                  value={group}
                  onSelect={(val) => {
                    setValue(val)
                    setOpen(false)
                  }}
                >
                  {group}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
