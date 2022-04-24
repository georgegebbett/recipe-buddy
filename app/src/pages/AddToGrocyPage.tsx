import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Recipe } from "../types/types";
import { IngredientRow } from "../components/IngredientRow";
import { Atom, useAtom } from "jotai";

interface PropTypes {
  tokenAtom: Atom<any>;
}

interface Ingredient {
  grocyProductId: string;
  quantity: string;
  useAnyUnit: boolean;
  quantityUnitId: string;
}

export function AddToGrocyPage({ tokenAtom }: PropTypes) {
  const params = useParams();

  const [token] = useAtom(tokenAtom);

  const navigate = useNavigate();
  const grocyBase = "https://test-r6aira2jrtr52y34eks6.demo.grocy.info";
  const grocyKey = "bMSJRlURCPkG5tMW8xpnZYXS6dAYXmMM4ROomYrm7VX6rv8R7m";
  const getProductsSlug = "/api/objects/products";
  const getQuantityUnitsSlug = "/api/objects/quantity_units";

  const [recipe, setRecipe] = useState<Recipe>();
  const [products, setProducts] = useState([]);
  const [quantityUnits, setQuantityUnits] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);

  const [recipeLoaded, setRecipeLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [unitsLoaded, setUnitsLoaded] = useState(false);

  const masterMap = new Map();

  const updateMasterMap = (key: string, value: any) => {
    masterMap.set(key, value);
  };

  async function retrieveRecipe() {
    const { data } = await axios.get(
      `http://localhost:4000/recipes/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );
    setRecipe(data);
    setRecipeLoaded(true);
  }

  async function getProducts() {
    const { data } = await axios.get(`${grocyBase}${getProductsSlug}`, {
      headers: { "GROCY-API-KEY": grocyKey },
    });
    setProducts(data);
    setProductsLoaded(true);
  }

  async function getQuantityUnits() {
    const { data } = await axios.get(`${grocyBase}${getQuantityUnitsSlug}`, {
      headers: { "GROCY-API-KEY": grocyKey },
    });
    setQuantityUnits(data);
    setUnitsLoaded(true);
  }

  async function addToGrocy() {
    const completedIngredients: Ingredient[] = [];
    try {
      console.log(recipe);
      masterMap.forEach((value) => {
        console.log(value);
        completedIngredients.push(value);
        if (!value.isConfirmed) throw new Error("All items not confirmed");
      });

      await axios.post(
        "http://localhost:4000/grocy/addRecipe",
        {
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

  useEffect(() => {
    retrieveRecipe();
    getProducts();
    getQuantityUnits();
  }, []);

  useEffect(() => {
    setIsLoaded(recipeLoaded && productsLoaded && unitsLoaded);
  }, [recipeLoaded, productsLoaded, unitsLoaded]);

  return (
    <Fragment>
      {isLoaded ? (
        <div>
          <h1>Add recipe {params.recipeId} to Grocy</h1>
          <h3>{recipe.name}</h3>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {recipe.ingredients
                  ? recipe.ingredients.map((ingredient, index) => {
                      masterMap.set(index, {});
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

          <Button onClick={() => navigate("/recipes")}>Back</Button>
          <Button onClick={addToGrocy}>Add recipe!</Button>
        </div>
      ) : null}
    </Fragment>
  );
}
