import React, { useEffect } from 'react';
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
import { CardType } from 'components/CardItem';
import { useRequest } from 'utils/hooks/useRequest';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface EditLimitsDialogProps {
  open: boolean;
  onClose: () => void;
  card: CardType;
}

const SLIDER_MIN = 0;
const SLIDER_MAX = 10000;
const SLIDER_STEP = 50;

const EditLimitsSchema = yup.object({
  online: yup
    .number()
    .required('Required value')
    .min(SLIDER_MIN, `Min ${SLIDER_MIN}$`)
    .max(SLIDER_MAX, `Max ${SLIDER_MAX}$`),
  inStore: yup
    .number()
    .required('Required value')
    .min(SLIDER_MIN, `Min ${SLIDER_MIN}$`)
    .max(SLIDER_MAX, `Max ${SLIDER_MAX}$`),
  atm: yup
    .number()
    .required('Required value')
    .min(SLIDER_MIN, `Min ${SLIDER_MIN}$`)
    .max(SLIDER_MAX, `Max ${SLIDER_MAX}$`),
});

export const EditLimitsDialog: React.FC<EditLimitsDialogProps> = ({ open, onClose, card }) => {
  const { id: userId = '' } = useParams<{ id: string }>();
  const { request } = useRequest();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<{ online: number; inStore: number; atm: number }>({
    resolver: yupResolver(EditLimitsSchema),
    mode: 'onChange',
    defaultValues: {
      online: card.limits.online,
      inStore: card.limits.inStore,
      atm: card.limits.atm,
    },
  });

  useEffect(() => {
    reset({
      online: card.limits.online,
      inStore: card.limits.inStore,
      atm: card.limits.atm,
    });
  }, [card, reset]);

  const onSubmit = async (data: { online: number; inStore: number; atm: number }) => {
    await request(async () => {
      await axios.put(`/user/${userId}/cards/${card._id}/limits`, { limits: data });
      onClose();
    });
  };

  const valueLabelFormat = (value: number) => `$${value}`;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit card limits</DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            {(['online', 'inStore', 'atm'] as const).map(field => (
              <Box key={field}>
                <Controller
                  name={field}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <Typography gutterBottom>
                        {field === 'online'
                          ? `Online transaction limit: ${value} $`
                          : field === 'inStore'
                          ? `Store limit: ${value} $`
                          : `ATM limit: ${value} $`}
                      </Typography>
                      <Slider
                        value={value}
                        onChange={(_, v) => onChange(v as number)}
                        valueLabelDisplay="auto"
                        valueLabelFormat={valueLabelFormat}
                        min={SLIDER_MIN}
                        max={SLIDER_MAX}
                        step={SLIDER_STEP}
                      />
                    </>
                  )}
                />
                {errors[field] && (
                  <Typography variant="caption" color="error">
                    {errors[field]?.message}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={!isValid}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
