// /src/types/index.ts

export interface Ingredient {
  id: number;
  name: string;
  description: string;
  alcohol: boolean;
  percentage: number;
  imageUrl: string;
  measure: string;
  type: string;
}

export interface Cocktail {
  id: number;
  name: string;
  imageUrl: string;
  instructions?: string;
  category: string;
  glass: string;
  alcoholic: boolean;
  ingredients: Ingredient[];
}
