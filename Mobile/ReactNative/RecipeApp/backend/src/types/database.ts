export type Recipe = {
  id?: number;
  userId: number;
  recipeId: number;
  title: string;
  image?: string;
  cookTime?: number;
  servings?: number;
  createdAt?: Date;
};
