import React, { useState } from 'react';
import { CssBaseline, Box } from '@mui/material';
import { LandingPageAppBar, LandingPageDrawer, MainContent } from 'Layout';
const LandingPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <LandingPageAppBar handleDrawerToggle={handleDrawerToggle} />
      <LandingPageDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <MainContent />
    </Box>
  );
};

export default LandingPage;
