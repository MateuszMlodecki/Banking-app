import { createContext, useContext, ReactNode } from 'react';
import { errorHandler } from '../utils/errorHandler';
import { AlertType } from '../types/types';

export interface AlertContextType {
  setAlert: (type: AlertType, message: string | Error) => void;
  setErrorAlert: (error: Error) => void;
  setSuccessAlert: (message: string) => void;
  setInfoAlert: (message: string) => void;
  setWarningAlert: (message: string) => void;
  clearAlert: () => void;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};

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
