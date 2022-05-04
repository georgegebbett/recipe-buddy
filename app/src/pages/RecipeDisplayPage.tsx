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

export function RecipeDisplayPage() {
  const [token] = useAtom(tokenAtom);

  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fabStyle = {
    position: "sticky",
    right: 16,
    bottom: 16,
  };

  const getRecipes = async () => {
    const { data } = await axios.get("/api/recipes", {
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
            getRecipes={getRecipes}
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

// interface propTypes {
//   tokenAtom: Atom<any>;
// }
