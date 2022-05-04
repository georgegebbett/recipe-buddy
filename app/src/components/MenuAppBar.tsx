import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAtom } from "jotai";
import { Book, ChevronLeft, Settings } from "@mui/icons-material";
import { Fragment, ReactNode, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { tokenAtom } from "../App";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function MenuAppBar() {
  const [token, setToken] = useAtom(tokenAtom);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(true);

  // const handleMenu = (event: Event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const RouterLinkListItem = (to: string, text: string, icon: ReactNode) => (
    <ListItemButton component={Link} to={to}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );

  const toggleDrawerOpen = () => setOpen(!open);

  const logout = async () => {
    await axios.delete("/api/auth/login", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    // @ts-ignore
    setToken({});
    handleClose();
  };

  return (
    <Fragment>
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawerOpen}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            sx={{ flexGrow: 1 }}
            variant="h6"
            color="inherit"
            noWrap
          >
            Recipe Buddy
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyItems: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawerOpen}>
            <ChevronLeft />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <ListItemButton
            component={Link}
            to="/recipes"
            disabled={!token.access_token}
          >
            <ListItemIcon>
              <Book />
            </ListItemIcon>
            <ListItemText primary="Recipes" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/settings"
            disabled={!token.access_token}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
      </Drawer>
    </Fragment>
  );
}
