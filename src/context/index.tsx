import { UserDetailsProvider } from './UserContext';
import { theme } from '../themes/theme';
import { AlertProvider } from './AlertContext';
import { ThemeProvider } from '@mui/material';
import { LoadingContextProvider } from './LoadingContext';
import React from 'react';

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <LoadingContextProvider>
        <AlertProvider>
          <UserDetailsProvider>{children}</UserDetailsProvider>
        </AlertProvider>
      </LoadingContextProvider>
    </ThemeProvider>
  );
};
