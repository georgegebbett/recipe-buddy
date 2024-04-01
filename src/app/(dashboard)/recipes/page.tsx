"use client"

import { api } from "~/trpc/react"

import { EmptyPlaceholder } from "~/components/empty-placeholder"
import { DashboardHeader } from "~/components/header"
import { NewRecipeDialog } from "~/components/new-recipe-dialog"
import { RecipeCard } from "~/components/recipe-card"
import { DashboardShell } from "~/components/shell"

export default function DashboardPage() {
  const { data: recipes } = api.recipe.list.useQuery()

  return (
    <DashboardShell>
      <DashboardHeader heading="Recipes" text="Add and manage recipes.">
        <NewRecipeDialog />
      </DashboardHeader>
      {recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {recipes.map((a) => (
            <RecipeCard key={a.id} recipe={a} />
          ))}
        </div>
      ) : (
        <NoRecipesPlaceholder />
      )}
    </DashboardShell>
  )
}

const NoRecipesPlaceholder = () => (
  <EmptyPlaceholder>
    <EmptyPlaceholder.Icon name="post" />
    <EmptyPlaceholder.Title>No recipes added</EmptyPlaceholder.Title>
    <EmptyPlaceholder.Description>
      You haven&apos;t added any recipes yet. Why not add one?
    </EmptyPlaceholder.Description>
    <NewRecipeDialog variant="outline" />
  </EmptyPlaceholder>
)
