import { Alert, AlertTitle, Snackbar } from "@mui/material";

interface PropTypes {
  open: boolean;
  error: boolean;
  errorMessage: string;
  handleClose: () => void;
}

export function RecipeResultSnackBar(props: PropTypes) {
  const { open, error, errorMessage, handleClose } = props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={error ? "error" : "success"} onClose={handleClose}>
        <AlertTitle>{error ? "Error adding recipe" : "Success"}</AlertTitle>
        {error ? errorMessage : "Recipe added successfully"}
      </Alert>
    </Snackbar>
  );
}
