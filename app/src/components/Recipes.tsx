import { Box, Grid, Paper, Typography } from "@mui/material";
import { Recipe } from "../types/types";
import { RecipeCard } from "./RecipeCard";
import { Atom } from "jotai";

interface propTypes {
  recipes: Array<Recipe>;
  tokenAtom: Atom<any>;
  getRecipes: Function;
}

export function Recipes({ recipes, tokenAtom, getRecipes }: propTypes) {
  return (
    <Paper
      sx={{ p: 2, display: "flex", flexDirection: "column", minHeight: 240 }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        New recipes
      </Typography>
      <Grid
        container
        spacing={2}
        justifyContent="flex-start"
        alignItems="center"
      >
        {recipes.map((recipe, index) => (
          <Grid key={index} item>
            <RecipeCard
              recipe={recipe}
              tokenAtom={tokenAtom}
              getRecipes={getRecipes}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
