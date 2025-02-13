import React from "react";
import { CssBaseline, Box } from "@mui/material";
import { AppBarComponent } from "./AppBarComponent";
import { LandingPageDrawerComponent } from "./LandingPageDrawerComponent";
import { MainContent } from "./MainContent";

export const LandingPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
      <AppBarComponent handleDrawerToggle={handleDrawerToggle} />
      <LandingPageDrawerComponent
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <MainContent />
    </Box>
  );
};
