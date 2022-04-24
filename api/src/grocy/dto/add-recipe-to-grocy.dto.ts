interface Ingredient {
  grocyProductId: string
  quantity: string
  useAnyUnit: boolean
  quantityUnitId: string
}

export class AddRecipeToGrocyDto {
  name: string
  steps: string[]
  ingredients: Ingredient[]
  imageUrl: string
}
