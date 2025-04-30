import { Box, InputAdornment, Typography, useTheme } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SubjectIcon from '@mui/icons-material/Subject';
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

        <FormTextfield
          control={control}
          name="date"
          label="Transfer Date"
          type="date"
          fullWidth
          inputProps={{ min: new Date().toISOString().split('T')[0] }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: theme.palette.primary.contrastText }} />
                </InputAdornment>
              ),
            },
          }}
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
  );
};
