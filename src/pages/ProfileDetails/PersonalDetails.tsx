import { useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Step1Values } from 'types/types';
import { validationSchemaStep1 } from 'utils';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { theme } from 'themes';
import { FormTextfield } from 'components';

export const PersonalDetails: React.FC<{
  setIsStepValid: (isValid: boolean) => void;
  onSubmit: (data: Step1Values) => void;
}> = ({ setIsStepValid, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
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
  }, [isValid, setIsStepValid]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '10px' }}>
          Personal details
        </Typography>

        <FormTextfield control={control} name="firstName" label="First Name" fullWidth />

        <FormTextfield control={control} name="lastName" label="Last Name" fullWidth />

        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              format="DD-MM-YYYY"
              label="Date of Birth"
              value={field.value ? dayjs(field.value, 'DD-MM-YYYY') : null}
              onChange={date => {
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
                  error: !!error,
                  helperText: error?.message ?? ' ',
                },
              }}
            />
          )}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
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
      </Box>
    </LocalizationProvider>
  );
};
