"use client"

import { api } from "~/trpc/react"

import { Button } from "~/components/ui/button"

type DeleteRecipeButtonProps = {
  recipeId: number
}

export function DeleteRecipeButton({ recipeId }: DeleteRecipeButtonProps) {
  const utils = api.useUtils()
  const { mutate, isLoading } = api.recipe.delete.useMutation({
    onSuccess: () => utils.recipe.list.invalidate(),
  })

  const handleDelete = () => {
    mutate({ recipeId })
  }

  return (
    <Button variant="destructive" onClick={handleDelete} isLoading={isLoading}>
      Delete
    </Button>
  )
}
