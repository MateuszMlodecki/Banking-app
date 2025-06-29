import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Box } from '@mui/material';
import { FormTextfield } from 'components';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useCardContext } from '../CardProvider';
import { FormWrapper } from './FormWrapper';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  streetName: yup.string().required('Street name is required'),
  streetNumber: yup.string().required('Street number is required'),
  flatNumber: yup.string().default(''),
  city: yup.string().required('City is required'),
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .matches(/^\d{2}-\d{2}-\d{4}$/, 'Date must be in DD-MM-YYYY format'),
  confirmation: yup.boolean().default(false),
});

interface FormValues {
  firstName: string;
  lastName: string;
  streetName: string;
  streetNumber: string;
  flatNumber: string;
  city: string;
  dateOfBirth: string;
  confirmation: boolean;
}

export const ShippingStep = () => {
  const { cardData, setCardData, setActiveStep } = useCardContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'all',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: cardData.shipping.firstName,
      lastName: cardData.shipping.lastName,
      streetName: cardData.shipping.streetName,
      streetNumber: cardData.shipping.streetNumber,
      flatNumber: cardData.shipping.flatNumber ?? '',
      city: cardData.shipping.city,
      dateOfBirth: cardData.shipping.dateOfBirth,
    },
  });

  const onSubmit = (data: FormValues) => {
    setCardData(prev => ({
      ...prev,
      shipping: data,
    }));
    setActiveStep(step => step + 1);
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" gutterBottom>
        Shipping Information
      </Typography>

      <Box display="flex" textAlign="center" flexDirection="column" gap={2}>
        <FormTextfield
          control={control}
          name="firstName"
          label="First Name"
          fullWidth
          disabled
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />

        <FormTextfield
          control={control}
          name="lastName"
          label="Last Name"
          fullWidth
          disabled
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />

        <FormTextfield
          control={control}
          name="streetName"
          label="Street Name"
          fullWidth
          disabled
          error={!!errors.streetName}
          helperText={errors.streetName?.message}
        />

        <FormTextfield
          control={control}
          name="streetNumber"
          label="Street Number"
          fullWidth
          disabled
          error={!!errors.streetNumber}
          helperText={errors.streetNumber?.message}
        />

        <FormTextfield
          control={control}
          name="flatNumber"
          label="Flat Number (Optional)"
          fullWidth
          disabled
          error={!!errors.flatNumber}
          helperText={errors.flatNumber?.message}
        />

        <FormTextfield
          control={control}
          name="city"
          label="City"
          fullWidth
          disabled
          error={!!errors.city}
          helperText={errors.city?.message}
        />

        <FormTextfield
          control={control}
          name="dateOfBirth"
          label="Date of Birth (DD-MM-YYYY)"
          fullWidth
          disabled
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth?.message}
        />
      </Box>
    </FormWrapper>
  );
};
