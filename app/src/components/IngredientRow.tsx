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
  const [quantityUnitId, setQuantityUnitId] = useState<string>();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const [isReadyToRender, setIsReadyToRender] = useState<boolean>(false);

  function setPageShowListener() {
    window.addEventListener("visibilitychange", logEvent);
    console.log("listener set");
  }

  async function logEvent(event: any) {
    if (!document.hidden) {
      console.log(event);
      await refreshProducts();
      window.removeEventListener("visibilitychange", logEvent);
      console.log("listener unset");
      setGrocyProductId(products[products.length - 1].id);
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
      label="Quantity Unit"
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
    });
    setIsConfirmed(!isConfirmed);
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
    if (isLoaded) {
      setGrocyProductId(products[0].id);
      // @ts-ignore
      setQuantity(ingredient.match(/^\d+/) ? ingredient.match(/^\d+/)[0] : "");
      setQuantityUnitId(getQuantityUnitByProductId(products[0].id).id);
      setIsReadyToRender(true);
    }
  }, [isLoaded]);

  return isReadyToRender ? (
    <TableRow key={index}>
      <TableCell>{ingredient}</TableCell>
      <TableCell>
        <Autocomplete
          disabled={isConfirmed}
          options={products}
          getOptionLabel={(product) => product.name}
          renderInput={(params) => <TextField {...params} label="Product" />}
          onChange={handleAutocompleteChange}
          value={products.filter((product) => product.id === grocyProductId)[0]}
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
          disabled={isConfirmed}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          checked={useAnyUnit}
          onChange={toggleAnyUnit}
          disabled={isConfirmed}
        />
      </TableCell>
      <TableCell>
        {useAnyUnit ? (
          <QuantityUnitDropdown disabled={isConfirmed} />
        ) : (
          getQuantityUnitByProductId(grocyProductId).name
        )}
      </TableCell>

      <TableCell>
        <Button
          onClick={() => createProduct(ingredient)}
          disabled={isConfirmed}
        >
          Create Product
        </Button>
      </TableCell>
      <TableCell>
        <Button onClick={handleConfirm}>
          {isConfirmed ? "Confirmed" : "Confirm"}
        </Button>
      </TableCell>
    </TableRow>
  ) : null;
}
