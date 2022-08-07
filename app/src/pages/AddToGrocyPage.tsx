import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Ingredient, Product, QuantityUnit, Recipe } from "../types/types";
import { IngredientRow } from "../components/IngredientRow";
import { useAtom } from "jotai";
import { rbTheme } from "../styles/styles";
import MenuAppBar from "../components/MenuAppBar";
import { tokenAtom } from "../App";

export function AddToGrocyPage() {
  const params = useParams();

  const [token] = useAtom(tokenAtom);

  const navigate = useNavigate();
  const getProductsSlug = "/api/objects/products";
  const getQuantityUnitsSlug = "/api/objects/quantity_units";

  const [grocyBase, setGrocyBase] = useState<string>("");
  const [grocyKey, setGrocyKey] = useState<string>("");

  const [recipe, setRecipe] = useState<Recipe>();
  const [products, setProducts] = useState<Product[]>([]);
  const [quantityUnits, setQuantityUnits] = useState<QuantityUnit[]>([]);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [recipeLoaded, setRecipeLoaded] = useState<boolean>(false);
  const [productsLoaded, setProductsLoaded] = useState<boolean>(false);
  const [unitsLoaded, setUnitsLoaded] = useState<boolean>(false);

  const [
    allIngredientsConfirmedOrIgnored,
    setAllIngredientsConfirmedOrIgnored,
  ] = useState<boolean>(false);

  const [allIngredientsIgnored, setAllIngredientsIgnored] =
    useState<boolean>(false);

  const [masterMap, setMasterMap] = useState<Map<number, Ingredient>>(
    new Map<number, Ingredient>()
  );

  const updateMasterMap = (key: number, value: any) => {
    setMasterMap(new Map(masterMap.set(key, value)));
    // console.log("Master map after transformation:");
    // masterMap.forEach((v, k) => console.log(k, v));
  };

  async function retrieveRecipe() {
    try {
      const { data } = await axios.get(`/api/recipes/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      setRecipe(data);
      setRecipeLoaded(true);
      data.ingredients.forEach((value: Ingredient, index: number) =>
        updateMasterMap(index, {})
      );
    } catch (e) {
      alert(e);
    }
  }

  async function getProducts() {
    interface ProductData {
      data: Product[];
    }

    const { data }: ProductData = await axios.get(
      `${grocyBase}${getProductsSlug}`,
      {
        headers: { "GROCY-API-KEY": grocyKey },
      }
    );

    const sortedProducts = data.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    setProducts(sortedProducts);
    setProductsLoaded(true);

    return data;
  }

  async function getQuantityUnits() {
    const { data } = await axios.get(`${grocyBase}${getQuantityUnitsSlug}`, {
      headers: { "GROCY-API-KEY": grocyKey },
    });
    setQuantityUnits(data);
    setUnitsLoaded(true);
  }

  function areAllIngredientsConfirmedOrIgnored() {
    try {
      masterMap.forEach((value) => {
        if (!value.isConfirmed && !value.isIgnored) {
          throw new Error("Found unconfirmed ingredient");
        }
      });
      setAllIngredientsConfirmedOrIgnored(true);
    } catch (e) {
      setAllIngredientsConfirmedOrIgnored(false);
    }
  }

  function areAllIngredientsIgnored() {
    try {
      masterMap.forEach((value) => {
        if (!value.isIgnored) {
          throw new Error("Found unignored ingredient");
        }
      });
      setAllIngredientsIgnored(true);
    } catch (e) {
      setAllIngredientsIgnored(false);
    }
  }

  async function addToGrocy() {
    const completedIngredients: Ingredient[] = [];
    try {
      console.log(recipe);
      masterMap.forEach((value) => {
        if (!value.isIgnored) completedIngredients.push(value);
        if (!value.isConfirmed && !value.isIgnored)
          throw new Error("All items not confirmed/ignored");
      });

      await axios.post(
        "/api/grocy/addRecipe",
        {
          _id: recipe?._id,
          name: recipe?.name,
          steps: recipe?.steps,
          imageUrl: recipe?.imageUrl,
          ingredients: completedIngredients,
        },
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );
      navigate("/recipes");
    } catch (e) {
      window.alert(e);
    }
  }

  async function getGrocyCredentials() {
    try {
      const { data } = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      setGrocyBase(data.grocyBaseUrl);
      setGrocyKey(data.grocyApiKey);
      console.log("Grocy credentials retrieved");
    } catch (e) {
      console.log(e);
    }
  }

  async function preparePage() {
    retrieveRecipe();
    getProducts();
    getQuantityUnits();
  }

  useEffect(() => {
    getGrocyCredentials();
  }, []);

  useEffect(() => {
    if (grocyKey !== "" && grocyBase !== "") {
      console.log("Preparing page");
      preparePage();
    }
  }, [grocyKey, grocyBase]);

  useEffect(() => {
    setIsLoaded(recipeLoaded && productsLoaded && unitsLoaded);
  }, [recipeLoaded, productsLoaded, unitsLoaded]);

  useEffect(() => {
    console.log("Master map updated - new values:");
    masterMap.forEach((v, k) => console.log(k, v));
    areAllIngredientsConfirmedOrIgnored();
    areAllIngredientsIgnored();
  }, [masterMap]);

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
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              {isLoaded ? (
                <Fragment>
                  <h1>Add recipe to Grocy</h1>
                  <TextField
                    required
                    label="Recipe Name"
                    value={recipe?.name}
                    onChange={(e) =>
                      setRecipe((recipe) => {
                        if (!recipe) return;
                        return { ...recipe, name: e.target.value };
                      })
                    }
                  />
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Recipe Ingredient</TableCell>
                          <TableCell>Grocy Product</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Use any unit</TableCell>
                          <TableCell>Quantity Unit</TableCell>
                          <TableCell>Create Product</TableCell>
                          <TableCell>Confirm</TableCell>
                          <TableCell>Ignore</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recipe?.ingredients
                          ? recipe?.ingredients.map((ingredient, index) => {
                              return (
                                <IngredientRow
                                  key={index}
                                  ingredient={ingredient}
                                  index={index}
                                  grocyBase={grocyBase}
                                  products={products}
                                  quantityUnits={quantityUnits}
                                  isLoaded={isLoaded}
                                  updateMasterMap={updateMasterMap}
                                  refreshProducts={getProducts}
                                />
                              );
                            })
                          : null}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Stack direction="row">
                    <Button onClick={() => navigate("/recipes")}>Back</Button>
                    <Button
                      onClick={addToGrocy}
                      disabled={
                        !allIngredientsConfirmedOrIgnored ||
                        allIngredientsIgnored
                      }
                    >
                      Add recipe!
                    </Button>
                  </Stack>
                </Fragment>
              ) : null}
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
