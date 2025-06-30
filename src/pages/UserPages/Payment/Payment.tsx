import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import { useAlertContext } from 'context';
import { theme } from 'themes';
import axios from 'axios';
import { SenderAccountDetails } from './components/SenderAccountDetails';
import { RecipientDetailsForm } from './components/RecipientDetailsForm';
import { PaymentDetails } from './components/PaymentDetails';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRequest } from 'utils/hooks/useRequest';
import * as yup from 'yup';
import { RecurringPaymentDetails } from './components/RecurringPayment';

//Przypominajnik (uwzglednic w backendzie przelew powtarzalny)

export interface PaymentFormValues {
  receiverId: string;
  receiverName?: string;
  receiverAccountNumber: string;
  amount: string;
  date: string;
  title: string;
}

const Payment = () => {
  const [senderBalance, setSenderBalance] = useState<number>(0);
  const { setSuccessAlert } = useAlertContext();
  const navigate = useNavigate();
  const { id: userId = '' } = useParams();

  const getPaymentSchema = () => {
    return yup.object().shape({
      receiverId: yup.string().required('Receiver ID is required'),
      receiverName: yup.string(),
      receiverAccountNumber: yup.string().required('Account number is required'),
      amount: yup
        .string()
        .required('Amount is required')
        .test('sufficient-balance', 'Insufficient balance', function (value) {
          if (!value) return true;
          const parsedAmount = Number(value.replace(',', '.').trim());
          if (isNaN(parsedAmount)) return true;
          return parsedAmount <= senderBalance;
        })
        .test('positive-amount', 'Amount must be positive', function (value) {
          if (!value) return true;
          const parsedAmount = Number(value.replace(',', '.').trim());
          if (isNaN(parsedAmount)) return false;
          return parsedAmount > 0;
        }),
      date: yup.string().required('Date is required'),
      title: yup.string().required('Title is required'),
    });
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
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
    resolver: yupResolver(getPaymentSchema()),
    mode: 'onChange',
  });

  const { request } = useRequest();

  const onSubmit = async (data: PaymentFormValues) => {
    await request(async () => {
      const response = await axios.post(`/user/${userId}/transaction`, {
        receiverId: data.receiverId,
        receiverAccountNumber: data.receiverAccountNumber,
        amount: data.amount,
        date: data.date,
        title: data.title,
      });
      setSuccessAlert(response.data.message || 'Transaction successful');
      navigate(`/user/${userId}/dashboard`);
    });
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
        <SenderAccountDetails userId={userId} setSenderBalance={setSenderBalance} />

        <Divider sx={{ my: 1 }} />

        <RecipientDetailsForm control={control} watch={watch} setValue={setValue} />

        <Divider sx={{ my: 1 }} />

        <PaymentDetails control={control} />

        <RecurringPaymentDetails control={control} />
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
            disabled={isSubmitting || Object.keys(errors).length > 0 || !isValid}
          >
            {isSubmitting ? 'Processing...' : 'Send Payment'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Payment;
