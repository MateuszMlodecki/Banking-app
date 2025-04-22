import { theme } from 'themes';
import { AlertProvider, UserDetailsProvider, LoadingContextProvider } from 'context';
import { ThemeProvider } from '@mui/material';
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
