import { Box, TextField, Typography, Button, Paper, Divider, InputAdornment } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { theme } from '../../themes/theme';
import { useNavigate, useParams } from 'react-router-dom';
import { errorHandler } from '../../utils/errorHandler';
import { PaymentValueRegex } from '../../utils/constants';
import { useAlertContext } from '../../context/AlertContext';
import { useEffect, useState } from 'react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SubjectIcon from '@mui/icons-material/Subject';
import PaymentIcon from '@mui/icons-material/Payment';
import { useLoading } from '../../context/LoadingContext';
import { formatAccountNumber } from '../../utils/formatAccountNumber';

interface PaymentFormData {
  receiverName: string;
  receiverAccountNumber: string;
  amount: string;
  date: string;
  title: string;
}

export const Payment = () => {
  const [senderAccountNumber, setSenderAccountNumber] = useState<string>('');
  const [senderBalance, setSenderBalance] = useState<number>(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<PaymentFormData>({
    defaultValues: {
      receiverName: '',
      receiverAccountNumber: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      title: '',
    },
  });

  const currentAmount = watch('amount');
  const isAmountTooHigh = parseFloat(currentAmount || '0') > senderBalance;

  const { setErrorAlert, setSuccessAlert } = useAlertContext();
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        const accountResponse = await axios.get(`/user/${userId}/account`);
        setSenderAccountNumber(formatAccountNumber(accountResponse.data.accountNumber));
        setSenderBalance(accountResponse.data.balance);
      } catch (error) {
        const message = errorHandler(error);
        setErrorAlert(new Error(`Failed to fetch account information: ${message}`));
        console.error('Account fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [userId, setErrorAlert, setLoading]);

  const onSubmit = async (data: PaymentFormData) => {
    if (isAmountTooHigh) {
      setErrorAlert(new Error('Insufficient funds'));
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/user/${userId}/transaction`, {
        senderAccountNumber: senderAccountNumber,
        receiverName: data.receiverName,
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
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="500"
            sx={{ mb: 1, color: theme.palette.primary.contrastText }}
          >
            Your Account
          </Typography>
          <TextField
            label="Your Account Number"
            fullWidth
            value={senderAccountNumber}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceIcon sx={{ color: theme.palette.primary.contrastText }} />
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              justifyContent: 'end',
              mt: 1,
              color: theme.palette.primary.contrastText,
            }}
          >
            Available balance: {senderBalance.toFixed(2)} $
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="500"
            sx={{ mb: 1, color: theme.palette.primary.contrastText }}
          >
            Recipient Details
          </Typography>

          <Controller
            name="receiverName"
            control={control}
            rules={{ required: 'Recipient name is required' }}
            render={({ field }) => (
              <TextField
                label="Recipient Name"
                fullWidth
                {...field}
                error={!!errors.receiverName}
                helperText={errors.receiverName?.message}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: theme.palette.primary.contrastText }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            name="receiverAccountNumber"
            control={control}
            rules={{
              required: 'Account number is required',
              validate: value => {
                const cleaned = value.replace(/\s/g, '');
                return cleaned.length === 26 || 'Account number must be 26 digits';
              },
            }}
            render={({ field }) => (
              <TextField
                label="Recipient Account Number"
                fullWidth
                placeholder=""
                {...field}
                onChange={e => {
                  const formattedValue = formatAccountNumber(e.target.value);
                  field.onChange(formattedValue);
                }}
                error={!!errors.receiverAccountNumber}
                helperText={errors.receiverAccountNumber?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceIcon sx={{ color: theme.palette.primary.contrastText }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="500"
            sx={{ mb: 1, color: theme.palette.primary.contrastText }}
          >
            Payment Details
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: 'Amount is required',
                pattern: {
                  value: PaymentValueRegex,
                  message: 'Enter a valid amount (like 100 or 100.50)',
                },
                validate: value => parseFloat(value) <= senderBalance || 'Insufficient funds',
              }}
              render={({ field }) => (
                <TextField
                  label="Amount"
                  fullWidth
                  {...field}
                  error={!!errors.amount || isAmountTooHigh}
                  helperText={
                    errors.amount?.message ||
                    (isAmountTooHigh ? `Maximum available: ${senderBalance.toFixed(2)} $` : '')
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PaymentIcon sx={{ color: theme.palette.primary.contrastText }} />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">PLN</InputAdornment>,
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon sx={{ color: theme.palette.primary.contrastText }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Controller
            name="title"
            control={control}
            rules={{ required: 'Transfer title is required' }}
            render={({ field }) => (
              <TextField
                label="Payment Title"
                fullWidth
                rows={2}
                {...field}
                error={!!errors.title}
                helperText={errors.title?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SubjectIcon sx={{ color: theme.palette.primary.contrastText }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>

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
