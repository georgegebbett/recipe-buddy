interface GrocyIngredient {
  grocyProductId: string;
  quantity: string;
  useAnyUnit: boolean;
  quantityUnitId: string;
}

export class AddRecipeToGrocyDto {
  _id: string;
  name: string;
  steps: string[];
  ingredients: GrocyIngredient[];
  imageUrl: string;
}
