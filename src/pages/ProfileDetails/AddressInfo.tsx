import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Button, Box } from '@mui/material';
import { Step2Values } from 'types/types';
import { validationSchemaStep2 } from 'utils';
import { theme } from 'themes';
import { FormTextfield } from 'components';

export const AddressInfo: React.FC<{
  setIsStepValid: (isValid: boolean) => void;
  onSubmit: (data: Step2Values) => void;
}> = ({ setIsStepValid, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchemaStep2),
    defaultValues: {
      streetName: '',
      streetNumber: '',
      flatNumber: '',
      city: '',
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
        Address Information
      </Typography>

      <FormTextfield control={control} name="streetName" label="Street Name" fullWidth />

      <FormTextfield control={control} name="streetNumber" label="Street Number" fullWidth />

      <FormTextfield control={control} name="flatNumber" label="Flat Number" fullWidth />

      <FormTextfield control={control} name="city" label="City" fullWidth />

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
