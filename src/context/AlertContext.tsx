import React, { createContext, useContext, useState, ReactNode } from 'react';
import { errorHandler } from '../utils/errorHandler';
import { AlertType } from '../types/types';
import { AlertDisplay } from '../components/AlertDisplay';

export interface AlertContextType {
  setAlert: (type: AlertType, message: string | Error) => void;
  setErrorAlert: (error: Error) => void;
  setSuccessAlert: (message: string) => void;
  setInfoAlert: (message: string) => void;
  setWarningAlert: (message: string) => void;
  clearAlert: () => void;
}

export interface AlertProviderProps {
  children: ReactNode;
}

export interface AlertState {
  open: boolean;
  message: string;
  type: AlertType;
}

export const createAlertMessage = (messageOrError: string | Error): string => {
  return typeof messageOrError === 'string' ? messageOrError : errorHandler(messageOrError);
};

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    type: 'info',
  });

  const setAlert = (type: AlertType, messageOrError: string | Error) => {
    const message = createAlertMessage(messageOrError);

    setAlertState({
      open: true,
      message,
      type,
    });
  };

  const setErrorAlert = (error: Error) => setAlert('error', error);
  const setSuccessAlert = (message: string) => setAlert('success', message);
  const setInfoAlert = (message: string) => setAlert('info', message);
  const setWarningAlert = (message: string) => setAlert('warning', message);

  const clearAlert = () => {
    setAlertState(prev => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <AlertContext.Provider
      value={{
        setAlert,
        setErrorAlert,
        setSuccessAlert,
        setInfoAlert,
        setWarningAlert,
        clearAlert,
      }}
    >
      {children}
      <AlertDisplay
        open={alertState.open}
        message={alertState.message}
        type={alertState.type}
        onClose={clearAlert}
      />
    </AlertContext.Provider>
  );
};
