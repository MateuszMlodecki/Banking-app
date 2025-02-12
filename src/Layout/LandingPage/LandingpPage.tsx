import * as React from "react";
import {
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LockIcon from "@mui/icons-material/Lock";
import { Vault } from "../../components/Vault";
import { useNavigate } from "react-router-dom";
import { theme } from "../../themes/theme";

const drawerWidth = 240;
const navItems = ["Sign In", "Sign Up"];

interface DrawerAppBarProps {
  window?: () => Window;
}

export const LandingPage = (props: DrawerAppBarProps) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const navRoutes: Record<string, string> = {
    "Sign In": "/Login",
    "Sign Up": "/Stepper",
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
      }}
    >
      <Typography variant="h6" sx={{ my: 2 }}>
        BankingApp
      </Typography>
      <Divider sx={{ borderColor: theme.palette.grey[800] }} />
      <List>
        {navItems.map((item: string) => (
          <ListItem
            key={item}
            disablePadding
            onClick={() => navigate(navRoutes[item] || "/")}
          >
            <ListItemButton
              sx={{
                textAlign: "center",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              <ListItemText
                primary={
                  <Typography sx={{ color: "#F7F5F2" }}>{item}</Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ background: "#222222" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              background: "#222222",
              borderRadius: "50%",
              padding: "8px",
              "&:hover": { background: "#444" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              fontWeight: 600,
              color: "#F7F5F2",
            }}
          >
            BankingApp
          </Typography>
          <Box
            sx={{ display: { xs: "none", sm: "block" }, marginRight: "100px" }}
          >
            {navItems.map((item: string) => (
              <Button
                key={item}
                onClick={() => navigate(navRoutes[item] || "/")}
                sx={{
                  borderRadius: "30px",
                  color: "#F7F5F2",
                  "&:hover": { backgroundColor: "#444" },
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#1c1c1c",
              color: "#F7F5F2",
              borderRight: "2px solid #444",
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          padding: 3,
          backgroundColor: "#222222",
          marginTop: "64px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            paddingTop: "200px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{}}>
            <Typography
              sx={{
                color: "#520A85",
                fontSize: "24px",
              }}
            >
              selected for you!
            </Typography>
            <Typography
              sx={{
                color: "#F7F5F2",
                fontSize: "36px",
              }}
            >
              BankingApp project
            </Typography>

            <Box
              sx={{
                width: "66%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "100px",
                padding: "10px",
                color: "#99FF66",
                background: "#474747",
                borderRadius: "25px",
              }}
            >
              <LockIcon />
              <Typography sx={{ color: "#99FF66", fontWeight: "bold" }}>
                Banking 24X7
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Vault />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
