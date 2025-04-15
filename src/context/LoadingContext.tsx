import { Box, CircularProgress, Tooltip } from '@mui/material';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

const loadingMessages = ['We are fetching your data', 'Please be patient'];
export const LoadingContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(loadingMessages[0]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setLoadingMessage(prevMessage =>
        prevMessage === loadingMessages[0] ? loadingMessages[1] : loadingMessages[0],
      );
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
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            zIndex: 9999,
            pointerEvents: 'all',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Tooltip title="We are fetching your data">
            <CircularProgress size={'20vw'} />
          </Tooltip>
          <p>{loadingMessage}</p>
        </Box>
      )}
      {children}
    </LoadingContext.Provider>
  );
};
