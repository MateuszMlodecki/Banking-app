import React, { useState } from 'react';
import { AlertContext, AlertProviderProps, AlertState, createAlertMessage } from './AlertContext';
import { AlertDisplay } from './AlertDisplay';
import { AlertType } from '../types/types';

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
