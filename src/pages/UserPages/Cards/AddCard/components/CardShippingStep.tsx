import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Checkbox, FormControlLabel, Box } from '@mui/material';
import { FormTextfield } from 'components';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { useUserDetails } from 'context';
import { useCardContext } from '../CardProvider';
import { FormWrapper } from './FormWrapper';

const shippingSchema = yup.object({
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
  confirmation: yup
    .boolean()
    .default(false)
    .oneOf([true], 'You must confirm that the data is correct'),
});

interface ShippingFormData {
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
  const { userDetails } = useUserDetails();
  const { cardData, setCardData, setActiveStep } = useCardContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingFormData>({
    mode: 'all',
    resolver: yupResolver(shippingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      streetName: '',
      streetNumber: '',
      flatNumber: '',
      city: '',
      dateOfBirth: '',
      confirmation: false,
    },
  });

  useEffect(() => {
    if (!userDetails) return;

    const formData = {
      firstName: cardData.shipping?.firstName ?? userDetails.firstName,
      lastName: cardData.shipping?.lastName ?? userDetails.lastName,
      streetName: cardData.shipping?.streetName ?? userDetails.streetName,
      streetNumber: cardData.shipping?.streetNumber ?? userDetails.streetNumber,
      flatNumber: cardData.shipping?.flatNumber ?? userDetails.flatNumber ?? '',
      city: cardData.shipping?.city ?? userDetails.city,
      dateOfBirth: cardData.shipping?.dateOfBirth ?? userDetails.dateOfBirth,
      confirmation: cardData.shipping?.confirmation ?? false,
    };

    reset(formData);
  }, [userDetails, cardData.shipping, reset]);

  const onSubmit = (data: ShippingFormData) => {
    setCardData(prev => ({
      ...prev,
      shipping: {
        ...data,
        flatNumber: data.flatNumber || '',
      },
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

        <Controller
          name="confirmation"
          control={control}
          render={({ field, fieldState }) => (
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    color={fieldState.error ? 'error' : 'primary'}
                  />
                }
                label="I confirm that the data is correct"
              />
              {fieldState.error && (
                <Typography variant="caption" color="error" display="block" sx={{ ml: 4 }}>
                  {fieldState.error.message}
                </Typography>
              )}
            </Box>
          )}
        />
      </Box>
    </FormWrapper>
  );
};
