"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CreateRecipeInGrocyCommand,
  CreateRecipeInGrocyCommandSchema,
} from "~/server/api/modules/grocy/procedures/createRecipeInGrocySchema"
import { api } from "~/trpc/react"
import { RouterOutputs } from "~/trpc/shared"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { IngredientTable } from "~/components/ingredient-table"
import { RecipeTitleInput } from "~/components/recipe-title-input"
import * as Tabs from "@radix-ui/react-tabs"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import '../../../../styles/quill-custom.css'

type RecipeFormProps = {
  recipeId: number
  grocyBaseUrl: string
}

export function RecipeForm({ recipeId, grocyBaseUrl }: RecipeFormProps) {
  const { data: recipe } = api.recipe.get.useQuery({
    id: recipeId,
  })

  return (
    recipe && <RecipeFormInner recipe={recipe} grocyBaseUrl={grocyBaseUrl} />
  )
}

type RecipeWithIngredients = RouterOutputs["recipe"]["get"]

function RecipeFormInner({
  recipe,
  grocyBaseUrl,
}: {
  recipe: NonNullable<RecipeWithIngredients>
  grocyBaseUrl?: string
}) {
  const form = useForm<CreateRecipeInGrocyCommand>({
    resolver: zodResolver(CreateRecipeInGrocyCommandSchema),
    defaultValues: {
      ingredients: recipe.ingredients.map((a) => {
        const amount = /\d+/g.exec(a.scrapedName)
        return {
          scrapedName: a.scrapedName,
          amount: amount ? parseInt(amount[0]) : undefined,
          ignored: false as const,
        }
      }),
      recipeName: recipe.name,
      method: recipe.steps ?? undefined,
      imageUrl: recipe.imageUrl ?? undefined,
      recipeBuddyRecipeId: recipe.id,
      servings: recipe.servings ?? undefined,
    },
  })

  const { push } = useRouter()

  const { mutate, isLoading: mutLoading } = api.grocy.createRecipe.useMutation({
    onSuccess: () => {
      toast("Recipe created")
      push("/recipes")
    },
  })

  const onSubmit = (a: CreateRecipeInGrocyCommand) => mutate(a)

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input hidden {...form.register("recipeBuddyRecipeId")} />
        <div className="flex flex-col gap-2">
          <Controller
            render={({ field }) => (
              <RecipeTitleInput value={field.value} onChange={field.onChange} />
            )}
            name="recipeName"
            control={form.control}
          />
          <FormField
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Servings</FormLabel>
                <FormControl>
                  <Input className="max-w-[70px]" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="servings"
            control={form.control}
          />
          <Link
            href={recipe.url}
            className="pl-1 text-lg text-muted-foreground"
            target="_blank"
          >
            View Original
          </Link>
        </div>
          <Tabs.Root defaultValue="ingredients">
            <Tabs.List className="flex-row border-b">
              <Tabs.Trigger className="m-r-1 p-4 radix-state-active:rounded-t-md radix-state-active:border-x radix-state-active:border-t" value="ingredients">Ingredients</Tabs.Trigger>
              <Tabs.Trigger className="m-1 p-4 radix-state-active:rounded-t-md radix-state-active:border-x radix-state-active:border-t" value="steps">Steps</Tabs.Trigger>
            </Tabs.List>
        <div className="flex flex-col gap-2">
          <Tabs.Content value="ingredients">
            <IngredientTable grocyBaseUrl={grocyBaseUrl ?? ""} />
          </Tabs.Content>
          <Tabs.Content value="steps">
            <Controller
              render={({ field }) => (
                <ReactQuill value={field.value} onChange={field.onChange}/>
              )}
              name="method"
              control={form.control}
            />
          </Tabs.Content>
          <Button type="submit" isLoading={mutLoading} className="self-end">
            Create Recipe
          </Button>
        </div>
          </Tabs.Root>
      </form>
    </FormProvider>
  )
}
