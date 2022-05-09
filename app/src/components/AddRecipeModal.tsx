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

interface propTypes {
  modalOpen: boolean;
  setModalOpen: Function;
  addRecipe: Function;
}

export function AddRecipeModal({
  modalOpen,
  setModalOpen,
  addRecipe,
}: propTypes) {
  const [newRecipeUrl, setNewRecipeUrl] = useState("");

  const handleClose = () => {
    setNewRecipeUrl("");
    setModalOpen(false);
  };

  const addRecipeAndClose = () => {
    setNewRecipeUrl("");
    addRecipe(newRecipeUrl);
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
        <Button onClick={addRecipeAndClose}>Add recipe</Button>
      </DialogActions>
    </Dialog>
  );
}
