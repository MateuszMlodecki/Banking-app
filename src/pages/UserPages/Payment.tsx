import { Box, TextField, Typography, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { theme } from '../../themes/theme';
import { useNavigate, useParams } from 'react-router-dom';
import { errorHandler } from '../../utils/errorHandler';
import { PaymentValueRegex } from '../../utils/constants';
import { useAlertContext } from '../../context/AlertContext';

interface PaymentFormData {
  id: string;
  senderId: string;
  senderEmail: string;
  receiverEmail: string;
  amount: string;
  date: string;
  title: string;
}

export const Payment = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    defaultValues: {
      receiverEmail: '',
      senderEmail: '',
      senderId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      title: '',
    },
  });

  const { setErrorAlert, setSuccessAlert } = useAlertContext();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const onSubmit = async (data: PaymentFormData) => {
    try {
      const response = await axios.post(`/user/${userId}/transaction`, {
        receiverEmail: data.receiverEmail,
        senderId: data.senderId,
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
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
      }}
    >
      <Typography variant="h5" sx={{ color: 'text.primary' }}>
        Payment
      </Typography>

      <Controller
        name="receiverEmail"
        control={control}
        rules={{ required: 'Receiver is required' }}
        render={({ field }) => (
          <TextField
            label="Receiver Email"
            fullWidth
            {...field}
            error={!!errors.receiverEmail}
            helperText={errors.receiverEmail?.message}
          />
        )}
      />

      <Controller
        name="senderEmail"
        control={control}
        rules={{ required: 'Sender Email is required' }}
        render={({ field }) => (
          <TextField
            label="Sender Email"
            fullWidth
            {...field}
            error={!!errors.senderEmail}
            helperText={errors.senderEmail?.message}
          />
        )}
      />

      <Controller
        name="amount"
        control={control}
        rules={{
          required: 'Amount is required',
          pattern: {
            value: PaymentValueRegex,
            message: 'Enter a valid amount ( like 100 or 100.50)',
          },
        }}
        render={({ field }) => (
          <TextField
            label="Amount"
            fullWidth
            type="number"
            {...field}
            error={!!errors.amount}
            helperText={errors.amount?.message}
          />
        )}
      />

      <Controller
        name="date"
        control={control}
        rules={{ required: 'Date is required' }}
        render={({ field }) => (
          <TextField
            label="Transfer Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split('T')[0] }}
            {...field}
            error={!!errors.date}
            helperText={errors.date?.message}
          />
        )}
      />

      <Controller
        name="title"
        control={control}
        rules={{ required: 'Transfer Title is required' }}
        render={({ field }) => (
          <TextField
            label="Transfer Title"
            fullWidth
            {...field}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />

      <Button
        sx={{ background: theme.palette.secondary.light }}
        variant="contained"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Send Transfer'}
      </Button>
    </Box>
  );
};
