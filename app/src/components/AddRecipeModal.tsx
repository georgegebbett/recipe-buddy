import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom } from "../App";
import { post } from "../helpers/backendRequests";

interface propTypes {
  modalOpen: boolean;
  setModalOpen: Function;
  getRecipes: Function;
}

export function AddRecipeModal({
  modalOpen,
  setModalOpen,
  getRecipes,
}: propTypes) {
  const [newRecipeUrl, setNewRecipeUrl] = useState("");

  const [token] = useAtom(tokenAtom);

  const handleClose = () => {
    setNewRecipeUrl("");
    setModalOpen(false);
  };

  const addRecipe = async () => {
    await post("/recipes", { url: newRecipeUrl }, token.access_token);

    getRecipes();
    handleClose();
  };

  return (
    <Dialog open={modalOpen} onClose={handleClose}>
      <DialogTitle>Add new recipe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the URL of a recipe and as long as the required metadata is on
          the page, it will be added to the collection
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          variant="standard"
          label="URL"
          margin="dense"
          value={newRecipeUrl}
          onChange={(e) => setNewRecipeUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={addRecipe}>Add recipe</Button>
      </DialogActions>
    </Dialog>
  );
}
