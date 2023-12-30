"use client"

import * as React from "react"
import {ChevronsUpDown, PlusCircleIcon} from "lucide-react"
import {Button} from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "~/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "~/components/ui/popover"
import {api} from "~/trpc/react";
import {env} from "~/env";

export function GrocyProductCombobox({productName, disabled, value, setValue}: {
  productName: string;
  disabled?: boolean,
  value: string;
  setValue: (newValue: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  const utils = api.useContext()

  const {data} = api.grocy.getProducts.useQuery()

  const newProductSlug =
      `/product/new?closeAfterCreation&flow=InplaceNewProductWithName&name=${productName}`;

  const createNewProduct = () => {

    // utils.grocy.getProducts.

  }


  return data && (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
              disabled={disabled}
          >
            {value
                ? data.find((product) => (product.id) === value)?.name
                : "Select product..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search products..."/>
            <CommandEmpty>
              No product found
            </CommandEmpty>
            <CommandGroup>
              <CommandItem value="add"
                           onSelect={() => window.open(`${env.NEXT_PUBLIC_GROCY_BASE_URL}${newProductSlug}`)}>
                <div className="flex gap-2 items-center">
                  <PlusCircleIcon className="h-4 w-4 fill-black text-white"/>
                  <p>Add Product</p>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator/>
            <CommandGroup className="max-h-52 overflow-y-scroll">
              {data.map((product) => (
                  <CommandItem
                      key={product.id}
                      value={product.name}
                      onSelect={(currentValue) => {
                        setValue((currentValue) === product.id ? "" : product.id)
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
