"use client"

import {RouterOutputs} from "~/trpc/shared"
import {Controller, FormProvider, useFieldArray, useFormContext,} from "react-hook-form"

import {Button} from "~/components/ui/button"
import {Input} from "~/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "~/components/ui/table"
import {GrocyProductCombobox} from "~/components/grocy-product-combobox"
import {GrocyUnitCombobox} from "~/components/grocy-unit-combobox"
import {api} from "~/trpc/react";
import {CreateRecipeInGrocy} from "~/server/api/modules/grocy/procedures/createRecipeInGrocySchema";

type Ingredient = NonNullable<
    RouterOutputs["recipe"]["get"]
>["ingredients"][number]


export function IngredientTable(
    {recipeIngredients}: { recipeIngredients: Ingredient[] }
) {

  const f = useFormContext<CreateRecipeInGrocy>()


  const {fields} = useFieldArray<CreateRecipeInGrocy>({
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
                      {...a}
                  />
              ))}
            </FormProvider>
          </TableBody>
        </Table>
      </div>
  )
}

const IngredientTableRow = (
    {ingredientName, index}: { ingredientName: string; index: number }
) => {
  const f = useFormContext<CreateRecipeInGrocy>()

  const {data: products} = api.grocy.getProducts.useQuery()

  const isRowIgnored = f.watch(`ingredients.${index}.ignored`)

  return (
      <TableRow>
        <TableCell className={isRowIgnored ? "line-through" : ''}>{ingredientName}</TableCell>
        <TableCell>
          <Controller render={({field}) =>
              <GrocyProductCombobox
                  productName={ingredientName}
                  disabled={isRowIgnored}
                  value={field.value}
                  setValue={(a) => {
                    field.onChange(a)
                    const prod = products ? products.find(b => b.id === a) : undefined
                    if (prod) {
                      f.setValue(`ingredients.${index}.unitId`, prod.qu_id_stock)
                    }
                  }}
              />
          } name={`ingredients.${index}.productId`} control={f.control}/>

        </TableCell>
        <TableCell>
          <Input type="number" disabled={isRowIgnored} {...f.register(`ingredients.${index}.amount`)} />
        </TableCell>
        <TableCell>
          <Controller render={({field}) =>
              <GrocyUnitCombobox
                  disabled={isRowIgnored}
                  value={field.value}
                  setValue={field.onChange}
              />
          } name={`ingredients.${index}.unitId`} control={f.control}/> </TableCell>
        <TableCell className="flex gap-2">
          <Controller render={({field, fieldState, formState}) => {
            return (<Button onClick={() => field.onChange(!field.value)}>{field.value ? "Unignore" : "Ignore"}</Button>)

          }} name={`ingredients.${index}.ignored`} control={f.control}/>
        </TableCell>
      </TableRow>
  )
}
