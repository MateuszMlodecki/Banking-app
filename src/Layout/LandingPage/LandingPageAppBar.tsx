import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { theme } from "../../themes/theme";

const navItems = ["Sign In", "Sign Up"];

interface AppBarComponentProps {
  handleDrawerToggle: () => void;
}

export const LandingPageAppBar: React.FC<AppBarComponentProps> = ({
  handleDrawerToggle,
}) => {
  const navigate = useNavigate();
  const navRoutes: Record<string, string> = {
    "Sign In": "/Login",
    "Sign Up": "/Register",
  };

  return (
    <AppBar component="nav" sx={{ background: theme.palette.primary.dark }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              background: theme.palette.primary.dark,
              borderRadius: "50%",
              padding: "8px",
              "&:hover": { background: theme.palette.grey[800] },
              color: theme.palette.primary.contrastText,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: { xs: "none", sm: "block" },
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            BankingApp
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {navItems.map((item) => (
            <Button
              key={item}
              onClick={() => navigate(navRoutes[item] || "/")}
              sx={{
                margin: "5px",
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.grey[800],
                },
              }}
            >
              {item}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
