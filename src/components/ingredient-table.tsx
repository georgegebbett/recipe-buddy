"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { RouterOutputs } from "~/trpc/shared"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form"
import z from "zod"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { GrocyProductCombobox } from "~/components/grocy-product-combobox"
import { GrocyUnitCombobox } from "~/components/grocy-unit-combobox"

type Ingredient = NonNullable<
  RouterOutputs["recipe"]["get"]
>["ingredients"][number]

const rowSchema = z.union([
  z.object({
    productId: z.number(),
    amount: z.number(),
    unitId: z.number(),
    scrapedName: z.string(),
    ignored: z.literal(false),
  }),
  z.object({
    scrapedName: z.string(),
    ignored: z.literal(true),
  }),
])

const formSchema = z.object({
  rows: rowSchema.array(),
})

type FormSchema = z.infer<typeof formSchema>

export function IngredientTable(
  { ingredients }: { ingredients: Ingredient[] }
) {
  const f = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rows: ingredients.map((a) => {
        const amount = /\d+/g.exec(a.scrapedName)

        return {
          scrapedName: a.scrapedName,
          amount: amount ? parseInt(amount[0]) : undefined,
          ignored: false,
        }
      }),
    },
  })

  const { fields } = useFieldArray<FormSchema>({
    name: "rows",
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
            <TableHead>Actions</TableHead>
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
  { ingredientName, index }: { ingredientName: string; index: number }
) => {
  const f = useFormContext<FormSchema>()

  return (
    <TableRow>
      <TableCell>{ingredientName}</TableCell>
      <TableCell>
        <GrocyProductCombobox />
      </TableCell>
      <TableCell>
        <Input type="number" {...f.register(`rows.${index}.amount`)} />
      </TableCell>
      <TableCell>
        <GrocyUnitCombobox />
      </TableCell>
      <TableCell className="flex gap-2">
        <Button>Ignore</Button>
      </TableCell>
    </TableRow>
  )
}
