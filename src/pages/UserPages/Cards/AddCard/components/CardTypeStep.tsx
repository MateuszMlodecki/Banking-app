import { yupResolver } from '@hookform/resolvers/yup';
import { Typography } from '@mui/material';
import { FormAutocomplete } from 'components';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useCardContext } from '../CardProvider';
import { FormWrapper } from './FormWrapper';

const cardTypeOptions = [
  { label: 'Debit', value: 'debit' },
  { label: 'Credit', value: 'credit' },
  { label: 'Kids', value: 'kids' },
];

const cardTypeSchema = yup.object({
  cardType: yup.string().required('Card type is required'),
});

export const CardTypeStep = () => {
  const { cardData, setCardData, setActiveStep } = useCardContext();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(cardTypeSchema),
    defaultValues: { cardType: cardData.type },
  });

  const onSubmit = ({ cardType }: { cardType: string }) => {
    setCardData(prev => ({ ...prev, type: cardType }));
    setActiveStep(step => step + 1);
  };
  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Typography>Select Card Type</Typography>
      <FormAutocomplete
        control={control}
        name="cardType"
        label="Card Type"
        options={cardTypeOptions}
        getOptionDisabled={option => option.value === 'credit'}
      />
    </FormWrapper>
  );
};
