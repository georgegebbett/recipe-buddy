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
import { IngredientTable } from "~/components/ingredient-table"
import { RecipeTitleInput } from "~/components/recipe-title-input"

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
      method: recipe.steps || undefined,
      imageUrl: recipe.imageUrl || undefined,
      recipeBuddyRecipeId: recipe.id,
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
          <Link
            href={recipe.url}
            className="text-muted-foreground pl-1 text-lg"
            target="_blank"
          >
            View Original
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <IngredientTable grocyBaseUrl={grocyBaseUrl ?? ""} />
          <Button type="submit" isLoading={mutLoading} className="self-end">
            Create Recipe
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
