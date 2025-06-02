import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormWrapper } from './FormWrapper';
import { FormAutocomplete } from 'components';
import { useCardContext } from '../CardProvider';

const allFormatOptions = [
  { label: 'Virtual', value: 'virtual' },
  { label: 'Physical', value: 'physical' },
];

export const CardFormatStep: React.FC = () => {
  const { cardData, setCardData, setActiveStep } = useCardContext();
  const isKids = cardData.type === 'kids';
  const options = isKids ? [{ label: 'Physical', value: 'physical' }] : allFormatOptions;

  const { control, handleSubmit, setValue } = useForm<{ format: string }>({
    defaultValues: { format: isKids ? 'physical' : cardData.format || 'virtual' },
  });

  useEffect(() => {
    if (isKids) {
      setValue('format', 'physical');
      setCardData(prev => ({ ...prev, format: 'physical' }));
    }
  }, [isKids, setValue, setCardData]);

  const onSubmit = (data: { format: string }) => {
    setCardData(prev => ({ ...prev, format: data.format }));
    setActiveStep(step => step + 1);
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Typography>Select Card Format</Typography>
      <FormAutocomplete control={control} name="format" label="Card Format" options={options} />
    </FormWrapper>
  );
};
