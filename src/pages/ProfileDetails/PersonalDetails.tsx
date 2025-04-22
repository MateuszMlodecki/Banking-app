import React, { useEffect } from 'react';
import { TextField, Typography, Button, Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Step1Values } from 'types/types';
import { validationSchemaStep1 } from 'utils';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { theme } from 'themes';

export const PersonalDetails: React.FC<{
  setIsStepValid: (isValid: boolean) => void;
  onSubmit: (data: Step1Values) => void;
}> = ({ setIsStepValid, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchemaStep1),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
    },
  });

  useEffect(() => {
    setIsStepValid(isValid);
  }, [isValid]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography>Personal details</Typography>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="First Name"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Last Name"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          )}
        />
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePicker
              format="DD-MM-YYYY"
              label="Date of Birth"
              value={field.value ? dayjs(field.value, 'DD-MM-YYYY') : null}
              onChange={(date: Dayjs | null) => {
                field.onChange(date ? date.format('DD-MM-YYYY') : '');
              }}
              sx={{
                '.MuiDateCalendar-root': {
                  color: theme.palette.primary.contrastText,
                  borderRadius: '2px',
                  borderWidth: '1px',
                  border: '1px solid',
                },
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  error: !!errors.dateOfBirth,
                  helperText: errors.dateOfBirth?.message,
                },
              }}
            />
          )}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            sx={{
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.secondary.main,
              '&.Mui-disabled': {
                backgroundColor: theme.palette.grey[800],
              },
            }}
            type="submit"
            variant="contained"
            disabled={!isValid}
          >
            Continue
          </Button>
        </Box>
      </form>
    </LocalizationProvider>
  );
};
