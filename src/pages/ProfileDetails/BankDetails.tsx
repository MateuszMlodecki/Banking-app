import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Typography, Button, Box } from '@mui/material';
import { Step3Values } from 'types/types';
import { getBankNameFromAccountNumber, formatAccountNumber, validationSchemaStep3 } from 'utils';
import { theme } from 'themes';
import { FormTextfield } from 'components';

export const BankDetails: React.FC<{
  setIsStepValid: (isValid: boolean) => void;
  onSubmit: (data: Step3Values) => void;
}> = ({ setIsStepValid, onSubmit }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchemaStep3),
    defaultValues: {
      accountNumber: '',
      bankName: '',
    },
  });

  useEffect(() => {
    setIsStepValid(isValid);
  }, [isValid, setIsStepValid]);

  return (
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
        Bank Details
      </Typography>

      <Controller
        name="accountNumber"
        control={control}
        render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
          <TextField
            {...field}
            value={value != null ? value : ''}
            label="Account Number"
            fullWidth
            error={!!error}
            helperText={error?.message ?? ' '}
            onChange={e => {
              const formattedData = formatAccountNumber(e.target.value);
              onChange(formattedData);
              const bankName = getBankNameFromAccountNumber(formattedData);
              setValue('bankName', bankName || '');
            }}
          />
        )}
      />

      <FormTextfield
        control={control}
        name="bankName"
        label="Bank Name"
        fullWidth
        InputProps={{ readOnly: true }}
        sx={{ pointerEvents: 'none' }}
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
  );
};
