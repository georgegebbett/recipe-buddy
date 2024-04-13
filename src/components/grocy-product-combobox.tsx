"use client"

import * as React from "react"
import { api } from "~/trpc/react"
import { ChevronsUpDown, PlusCircleIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

type GrocyProductComboboxProps = {
  productName: string
  disabled?: boolean
  value: string
  setValue: (newValue: string) => void
  baseUrl: string
}

export function GrocyProductCombobox({
  productName,
  disabled,
  value,
  setValue,
  baseUrl,
}: GrocyProductComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const utils = api.useContext()

  const { data } = api.grocy.getProducts.useQuery()

  const newProductSlug = `/product/new?closeAfterCreation&flow=InplaceNewProductWithName&name=${productName}`

  const onCreateNewProduct = () => {
    window.addEventListener("visibilitychange", onRefocusAfterCreateProduct)
    window.open(`${baseUrl}${newProductSlug}`)
  }

  const onRefocusAfterCreateProduct = async () => {
    if (document.visibilityState === "visible") {
      await utils.grocy.getProducts.invalidate()
      await utils.grocy.getProducts.refetch()

      const prods = await utils.grocy.getProducts.ensureData()

      const [highestProd] = prods.sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      )

      console.log("gighest prod")
      console.log(highestProd)

      if (highestProd) {
        setValue(highestProd.id)
      }

      window.removeEventListener(
        "visibilitychange",
        onRefocusAfterCreateProduct
      )
    }
  }

  return (
    data && (
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
              {value
                ? data.find((product) => product.id === value)?.name
                : "Select product..."}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search products..." />
            <CommandList>
              <CommandEmpty>No product found</CommandEmpty>
              <CommandGroup>
                <CommandItem value="add" onSelect={onCreateNewProduct}>
                  <div className="flex items-center gap-2">
                    <PlusCircleIcon className="h-4 w-4 fill-black text-white" />
                    <p>Add Product</p>
                  </div>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  )
}
