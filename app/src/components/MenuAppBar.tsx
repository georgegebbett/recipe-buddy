import {
  IconButton,
  Toolbar,
  AppBar,
  Typography,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Atom, useAtom } from "jotai";
import { Token } from "../types/types";
import { AccountCircle } from "@mui/icons-material";
import { ChangeEvent, useState } from "react";
import axios from "axios";

interface PropTypes {
  tokenAtom: Atom<Token>;
}

export default function MenuAppBar({ tokenAtom }: PropTypes) {
  const [token, setToken] = useAtom(tokenAtom);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: ChangeEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    await axios.delete("http://localhost:4000/auth/login", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    // @ts-ignore
    setToken({});
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ flexGrow: 1 }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography component="div" sx={{ flexGrow: 1 }} variant="h6">
            Recipe Buddy
          </Typography>
          {token.username ? (
            <div>
              <IconButton color="inherit" onClick={handleMenu}>
                <AccountCircle />
              </IconButton>
              <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                onClose={handleClose}
              >
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : null}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
