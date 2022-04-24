export interface Token {
  access_token?: string;
  refresh_token?: string;
  username?: string;
  roles?: string[];
}

export interface Recipe {
  _id: string;
  url: string;
  name: string;
  imageUrl: string;
  ingredients: string[];
  steps: string[];
}
