import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Atom, useAtom } from "jotai";
import axios from "axios";

interface propTypes {
  tokenAtom: Atom<any>;
  modalOpen: boolean;
  setModalOpen: Function;
  getRecipes: Function;
}

export function AddRecipeModal({
  tokenAtom,
  modalOpen,
  setModalOpen,
  getRecipes,
}: propTypes) {
  const [newRecipeUrl, setNewRecipeUrl] = useState("");

  const [token] = useAtom(tokenAtom);

  const handleClose = () => {
    setModalOpen(false);
  };

  const addRecipe = async () => {
    await axios.post(
      "http://localhost:4000/recipes",
      { url: newRecipeUrl },
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );
    getRecipes();
    handleClose();
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
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
