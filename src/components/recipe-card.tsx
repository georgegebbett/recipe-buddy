import Link from "next/link"
import { Recipe } from "~/server/db/schema"

import { ROUTES } from "~/lib/routes"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
} from "~/components/ui/card"

export type RecipeCardProps = {
  recipe: Pick<Recipe, "name" | "id" | "imageUrl">
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card>
      {recipe.imageUrl && (
        <CardImage
          src={recipe.imageUrl}
          alt={`An image of ${recipe.name}`}
          className="h-24 object-cover"
        />
      )}
      <CardHeader className="gap-2">
        <CardTitle className="text-xl">{recipe.name}</CardTitle>
      </CardHeader>
      <CardFooter className="justify-between">
        <Button variant="destructive">Delete</Button>
        <Link href={ROUTES.recipes.details(recipe.id)}>
          <Button>Add</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
