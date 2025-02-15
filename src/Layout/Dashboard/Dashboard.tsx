import React from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { DashboardAppBar } from "./DashboardAppBar";
import { DrawerComponent } from "./DrawerComponent";
import { DashboardContent } from "./DashboardContent";
import { ActiveViewType } from "../../types/types";
import { theme } from "../../themes/theme";

export const Dashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeView, setActiveView] =
    React.useState<ActiveViewType>("Overview");

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleMenuItemClick = (view: ActiveViewType) => {
    setActiveView(view);
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
      <DashboardAppBar handleDrawerToggle={handleDrawerToggle} />
      <DrawerComponent
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleMenuItemClick={handleMenuItemClick}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.primary.dark,
          marginTop: "64px",
          overflow: "hidden",
        }}
      >
        <Toolbar />
        <DashboardContent activeView={activeView} />
      </Box>
    </Box>
  );
};
