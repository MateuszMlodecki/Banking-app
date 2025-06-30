import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { LayoutContent, DrawerComponent, LayoutAppBar } from 'Layout';
import { theme } from 'themes';

export const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <LayoutAppBar handleDrawerToggle={handleDrawerToggle} />
      <DrawerComponent mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.primary.dark,
          marginTop: '64px',
          overflow: 'auto',
        }}
      >
        <LayoutContent />
      </Box>
    </Box>
  );
};
