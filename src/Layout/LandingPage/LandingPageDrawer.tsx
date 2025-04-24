import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { theme } from 'themes';
import { drawerWidth } from 'utils';

const navItems = ['Sign In', 'Sign Up'];

interface NavigationDrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export const LandingPageDrawer: React.FC<NavigationDrawerProps> = ({
  mobileOpen,
  handleDrawerToggle,
}) => {
  const navigate = useNavigate();
  const navRoutes: Record<string, string> = {
    'Sign In': '/login',
    'Sign Up': '/register',
  };

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          backgroundColor: theme.palette.primary.dark,
          borderRight: '2px solid',
          borderColor: theme.palette.grey[800],
        },
      }}
    >
      <Box
        onClick={handleDrawerToggle}
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ my: 2 }}>
          BankingApp
        </Typography>
        <Divider sx={{ borderColor: theme.palette.grey[800] }} />
        <List>
          {navItems.map(item => (
            <ListItem key={item} disablePadding onClick={() => navigate(navRoutes[item] || '/')}>
              <ListItemButton
                sx={{
                  textAlign: 'center',
                  '&:hover': { backgroundColor: theme.palette.primary.dark },
                }}
              >
                <ListItemText primary={<Typography>{item}</Typography>} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
