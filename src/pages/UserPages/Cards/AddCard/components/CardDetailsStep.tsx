import * as yup from 'yup';
import { useCardContext } from '../CardProvider';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormWrapper } from './FormWrapper';
import { Typography } from '@mui/material';
import { FormAutocomplete } from 'components';

const CARD_DETAILS_OPTIONS = [
  { label: 'Visa', value: 'Visa' },
  { label: 'MasterCard', value: 'Mastercard' },
];

const validSubtypes = CARD_DETAILS_OPTIONS.map(option => option.label);

const cardDetailsSchema = yup.object({
  subtype: yup.string().oneOf(validSubtypes).required('Card subtype is required'),
});

export const CardDetailsStep = () => {
  const {
    cardData: { subtype },
    setCardData,
    setActiveStep,
  } = useCardContext();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(cardDetailsSchema),
    defaultValues: { subtype },
  });

  const onSubmit = ({ subtype }: { subtype: string }) => {
    setCardData(prev => ({ ...prev, subtype }));
    setActiveStep(step => step + 1);
  };
  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Typography>Select Card Subtype</Typography>
      <FormAutocomplete
        control={control}
        name="subtype"
        label="Card Subtype"
        options={CARD_DETAILS_OPTIONS}
      />
    </FormWrapper>
  );
};
