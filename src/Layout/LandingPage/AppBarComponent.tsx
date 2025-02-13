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

export const AppBarComponent: React.FC<AppBarComponentProps> = ({
  handleDrawerToggle,
}) => {
  const navigate = useNavigate();
  const navRoutes: Record<string, string> = {
    "Sign In": "/Login",
    "Sign Up": "/Stepper",
  };

  return (
    <AppBar component="nav" sx={{ background: theme.palette.primary.dark }}>
      <Toolbar>
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
            flexGrow: 1,
            display: { xs: "none", sm: "block" },
            fontWeight: 600,
          }}
        >
          BankingApp
        </Typography>
        <Box
          sx={{ display: { xs: "none", sm: "block" }, marginRight: "100px" }}
        >
          {navItems.map((item) => (
            <Button
              key={item}
              onClick={() => navigate(navRoutes[item] || "/")}
              sx={{
                borderRadius: "30px",
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
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
