import { Typography } from '@mui/material';
import { FormTextfield } from 'components';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormWrapper } from './FormWrapper';
import { useCardContext } from '../CardProvider';
import { yupResolver } from '@hookform/resolvers/yup';

const pinSchema = yup.object({
  pin: yup
    .string()
    .matches(/^[0-9]{4}$/, 'PIN must be exactly 4 digits')
    .required('PIN is required'),
  confirmPin: yup
    .string()
    .oneOf([yup.ref('pin')], 'PINs must match')
    .required('Confirm PIN is required'),
});

type FormValues = { pin: string; confirmPin: string };

export const PinStep = () => {
  const {
    cardData: { pin, confirmPin },
    setCardData,
    setActiveStep,
  } = useCardContext();
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(pinSchema),
    defaultValues: { pin, confirmPin },
  });

  const onSubmit = (data: FormValues) => {
    setCardData(prev => ({ ...prev, ...data }));
    setActiveStep(step => step + 1);
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Typography>Set Your PIN</Typography>
      <FormTextfield
        control={control}
        name="pin"
        label="PIN"
        type="password"
        fullWidth
        margin="normal"
      />
      <FormTextfield
        control={control}
        name="confirmPin"
        label="Confirm PIN"
        type="password"
        fullWidth
        margin="normal"
      />
    </FormWrapper>
  );
};
