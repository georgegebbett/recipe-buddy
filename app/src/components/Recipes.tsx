import { Grid, Paper } from "@mui/material";
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
    <Grid container spacing={2} justifyContent="center" alignItems="center">
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
  );
}
