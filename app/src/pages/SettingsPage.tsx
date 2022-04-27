import { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { Atom, useAtom } from "jotai";
import axios from "axios";
import { rbTheme } from "../styles/styles";
import MenuAppBar from "../components/MenuAppBar";

interface PropTypes {
  tokenAtom: Atom<any>;
}

export function SettingsPage({ tokenAtom }: PropTypes) {
  const [token] = useAtom(tokenAtom);

  const [grocyBaseUrl, setGrocyBaseUrl] = useState<string>("");
  const [grocyApiKey, setGrocyApiKey] = useState<string>("");
  const [grocySettingsCorrect, setGrocySettingsCorrect] =
    useState<boolean>(false);

  async function updateSettings() {
    if (!(grocyApiKey && grocyBaseUrl)) throw new Error("Fill in boxes pls");

    try {
      const { data } = await axios.put(
        "http://localhost:4000/users",
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
      const { data } = await axios.get("http://localhost:4000/users/me", {
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

  useEffect(() => {
    getCurrentSettings();
  }, []);

  return (
    <ThemeProvider theme={rbTheme}>
      <Box sx={{ display: "flex" }}>
        <MenuAppBar tokenAtom={tokenAtom} />
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
          <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Stack justifyContent="center">
                  <Typography variant="h6">Grocy Settings</Typography>
                  <TextField
                    label="Grocy Base URL"
                    value={grocyBaseUrl}
                    onChange={(e) => setGrocyBaseUrl(e.target.value)}
                    margin="dense"
                  />
                  <TextField
                    label="Grocy API Key"
                    value={grocyApiKey}
                    onChange={(e) => setGrocyApiKey(e.target.value)}
                    margin="dense"
                  />
                  <Button onClick={updateSettings}>Update</Button>
                  {grocySettingsCorrect
                    ? "Connected to Grocy"
                    : "Cannot connect to Grocy"}
                </Stack>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
