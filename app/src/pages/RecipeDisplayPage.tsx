import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Recipe } from "../types/types";
import axios from "axios";
import { Recipes } from "../components/Recipes";
import {
  Box,
  Container,
  Fab,
  Stack,
  SxProps,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { AddRecipeModal } from "../components/AddRecipeModal";
import AddIcon from "@mui/icons-material/Add";
import { rbTheme } from "../styles/styles";
import MenuAppBar from "../components/MenuAppBar";
import { tokenAtom } from "../App";
import { post } from "../helpers/backendRequests";
import { ResultSnackBar } from "../components/ResultSnackBar";

export function RecipeDisplayPage() {
  const [token] = useAtom(tokenAtom);

  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarIsError, setSnackbarIsError] = useState<boolean>(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState<string>("");

  const fabStyle = {
    float: "right",
    position: "absolute",
    right: 30,
    bottom: 30,
  };

  const getRecipes = async () => {
    const { data } = await axios.get("/api/recipes", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    setRecipes(data);
  };

  const addRecipe = async (newRecipeUrl: string) => {
    setModalOpen(false);
    try {
      await post("/recipes", { url: newRecipeUrl }, token.access_token);
      getRecipes();
      setSnackbarIsError(false);
      setSnackbarOpen(true);
    } catch (e: any) {
      setSnackbarErrorMessage(e.response.data.message);
      setSnackbarIsError(true);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <ThemeProvider theme={rbTheme}>
      <Box sx={{ display: "flex" }}>
        <MenuAppBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            backgroundColor: (theme) => theme.palette.grey[100],
          }}
        >
          <Toolbar />
          <AddRecipeModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            addRecipe={addRecipe}
          />
          <ResultSnackBar
            open={snackbarOpen}
            error={snackbarIsError}
            errorMessage={snackbarErrorMessage}
            successMessage="Recipe added successfully"
            handleClose={() => setSnackbarOpen(false)}
          />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Stack spacing={2}>
              <Recipes recipes={recipes} getRecipes={getRecipes} />
            </Stack>
          </Container>
          <Fab
            color="primary"
            onClick={() => setModalOpen(true)}
            variant="extended"
            sx={fabStyle as SxProps}
          >
            <AddIcon sx={{ mr: 1 }} />
            Add Recipe
          </Fab>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
