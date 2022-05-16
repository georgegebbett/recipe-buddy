import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Input,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import axios from "axios";
import { rbTheme } from "../styles/styles";
import MenuAppBar from "../components/MenuAppBar";
import { useNavigate } from "react-router-dom";
import { tokenAtom } from "../App";
import { ResultSnackBar } from "../components/ResultSnackBar";

export function SettingsPage() {
  const [token, setToken] = useAtom(tokenAtom);

  const [grocyBaseUrl, setGrocyBaseUrl] = useState<string>("");
  const [grocyApiKey, setGrocyApiKey] = useState<string>("");
  const [grocySettingsCorrect, setGrocySettingsCorrect] =
    useState<boolean>(false);

  const [uploadFile, setUploadFile] = useState<File>();

  const [snackBarOpen, setSnackBarOpen] = useState<boolean>(false);
  const [snackBarError, setSnackBarError] = useState<boolean>(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState<string>("");

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const navigate = useNavigate();

  async function updateSettings() {
    if (!(grocyApiKey && grocyBaseUrl)) throw new Error("Fill in boxes pls");

    try {
      const { data } = await axios.put(
        "/api/users",
        {
          grocyBaseUrl: grocyBaseUrl,
          grocyApiKey: grocyApiKey,
        },
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );
      console.log(data);
      setGrocySettingsCorrect(true);
    } catch (e) {
      console.log(e);
      setGrocySettingsCorrect(false);
    }
  }

  async function getCurrentSettings() {
    try {
      const { data } = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      console.log(data);
      setGrocyBaseUrl(data.grocyBaseUrl);
      setGrocyApiKey(data.grocyApiKey);
    } catch (e) {
      console.log(e);
    }
  }

  async function logout() {
    try {
      await axios.delete("/api/auth/login", {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      // @ts-ignore
      setToken({});
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getCurrentSettings();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploadFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!uploadFile) {
      return;
    }

    const formData = new FormData();

    formData.append("file", uploadFile, uploadFile.name);

    try {
      await axios.post("/api/import/upload", formData, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      setUploadFile(undefined);
      setSnackBarError(false);
      setSnackBarOpen(true);
    } catch (e: any) {
      setSnackBarOpen(true);
      setSnackBarError(true);
      setSnackbarErrorMessage(e.response.data.message);
    }
  };

  return (
    <ThemeProvider theme={rbTheme}>
      <Box sx={{ display: "flex" }}>
        <MenuAppBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            backgroundColor: (theme) => theme.palette.grey[100],
          }}
        >
          <Toolbar />
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Stack spacing={2}>
              <Paper>
                <Box sx={{ p: 2 }}>
                  <Stack justifyContent="center">
                    <Typography variant="h6">Grocy Settings</Typography>
                    <TextField
                      label="Grocy Base URL"
                      value={grocyBaseUrl}
                      onChange={(e) => setGrocyBaseUrl(e.target.value)}
                      margin="dense"
                      required
                      type="url"
                    />
                    <TextField
                      label="Grocy API Key"
                      value={grocyApiKey}
                      onChange={(e) => setGrocyApiKey(e.target.value)}
                      margin="dense"
                      required
                    />
                    <Button
                      onClick={updateSettings}
                      disabled={grocyBaseUrl === "" || grocyApiKey === ""}
                    >
                      Update
                    </Button>
                    {grocySettingsCorrect
                      ? "Connected to Grocy"
                      : "Cannot connect to Grocy"}
                  </Stack>
                </Box>
              </Paper>
              <Paper>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6">User Settings</Typography>
                  <Button onClick={logout}>Log out</Button>
                </Box>
              </Paper>
              <Paper>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6">
                    Import recipes from Tandoor
                  </Typography>
                  <Typography variant="body1">
                    To import recipes from Tandoor, export your chosen recipes
                    using the 'Saffron' export type, and upload the resulting
                    JSON file here.
                  </Typography>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    inputProps={{ accept: "application/json" }}
                  />
                  <Button onClick={onFileUpload} disabled={!uploadFile}>
                    Upload
                  </Button>
                  <ResultSnackBar
                    open={snackBarOpen}
                    error={snackBarError}
                    errorMessage={snackbarErrorMessage}
                    successMessage="Recipes imported successfully"
                    handleClose={handleSnackBarClose}
                  />
                </Box>
              </Paper>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
