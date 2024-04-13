"use client"

import { useState } from "react"
import { CreateRecipeInGrocyCommand } from "~/server/api/modules/grocy/procedures/createRecipeInGrocySchema"
import { api } from "~/trpc/react"
import { SquarePen } from "lucide-react"
import {
  Controller,
  FormProvider,
  useFieldArray,
  useFormContext,
} from "react-hook-form"

import { Button } from "~/components/ui/button"
import { FormField, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { GrocyUnitCombobox } from "~/components/grocy-unit-combobox"
import { IngredientGroupCombobox } from "~/components/ingredient-group-combobox"
import { IngredientNoteDialog } from "~/components/ingredient-note-dialog"

import { GrocyProductCombobox } from "./grocy-product-combobox"

type IngredientTableProps = {
  grocyBaseUrl: string
}

export function IngredientTable({ grocyBaseUrl }: IngredientTableProps) {
  const f = useFormContext<CreateRecipeInGrocyCommand>()

  const [groups, setGroups] = useState<string[]>([])

  const addGroup = (groupName: string) =>
    setGroups((old) => [groupName, ...old])

  const { fields } = useFieldArray<CreateRecipeInGrocyCommand>({
    name: "ingredients",
    control: f.control,
  })

  return (
    <div className="flex flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Ignore</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <FormProvider {...f}>
            {fields.map((a, i) => (
              <IngredientTableRow
                ingredientName={a.scrapedName}
                key={a.id}
                index={i}
                grocyBaseUrl={grocyBaseUrl}
                addGroup={addGroup}
                groups={groups}
                {...a}
              />
            ))}
          </FormProvider>
        </TableBody>
      </Table>
    </div>
  )
}

const IngredientTableRow = ({
  ingredientName,
  index,
  grocyBaseUrl,
  groups,
  addGroup,
}: {
  ingredientName: string
  index: number
  grocyBaseUrl: string
  groups: string[]
  addGroup: (newGroup: string) => void
}) => {
  const f = useFormContext<CreateRecipeInGrocyCommand>()

  const { data: products } = api.grocy.getProducts.useQuery()

  const isRowIgnored = f.watch(`ingredients.${index}.ignored`)

  return (
    <TableRow>
      <TableCell className={isRowIgnored ? "line-through" : ""}>
        {ingredientName}
      </TableCell>
      <TableCell>
        <FormField
          render={({ field }) => (
            <>
              <GrocyProductCombobox
                baseUrl={grocyBaseUrl}
                productName={ingredientName}
                disabled={isRowIgnored}
                value={field.value}
                setValue={(a) => {
                  field.onChange(a)
                  const prod = products
                    ? products.find((b) => b.id === a)
                    : undefined
                  if (prod) {
                    f.setValue(`ingredients.${index}.unitId`, prod.qu_id_stock)
                  }
                }}
              />
              <FormMessage />
            </>
          )}
          name={`ingredients.${index}.productId`}
          control={f.control}
        />
      </TableCell>
      <TableCell>
        <FormField
          render={({ field }) => (
            <>
              <Input type="number" disabled={isRowIgnored} {...field} />
              <FormMessage />
            </>
          )}
          name={`ingredients.${index}.amount`}
          control={f.control}
        />
      </TableCell>
      <TableCell>
        <FormField
          render={({ field }) => (
            <>
              <GrocyUnitCombobox
                disabled={isRowIgnored}
                value={field.value}
                setValue={field.onChange}
              />
              <FormMessage />
            </>
          )}
          name={`ingredients.${index}.unitId`}
          control={f.control}
        />
      </TableCell>
      <TableCell>
        <FormField
          render={({ field }) => (
            <>
              <IngredientGroupCombobox
                disabled={isRowIgnored}
                setValue={field.onChange}
                groups={groups}
                addGroup={addGroup}
                value={field.value}
              />
              <FormMessage />
            </>
          )}
          name={`ingredients.${index}.group`}
          control={f.control}
        />
      </TableCell>
      <TableCell>
        <Controller
          render={({ field }) => {
            return (
              <IngredientNoteDialog {...field}>
                <Button
                  size="icon"
                  variant="outline"
                  data-has-note={field.value && field.value.trim().length > 0}
                  className="data-[has-note=true]:bg-green-200"
                >
                  <SquarePen strokeWidth={1} className={"h-4 w-4"} />
                </Button>
              </IngredientNoteDialog>
            )
          }}
          name={`ingredients.${index}.note`}
          control={f.control}
        />
      </TableCell>
      <TableCell>
        <Controller
          render={({ field }) => {
            return (
              <Button onClick={() => field.onChange(!field.value)}>
                {field.value ? "Unignore" : "Ignore"}
              </Button>
            )
          }}
          name={`ingredients.${index}.ignored`}
          control={f.control}
        />
      </TableCell>
    </TableRow>
  )
}
