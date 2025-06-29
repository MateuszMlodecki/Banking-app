import { Box, InputAdornment, Typography, useTheme } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import SubjectIcon from '@mui/icons-material/Subject';
import { Controller } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FC } from 'react';
import { Control } from 'react-hook-form';
import { FormTextfield } from 'components';
import { PaymentFormValues } from '../Payment';

type PaymentDetailsProps = {
  control: Control<PaymentFormValues, any>;
};

export const PaymentDetails: FC<PaymentDetailsProps> = ({ control }) => {
  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="500"
          sx={{ mb: 1, color: theme.palette.primary.contrastText }}
        >
          Payment Details
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <FormTextfield
            control={control}
            name="amount"
            label="Amount"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PaymentIcon sx={{ color: theme.palette.primary.contrastText }} />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">$</InputAdornment>,
              },
            }}
          />

          <Controller
            name="date"
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <DatePicker
                label="Transfer Date"
                format="YYYY-MM-DD"
                value={value ? dayjs(value, 'YYYY-MM-DD') : null}
                onChange={date => {
                  onChange(date ? date.format('YYYY-MM-DD') : '');
                }}
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message ?? ' ',
                    InputLabelProps: { shrink: true },
                  },
                }}
              />
            )}
          />
        </Box>

        <FormTextfield
          control={control}
          name="title"
          label="Payment Title"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SubjectIcon sx={{ color: theme.palette.primary.contrastText }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};
