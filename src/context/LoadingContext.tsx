import { Box, CircularProgress, Tooltip, Typography } from '@mui/material';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { theme } from '../themes/theme';

interface LoadingContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingContextProvider');
  }
  return context;
};

const loadingMessages = [
  'We are fetching your data',
  'Please be patient',
  'Loading your information',
  'Almost there!',
  'Just a moment...',
];

export const LoadingContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState<string>(loadingMessages[0]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[nextIndex]);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(messageInterval);
  }, [loading]);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            pointerEvents: 'all',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'opacity 0.3s ease, visibility 0.3s ease',
          }}
        >
          <Box
            sx={{
              width: '400px',
              height: '200px',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              transition: 'transform 0.3s ease',
              transform: loading ? 'scale(1)' : 'scale(0.9)',
            }}
          >
            <Tooltip title="Loading in progress">
              <CircularProgress
                size="5rem"
                sx={{
                  color: theme.palette.secondary.main,
                  filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.2))',
                }}
              />
            </Tooltip>
            <Box
              sx={{
                height: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.primary.contrastText,
                  fontWeight: 500,
                  textAlign: 'center',
                  animation: 'messageTransition 3s infinite',
                  '@keyframes messageTransition': {
                    '0%': { opacity: 0 },
                    '10%': { opacity: 1 },
                    '90%': { opacity: 1 },
                    '100%': { opacity: 0 },
                  },
                }}
              >
                {loadingMessage}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      {children}
    </LoadingContext.Provider>
  );
};
