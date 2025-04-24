import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Loader } from 'components';

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

export const LoadingContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <Loader isLoading={loading} />
      {children}
    </LoadingContext.Provider>
  );
};
