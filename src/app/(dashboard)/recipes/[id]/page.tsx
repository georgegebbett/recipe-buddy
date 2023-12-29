"use client"

import Link from "next/link"
import {api} from "~/trpc/react"
import {RouterOutputs} from "~/trpc/shared"

import {EmptyPlaceholder} from "~/components/empty-placeholder"
import {DashboardHeader} from "~/components/header"
import {IngredientTable} from "~/components/ingredient-table"
import {NewRecipeDialog} from "~/components/new-recipe-dialog"
import {DashboardShell} from "~/components/shell"
import {Controller, FormProvider, useForm, useFormContext} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateRecipeInGrocySchema} from "~/server/api/modules/grocy/procedures/createRecipeInGrocySchema";
import {Input} from "~/components/ui/input";
import {Textarea} from "~/components/ui/textarea";

// export const metadata = {
//   title: "Dashboard",
// }

type RecipeWithIngredients = RouterOutputs["recipe"]["get"]
export default async function DashboardPage(
    {params}: { params: { id: string } }
) {
  const {data: recipe, isLoading} = api.recipe.get.useQuery({
    id: parseInt(params.id),
  })

  return (
      <DashboardShell>
        {recipe && (
            <RecipeForm recipe={recipe}/>
        )}
      </DashboardShell>
  )
}

const RecipeForm = ({recipe}: { recipe: NonNullable<RecipeWithIngredients> }) => {
  const form = useForm({
    resolver: zodResolver(CreateRecipeInGrocySchema),
    defaultValues: {
      ingredients: recipe.ingredients.map((a) => {
        const amount = /\d+/g.exec(a.scrapedName)
        return {
          scrapedName: a.scrapedName,
          amount: amount ? parseInt(amount[0]) : undefined,
          ignored: false,
        }
      }),
      recipeName: recipe.name,
      method: recipe.steps
    },
  })

  return (
      <FormProvider {...form}>
        <DashboardHeader
            heading={form.watch("recipeName")}
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
        <div className="flex flex-col">
          <p>{JSON.stringify(form.formState.isValid)}</p>
          <p>{JSON.stringify(form.watch())}</p>
          <IngredientTable recipeIngredients={recipe.ingredients}/>
          <Controller render={({field, fieldState, formState}) => (
              <Textarea {...field}/>
          )} name="method" control={form.control}/>
        </div>
      </FormProvider>
  )

}

const NoRecipesPlaceholder = () => (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="post"/>
      <EmptyPlaceholder.Title>No recipes added</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        You haven&apos;t added any recipes yet. Why not add one?
      </EmptyPlaceholder.Description>
      <NewRecipeDialog variant="outline"/>
    </EmptyPlaceholder>
)
