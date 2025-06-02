import * as yup from 'yup';
import { useCardContext } from '../CardProvider';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormWrapper } from './FormWrapper';
import { Typography } from '@mui/material';
import { FormAutocomplete } from 'components';

const cardDetailsOptions = [
  { label: 'Visa', value: 'visa' },
  { label: 'MasterCard', value: 'mastercard' },
];

const cardDetailsSchema = yup.object({
  cardSubtype: yup.string().required('Card subtype is required'),
});

export const CardDetailsStep = () => {
  const { cardData, setCardData, setActiveStep } = useCardContext();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(cardDetailsSchema),
    defaultValues: { cardSubtype: cardData.subtype },
  });

  const onSubmit = ({ cardSubtype }: { cardSubtype: string }) => {
    setCardData(prev => ({ ...prev, subtype: cardSubtype }));
    setActiveStep(step => step + 1);
  };
  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Typography>Select Card Subtype</Typography>
      <FormAutocomplete
        control={control}
        name="cardSubtype"
        label="Card Subtype"
        options={cardDetailsOptions}
      />
    </FormWrapper>
  );
};
