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
import { rbTheme } from "../styles/styles";
import { useNavigate } from "react-router-dom";

export function SetupPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const submitSetup = async () => {
    try {
      const { data } = await axios.post("/api/users/setup", {
        username: username,
        password: password,
      });
      console.log(data);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const checkIfSetup = async () => {
    try {
      const { data } = await axios.get("/api/users/setup");
      if (data.isSetup) navigate("/");
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
                  <Typography variant="h6">Set up new user</Typography>
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
                  <Button onClick={submitSetup}>Setup</Button>
                </Stack>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
