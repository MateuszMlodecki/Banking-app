import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

interface UnlockCardDialogProps {
  open: boolean;
  onClose: () => void;
  onUnlock: (pin: string) => Promise<void>;
  error?: string;
}

export const UnlockCardDialog: React.FC<UnlockCardDialogProps> = ({
  open,
  onClose,
  onUnlock,
  error,
}) => {
  const [pin, setPin] = useState('');
  const theme = useTheme();

  const handleUnlock = async () => {
    if (!pin) return;
    await onUnlock(pin);
    setPin('');
  };

  const handleClose = () => {
    setPin('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Enter your PASSWORD</DialogTitle>
      <DialogContent>
        <TextField
          label="PASSWORD"
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          fullWidth
          autoFocus
          sx={{ color: theme.palette.primary.contrastText }}
        />
        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.secondary.main }}
          onClick={handleUnlock}
        >
          Reveal
        </Button>
      </DialogActions>
    </Dialog>
  );
};
