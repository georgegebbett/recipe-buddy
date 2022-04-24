import { Atom, useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import { Recipe } from "../types/types";
import axios from "axios";
import { Recipes } from "../components/Recipes";
import { Button, Fab, Typography } from "@mui/material";
import { AddRecipeModal } from "../components/AddRecipeModal";
import AddIcon from "@mui/icons-material/Add";

export function RecipeDisplayPage({ tokenAtom }: propTypes) {
  const [token] = useAtom(tokenAtom);

  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const getRecipes = async () => {
    const { data } = await axios.get("http://localhost:4000/recipes", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    setRecipes(data);
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <Fragment>
      <Typography variant="h1">Recipes</Typography>
      <AddRecipeModal
        tokenAtom={tokenAtom}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        getRecipes={getRecipes}
      />
      <Recipes
        recipes={recipes}
        tokenAtom={tokenAtom}
        getRecipes={getRecipes}
      />
      <Fab
        color="primary"
        onClick={() => setModalOpen(true)}
        variant="extended"
      >
        <AddIcon sx={{ mr: 1 }} />
        Add Recipe
      </Fab>
    </Fragment>
  );
}

interface propTypes {
  tokenAtom: Atom<any>;
}
