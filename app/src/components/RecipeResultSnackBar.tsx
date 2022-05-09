import { Alert, Snackbar } from "@mui/material";

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
      {error ? (
        <Alert severity="error">{errorMessage}</Alert>
      ) : (
        <Alert severity="success">Recipe added successfully</Alert>
      )}
    </Snackbar>
  );
}
