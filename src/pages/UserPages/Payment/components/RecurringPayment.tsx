import React from 'react';
import { Controller, Control, useWatch } from 'react-hook-form';
import {
  Box,
  FormControlLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
} from '@mui/material';

export interface RecurringPaymentFormValues {
  isRecurring: boolean;
  recurrenceFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  recurrenceInterval: number;
  recurrenceEndDate: string;
}

interface RecurringPaymentDetailsProps {
  control: Control<RecurringPaymentFormValues>;
}

export const RecurringPaymentDetails: React.FC<RecurringPaymentDetailsProps> = ({ control }) => {
  const isRecurring = useWatch({ control, name: 'isRecurring' });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Controller
        name="isRecurring"
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value} />}
            label="Recurring payment"
          />
        )}
      />

      {isRecurring && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel id="recurrence-frequency-label">Frequency</InputLabel>
            <Controller
              name="recurrenceFrequency"
              control={control}
              defaultValue="MONTHLY"
              render={({ field }) => (
                <Select {...field} labelId="recurrence-frequency-label" label="Częstotliwość">
                  <MenuItem value="DAILY">Daily</MenuItem>
                  <MenuItem value="WEEKLY">Weekly</MenuItem>
                  <MenuItem value="MONTHLY">Montlhy</MenuItem>
                  <MenuItem value="YEARLY">Yearly</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <Controller
            name="recurrenceInterval"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Repeat every"
                InputProps={{ inputProps: { min: 1 } }}
              />
            )}
          />

          <Controller
            name="recurrenceEndDate"
            control={control}
            defaultValue={new Date().toISOString().split('T')[0]}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Date of end"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
};
