import { useEffect, useState } from "react";
import axios from "axios";
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
import MenuAppBar from "../components/MenuAppBar";
import { tokenAtom } from "../App";
import { rbTheme } from "../styles/styles";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";

export function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const [token, setToken] = useAtom(tokenAtom);

  const login = async () => {
    try {
      const { data } = await axios.post("/api/auth/login", {
        username: username,
        password: password,
      });
      setToken(data);

      navigate("/recipes");
    } catch (e) {
      console.log(e);
    }
  };

  const checkIfSetup = async () => {
    try {
      if (token.access_token) {
        navigate("/recipes");
        return;
      }
      const { data } = await axios.get("/api/users/setup");
      // const { data } = await get("/api/users/setup", token.access_token);
      if (!data.isSetup) navigate("/setup");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkIfSetup();
  }, []);

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
          <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Stack justifyContent="center">
                  <Typography variant="h6">Login</Typography>
                  <TextField
                    value={username}
                    label="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    margin="dense"
                    required
                  />
                  <TextField
                    value={password}
                    label="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    margin="dense"
                    required
                  />
                  <Button onClick={login} variant="contained">
                    Log in
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
