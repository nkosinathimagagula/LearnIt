import express from "express";
import { ENV } from "./config/env";
import type { Recipe } from "./types/database";
import { addRecipeToFavourites } from "./utils/database";
import { validateAlphanumeric } from "./utils/validations";

const PORT = ENV.SERVER_PORT;

const app = express();

app.use(express.json());

app.get("/api/health", (_, res) => {
  return res.status(200).json({ success: true, message: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/api/favourites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const { isValid, invalidKey } = validateAlphanumeric(req.body, [
      "userId",
      "recipeId",
      "title",
      "cookTime",
      "servings",
    ]);

    if (!isValid) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Invalid value for \"${invalidKey}\"`,
        });
    }

    const newFavourite = {
      userId,
      recipeId,
      title,
      image,
      cookTime,
      servings,
    } as Recipe;

    const result = await addRecipeToFavourites(newFavourite);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Error adding recipe to favourites: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
