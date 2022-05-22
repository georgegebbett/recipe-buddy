import { Alert, AlertTitle, Snackbar } from "@mui/material";

interface PropTypes {
  open: boolean;
  error: boolean;
  errorMessage: string;
  successMessage: string;
  handleClose: () => void;
}

export function ResultSnackBar(props: PropTypes) {
  const { open, error, errorMessage, successMessage, handleClose } = props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert severity={error ? "error" : "success"} onClose={handleClose}>
        <AlertTitle>{error ? "Error" : "Success"}</AlertTitle>
        {error ? errorMessage : successMessage}
      </Alert>
    </Snackbar>
  );
}
