"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CreateRecipeInGrocy,
  CreateRecipeInGrocySchema,
} from "~/server/api/modules/grocy/procedures/createRecipeInGrocySchema"
import { api } from "~/trpc/react"
import { RouterOutputs } from "~/trpc/shared"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { DashboardHeader } from "~/components/header"
import { IngredientTable } from "~/components/ingredient-table"

type RecipeFormProps = {
  recipeId: number
  grocyBaseUrl: string
}

export function RecipeForm({ recipeId, grocyBaseUrl }: RecipeFormProps) {
  const { data: recipe, isLoading } = api.recipe.get.useQuery({
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
  const form = useForm<CreateRecipeInGrocy>({
    resolver: zodResolver(CreateRecipeInGrocySchema),
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

  const onSubmit = (a: CreateRecipeInGrocy) => mutate(a)

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input hidden {...form.register("recipeBuddyRecipeId")} />
        <DashboardHeader
          heading={recipe.name}
          className="flex-col items-start gap-2"
        >
          <Link
            href={recipe.url}
            className="text-muted-foreground text-lg"
            target="_blank"
          >
            View Original
          </Link>
        </DashboardHeader>
        <div className="flex flex-col gap-2">
          <IngredientTable grocyBaseUrl={grocyBaseUrl || ""} />
          <Button type="submit" isLoading={mutLoading} className="self-end">
            Create Recipe
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
