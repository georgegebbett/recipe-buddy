'use client'

import {EmptyPlaceholder} from "~/components/empty-placeholder"
import {DashboardHeader} from "~/components/header"
import {DashboardShell} from "~/components/shell"
import {api} from "~/trpc/react";
import Link from "next/link";
import {RouterOutputs} from "~/trpc/shared";
import {NewRecipeDialog} from "~/components/new-recipe-dialog";

// export const metadata = {
//   title: "Dashboard",
// }

type RecipeWithIngredients = RouterOutputs['recipe']['get']
export default async function DashboardPage({params}: { params: { id: string } }) {

  const {data: recipe, isLoading} = api.recipe.get.useQuery({id: params.id})


  return (
      <DashboardShell>
        {recipe && (
            <>
              <DashboardHeader heading={recipe.name} className="flex-col items-start gap-2">
                <Link href={recipe.url} className="text-muted-foreground text-lg" target="_blank">View Original</Link>
              </DashboardHeader>
              <div className="grid grid-cols-3">
                {JSON.stringify(recipe)}
              </div>
            </>
        )}
      </DashboardShell>
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
