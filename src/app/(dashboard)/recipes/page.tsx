'use client'

import {EmptyPlaceholder} from "~/components/empty-placeholder"
import {DashboardHeader} from "~/components/header"
import {DashboardShell} from "~/components/shell"
import {api} from "~/trpc/react";
import {RecipeCard} from "~/components/recipe-card";
import {NewRecipeDialog} from "~/components/new-recipe-dialog";


export default async function DashboardPage() {

  const {data: recipes, isLoading} = api.recipe.list.useQuery()


  return (
      <DashboardShell>
        <DashboardHeader heading="Recipes" text="Add and manage recipes.">
          <NewRecipeDialog/>
        </DashboardHeader>
        <div className="grid grid-cols-3 gap-4">
          {recipes && recipes.length > 0 ? recipes.map(a => <RecipeCard key={a.id} recipe={a}/>) :
              <NoRecipesPlaceholder/>}
        </div>
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
