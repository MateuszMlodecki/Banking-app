import React from "react";
import { CssBaseline, Box } from "@mui/material";
import { LandingPageAppBar } from "./LandingPageAppBar";
import { LandingPageDrawer } from "./LandingPageDrawer";
import { MainContent } from "./MainContent";
import { AuthGuard } from "../../components/AuthGuard";

export const LandingPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AuthGuard redirectIfAuthenticated />
      <CssBaseline />
      <LandingPageAppBar handleDrawerToggle={handleDrawerToggle} />
      <LandingPageDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <MainContent />
    </Box>
  );
};
