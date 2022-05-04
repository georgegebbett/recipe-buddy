interface Ingredient {
  grocyProductId: string;
  quantity: string;
  useAnyUnit: boolean;
  quantityUnitId: string;
}

export class AddRecipeToGrocyDto {
  _id: string;
  name: string;
  steps: string[];
  ingredients: Ingredient[];
  imageUrl: string;
}
