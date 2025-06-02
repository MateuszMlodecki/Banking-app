import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  Slider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios-config';
import { useLoading } from 'context';
import { CardType } from 'components/CardItem';

interface EditLimitsDialogProps {
  open: boolean;
  onClose: () => void;
  card: CardType;
}

const EditLimitsDialog: React.FC<EditLimitsDialogProps> = ({ open, onClose, card }) => {
  const { id: userId = '' } = useParams();
  const { loading, setLoading } = useLoading();

  const [onlineLimit, setOnlineLimit] = useState<number>(0);
  const [inStoreLimit, setInStoreLimit] = useState<number>(0);
  const [atmLimit, setAtmLimit] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (card.limits) {
      setOnlineLimit(card.limits.online ?? 0);
      setInStoreLimit(card.limits.inStore ?? 0);
      setAtmLimit(card.limits.atm ?? 0);
    } else {
      setOnlineLimit(0);
      setInStoreLimit(0);
      setAtmLimit(0);
    }
    setError(null);
  }, [card]);

  const valueLabelFormat = (value: number) => `${value} $`;

  const SLIDER_MIN = 0;
  const SLIDER_MAX = 10000;
  const SLIDER_STEP = 50;

  const handleSave = async () => {
    if (!userId || !card._id) return;

    if (onlineLimit < 0 || inStoreLimit < 0 || atmLimit < 0) {
      setError("Limits can't be negative.");
      return;
    }

    try {
      setLoading(true);

      await axios.put(`/user/${userId}/cards/${card._id}/limits`, {
        limits: {
          online: onlineLimit,
          inStore: inStoreLimit,
          atm: atmLimit,
        },
      });

      onClose();
    } catch (err) {
      console.error('Error updating limits:', err);
      setError('An error occurred while updating limits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit card limits</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          <Box>
            <Typography gutterBottom>Online transaction limit: {onlineLimit} $</Typography>
            <Slider
              value={onlineLimit}
              onChange={(_, value) => setOnlineLimit(value as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={valueLabelFormat}
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={SLIDER_STEP}
            />
          </Box>

          <Box>
            <Typography gutterBottom>Store limit: {inStoreLimit} $</Typography>
            <Slider
              value={inStoreLimit}
              onChange={(_, value) => setInStoreLimit(value as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={valueLabelFormat}
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={SLIDER_STEP}
            />
          </Box>

          <Box>
            <Typography gutterBottom>Atm limit: {atmLimit} $</Typography>
            <Slider
              value={atmLimit}
              onChange={(_, value) => setAtmLimit(value as number)}
              valueLabelDisplay="auto"
              valueLabelFormat={valueLabelFormat}
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={SLIDER_STEP}
            />
          </Box>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? 'Saveing...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLimitsDialog;
