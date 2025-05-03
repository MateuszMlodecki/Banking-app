import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import { errorHandler, paymentSchema } from 'utils';
import { useAlertContext, useLoading } from 'context';
import { theme } from 'themes';
import axios from 'axios';
import { SenderAccountDetails } from './components/SenderAccountDetails';
import { RecipientDetailsForm } from './components/RecipientDetailsForm';
import { PaymentDetails } from './components/PaymentDetails';
import { yupResolver } from '@hookform/resolvers/yup';

export interface PaymentFormValues {
  receiverId: string;
  receiverName?: string;
  receiverAccountNumber: string;
  amount: string;
  date: string;
  title: string;
}

export const Payment = () => {
  const [senderAccountNumber, setSenderAccountNumber] = useState<string>('');
  const [senderBalance, setSenderBalance] = useState<number>(0);

  const { setErrorAlert, setSuccessAlert } = useAlertContext();
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const { setLoading } = useLoading();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = useForm<PaymentFormValues>({
    defaultValues: {
      receiverId: '',
      receiverName: '',
      receiverAccountNumber: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      title: '',
    },
    resolver: yupResolver(paymentSchema),
  });

  const currentAmount = watch('amount')?.replace(',', '.').trim();
  const parsedAmount = Number(currentAmount);

  const isAmountTooHigh = !isNaN(parsedAmount) && parsedAmount > senderBalance;

  const onSubmit = async (data: PaymentFormValues) => {
    if (isAmountTooHigh) {
      setErrorAlert(new Error('Insufficient funds'));
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/user/${userId}/transaction`, {
        senderAccountNumber: senderAccountNumber,
        receiverId: data.receiverId,
        receiverAccountNumber: data.receiverAccountNumber,
        amount: data.amount,
        date: data.date,
        title: data.title,
      });
      setSuccessAlert(response.data.message || 'Transaction successful');
      navigate(`/user/${userId}/dashboard`);
    } catch (error) {
      const message = errorHandler(error);
      setErrorAlert(new Error(message));
      console.error('Transaction error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        width: '100%',
        margin: 'auto',
        borderRadius: 2,
        border: `1px solid ${theme.palette.primary.contrastText}`,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.primary.contrastText,
          p: 2,
        }}
      >
        <Typography variant="h5" fontWeight="500">
          New Payment
        </Typography>
      </Box>

      <Box
        component="form"
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          bgcolor: theme.palette.background.default,
        }}
      >
        <SenderAccountDetails
          setSenderAccountNumber={setSenderAccountNumber}
          setSenderBalance={setSenderBalance}
        />

        <Divider sx={{ my: 1 }} />

        <RecipientDetailsForm control={control} watch={watch} setValue={setValue} />

        <Divider sx={{ my: 1 }} />

        <PaymentDetails control={control} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, gap: 2 }}>
          <Button
            variant="outlined"
            sx={{ color: theme.palette.primary.main }}
            onClick={() => navigate(`/user/${userId}/dashboard`)}
          >
            Cancel
          </Button>

          <Button
            sx={{ background: theme.palette.secondary.main }}
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || isAmountTooHigh}
          >
            {isSubmitting ? 'Processing...' : 'Send Payment'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
