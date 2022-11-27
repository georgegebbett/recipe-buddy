import { FC, Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { tokenAtom } from '../../App';
import { Ingredient, Product, QuantityUnit, Recipe } from '../../types/types';
import { useApiFetch } from '../../hooks/useApiClient';
import { fetchAndCast } from '../../lib/fetch';
import { useFromTaskEither } from '../../hooks/useAsync';
import { constNull, pipe } from 'fp-ts/function';
import { refreshFold } from '@nll/datum/DatumEither';
import axios from 'axios';
import { Box, Button, Container, Paper, Stack, TextField, ThemeProvider, Toolbar } from '@mui/material';
import { rbTheme } from '../../styles/styles';
import { IngredientTable } from '../../components/new/IngredientTable';
import { useUser } from '../../contexts/User';
import { Skeleton } from '../../elements/elements';

export const AddToGrocyPage: FC = () => {
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

  const api = useApiFetch(fetchAndCast<Recipe>())
  const {status, execute} = useFromTaskEither(api)

  useEffect(() => {execute(`recipes/${params.id}`)}, [])

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

  const {grocy} = useUser()

  async function preparePage() {
    // retrieveRecipe();
    getProducts();
    getQuantityUnits();
  }


  useEffect(() => {
    console.log("Master map updated - new values:");
    masterMap.forEach((v, k) => console.log(k, v));
    areAllIngredientsConfirmedOrIgnored();
    areAllIngredientsIgnored();
  }, [masterMap]);

  return pipe(
    status,
    refreshFold(
      () => <Skeleton/>,
      () => <Skeleton/>,
      () => <Skeleton/>,
      a => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <IngredientTable ingredients={a.ingredients} products={products}/>
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
          </div>
        </>
      ),
    )
  )

}
