import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useRequest } from 'utils/hooks/useRequest';
import { useCardContext } from '../CardProvider';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormWrapper } from './FormWrapper';

const schema = yup.object({
  confirmation: yup.boolean().oneOf([true], 'You must confirm that the data is correct').required(),
});

interface FormValues {
  confirmation: boolean;
}

export const CardSummaryStep = () => {
  const { cardData, setActiveStep } = useCardContext();
  const { id: userId = '' } = useParams();
  const { request } = useRequest();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { confirmation: false },
  });

  const onSubmit = (data: FormValues) => {
    request(async () => {
      await axios.post(`/user/${userId}/cards/order`, {
        ...cardData,
      });
      setActiveStep(step => step + 1);
    });
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>

      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Card Details:
        </Typography>
        <Typography>Type: {cardData.type}</Typography>
        <Typography>Format: {cardData.format}</Typography>
        <Typography>Subtype: {cardData.subtype}</Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Shipping Information:
        </Typography>
        <Typography>
          Name: {cardData.shipping.firstName} {cardData.shipping.lastName}
        </Typography>
        <Typography>City: {cardData.shipping.city}</Typography>
        <Typography>
          Street: {cardData.shipping.streetName} {cardData.shipping.streetNumber}
        </Typography>
        {cardData.shipping.flatNumber && (
          <Typography>Flat Number: {cardData.shipping.flatNumber}</Typography>
        )}
        <Typography>Date of Birth: {cardData.shipping.dateOfBirth}</Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Card Limits:
        </Typography>
        <Typography>Online: ${cardData.limits.online}</Typography>
        <Typography>In Store: ${cardData.limits.inStore}</Typography>
        <Typography>ATM: ${cardData.limits.atm}</Typography>
      </Box>

      <Controller
        name="confirmation"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value}
                color={errors.confirmation ? 'error' : 'primary'}
              />
            }
            label="I confirm that the data is correct"
          />
        )}
      />
      {errors.confirmation && (
        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
          {errors.confirmation.message}
        </Typography>
      )}
    </FormWrapper>
  );
};
