import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteValue,
  Button,
  Checkbox,
  Input,
  MenuItem,
  Select,
  SelectChangeEvent,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { Product } from "../types/types";

interface PropTypes {
  index: number;
  ingredient: string;
  grocyBase: string;
  products: Array<any>;
  quantityUnits: Array<any>;
  isLoaded: boolean;
  updateMasterMap: Function;
  refreshProducts: Function;
}

export function IngredientRow(props: PropTypes) {
  const {
    index,
    ingredient,
    grocyBase,
    products,
    quantityUnits,
    isLoaded,
    updateMasterMap,
    refreshProducts,
  } = props;

  const newProductSlug =
    "/product/new?closeAfterCreation&flow=InplaceNewProductWithName&name=";

  function createProduct(name: string) {
    setPageShowListener();
    window.open(`${grocyBase}${newProductSlug}${name}`);
  }

  const [useAnyUnit, setUseAnyUnit] = useState<boolean>(false);
  const [grocyProductId, setGrocyProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>();
  const [quantityUnitId, setQuantityUnitId] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isIgnored, setIsIgnored] = useState<boolean>(false);
  const [noProducts, setNoProducts] = useState<boolean>(false);

  const [isReadyToRender, setIsReadyToRender] = useState<boolean>(false);

  function setPageShowListener() {
    window.addEventListener("visibilitychange", logEvent);
    console.log("listener set");
  }

  async function getNewestProduct() {
    const productList = await refreshProducts();

    let highestProductId: number = 0;

    productList.forEach((product: Product) => {
      if (parseInt(product.id) > highestProductId) {
        highestProductId = parseInt(product.id);
      }
    });

    setGrocyProductId(highestProductId.toString());
  }

  async function logEvent(event: any) {
    if (!document.hidden) {
      console.log(event);
      window.removeEventListener("visibilitychange", logEvent);
      console.log("listener unset");
      await getNewestProduct();
    }
  }

  interface QuantityUnitDropdownPropTypes {
    disabled: boolean;
  }

  interface GrocyProduct {
    id: string;
    name: string;
  }

  const QuantityUnitDropdown = ({
    disabled,
  }: QuantityUnitDropdownPropTypes) => (
    <Select
      onChange={(event: SelectChangeEvent) =>
        setQuantityUnitId(event.target.value)
      }
      disabled={disabled}
      value={quantityUnitId}
      // label="Quantity Unit"
    >
      {quantityUnits.map((unit) => (
        <MenuItem key={unit.id} value={unit.id}>
          {unit.name}
        </MenuItem>
      ))}
    </Select>
  );

  const toggleAnyUnit = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setUseAnyUnit(true);
    } else {
      setUseAnyUnit(false);
      setQuantityUnitId(getQuantityUnitByProductId(grocyProductId).id);
    }
  };

  const getQuantityUnitByProductId = (productId: string) => {
    for (const prod of products) {
      if (prod.id == productId) {
        for (const quant of quantityUnits) {
          if (quant.id == prod.qu_id_stock) {
            return quant;
          }
        }
      }
    }
  };

  const handleConfirm = () => {
    updateMasterMap(index, {
      grocyProductId: grocyProductId,
      quantity: quantity,
      useAnyUnit: useAnyUnit,
      quantityUnitId: quantityUnitId,
      isConfirmed: !isConfirmed,
      isIgnored: false,
    });
    setIsConfirmed(!isConfirmed);
  };

  const handleIgnore = () => {
    updateMasterMap(index, {
      isIgnored: !isIgnored,
    });
    setIsIgnored(!isIgnored);
  };

  const handleAutocompleteChange = (
    event: SyntheticEvent,
    value: AutocompleteValue<GrocyProduct, false, false, false>,
    reason: AutocompleteChangeReason
  ) => {
    if (reason === "removeOption") setGrocyProductId("");
    else {
      // @ts-ignore
      setGrocyProductId(value.id);
    }
  };

  useEffect(() => {
    if (isLoaded && products.length !== 0) {
      setGrocyProductId(products[0].id);
      // @ts-ignore
      setQuantity(ingredient.match(/^\d+/) ? ingredient.match(/^\d+/)[0] : "");
      setIsReadyToRender(true);
    } else if (products.length === 0) {
      setNoProducts(true);
      setIsReadyToRender(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (grocyProductId === "") return;
    setQuantityUnitId(getQuantityUnitByProductId(grocyProductId).id);
  }, [grocyProductId]);

  return isReadyToRender ? (
    noProducts ? (
      <TableRow>
        <TableCell colSpan={7} align="center">
          You must add products to Grocy before using Recipe Buddy
        </TableCell>
      </TableRow>
    ) : (
      <TableRow key={index}>
        <TableCell>{ingredient}</TableCell>
        <TableCell>
          <Autocomplete
            disabled={isConfirmed || isIgnored}
            options={products}
            getOptionLabel={(product) => product.name}
            renderInput={(params) => <TextField {...params} label="Product" />}
            onChange={handleAutocompleteChange}
            value={
              products.filter((product) => product.id === grocyProductId)[0]
            }
            disableClearable
            sx={{ minWidth: 200 }}
          />
        </TableCell>
        <TableCell>
          <Input
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder={
              //@ts-ignore
              ingredient.match(/^\d+/) ? ingredient.match(/^\d+/)[0] : ""
            }
            disabled={isConfirmed || isIgnored}
          />
        </TableCell>
        <TableCell>
          <Checkbox
            checked={useAnyUnit}
            onChange={toggleAnyUnit}
            disabled={isConfirmed || isIgnored}
          />
        </TableCell>
        <TableCell>
          {useAnyUnit ? (
            <QuantityUnitDropdown disabled={isConfirmed || isIgnored} />
          ) : (
            <QuantityUnitDropdown disabled={true} />
          )}
        </TableCell>

        <TableCell>
          <Button
            onClick={() => createProduct(ingredient)}
            disabled={isConfirmed || isIgnored}
          >
            Create Product
          </Button>
        </TableCell>
        <TableCell>
          <Button
            onClick={handleConfirm}
            disabled={isIgnored}
            color="success"
            variant="contained"
          >
            {isConfirmed ? "Confirmed" : "Confirm"}
          </Button>
        </TableCell>
        <TableCell>
          <Button
            onClick={handleIgnore}
            disabled={isConfirmed}
            color="error"
            variant="contained"
          >
            {isIgnored ? "Ignored" : "Ignore"}
          </Button>
        </TableCell>
      </TableRow>
    )
  ) : null;
}
