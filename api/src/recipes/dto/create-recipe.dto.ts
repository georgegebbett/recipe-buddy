export class CreateRecipeDto {
  url: string;
  name?: string;
  ingredients?: string[];
  steps?: string[];
  imageUrl?: string;
}
