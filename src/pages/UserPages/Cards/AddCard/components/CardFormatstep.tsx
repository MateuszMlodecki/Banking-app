import * as yup from 'yup';
import { Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormWrapper } from './FormWrapper';
import { FormAutocomplete } from 'components';
import { useCardContext } from '../CardProvider';
import { yupResolver } from '@hookform/resolvers/yup';

const ALL_FORMAT_OPTIONS = [
  { label: 'Virtual', value: 'virtual' },
  { label: 'Physical', value: 'physical' },
];

const validFormat = ALL_FORMAT_OPTIONS.map(option => option.value);

const cardDetailsSchema = yup.object({
  format: yup.string().oneOf(validFormat).required('Card format is required'),
});

export const CardFormatStep = () => {
  const { cardData, setCardData, setActiveStep } = useCardContext();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(cardDetailsSchema),
    defaultValues: { format: cardData.format },
  });

  const onSubmit = ({ format }: { format: string }) => {
    setCardData(prev => ({ ...prev, format }));
    setActiveStep(step => step + 1);
  };

  const isKids = cardData.type === 'kids';

  const options = ALL_FORMAT_OPTIONS.map(option => ({
    ...option,
    disabled: isKids && option.value === 'virtual',
    tooltip: isKids && option.value === 'virtual' ? 'Virtual card not available for kids' : '',
  }));

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Typography>Select Card Format</Typography>
      <FormAutocomplete control={control} name="format" label="Card Format" options={options} />
    </FormWrapper>
  );
};
