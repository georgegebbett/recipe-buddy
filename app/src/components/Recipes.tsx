import { Grid, Paper, Typography } from "@mui/material";
import { Recipe } from "../types/types";
import { RecipeCard } from "./RecipeCard";

interface propTypes {
  recipes: Array<Recipe>;
  getRecipes: Function;
}

export function Recipes({ recipes, getRecipes }: propTypes) {
  return (
    <Paper
      sx={{ p: 2, display: "flex", flexDirection: "column", minHeight: 240 }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        New recipes
      </Typography>
      {recipes.length === 0 ? (
        <Typography sx={{ textAlign: "center", mt: 7 }} variant="h6">
          No recipes available for import, why not add one?
        </Typography>
      ) : (
        <Grid
          container
          spacing={2}
          justifyContent="flex-start"
          alignItems="center"
        >
          {recipes.map((recipe, index) => (
            <Grid key={index} item>
              <RecipeCard recipe={recipe} getRecipes={getRecipes} />
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}
