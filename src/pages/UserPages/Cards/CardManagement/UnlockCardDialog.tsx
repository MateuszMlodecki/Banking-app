import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material';

interface UnlockCardDialogProps {
  open: boolean;
  onClose: () => void;
  onUnlock: (pin: string) => Promise<void>;
  error?: string;
}

const UnlockCardDialog: React.FC<UnlockCardDialogProps> = ({ open, onClose, onUnlock, error }) => {
  const [pin, setPin] = useState('');

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
      <DialogTitle>Enter your PIN</DialogTitle>
      <DialogContent>
        <TextField
          label="PIN"
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          fullWidth
          autoFocus
          inputProps={{ maxLength: 6 }}
        />
        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUnlock}>
          Reveal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnlockCardDialog;
