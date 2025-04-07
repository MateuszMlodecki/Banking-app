import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { AlertType } from '../types/types';

interface AlertDisplayProps {
  open: boolean;
  message: string;
  type: AlertType;
  onClose: () => void;
  autoHideDuration?: number;
}

export const AlertDisplay: React.FC<AlertDisplayProps> = ({
  open,
  message,
  type,
  onClose,
  autoHideDuration = 3000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
