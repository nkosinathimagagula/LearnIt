import pool from "../config/database";
import type { Recipe } from "../types/database";

export const addRecipeToFavourites = async (
  recipe: Recipe
): Promise<Recipe | undefined> => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "INSERT INTO favourites (user_id, recipe_id, title, image, cook_time, servings) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        recipe.userId,
        recipe.recipeId,
        recipe.title,
        recipe.image,
        recipe.cookTime,
        recipe.servings,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error adding recipe to favourites: ", error);

    throw error;
  } finally {
    client.release();
  }
};

export const removeRecipeFromFavourites = async (
  userId: string,
  recipeId: string
): Promise<Recipe | undefined> => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "DELETE FROM favourites WHERE user_id = $1 AND recipe_id = $2 RETURNING *",
      [userId, recipeId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error removing recipe from favourites: ", error);
    throw error;
  } finally {
    client.release();
  }
};
