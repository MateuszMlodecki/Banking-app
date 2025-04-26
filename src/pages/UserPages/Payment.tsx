import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, TextField, Typography, Button, Paper, Divider, InputAdornment } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import PaymentIcon from '@mui/icons-material/Payment';
import { errorHandler, PaymentValueRegex, formatAccountNumber } from 'utils';
import { useAlertContext, useLoading } from 'context';
import { theme } from 'themes';
import axios from 'axios';
import { FormAutocomplete, FormTextfield } from 'components';

interface PaymentFormData {
  receiverUser: User | null;
  receiverName: string;
  receiverAccountNumber: string;
  amount: string;
  date: string;
  title: string;
}

interface User {
  id: string;
  name: string;
  accountNumber: string;
}

export const Payment = () => {
  const [senderAccountNumber, setSenderAccountNumber] = useState<string>('');
  const [senderBalance, setSenderBalance] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

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
  } = useForm<PaymentFormData>({
    defaultValues: {
      receiverUser: null,
      receiverName: '',
      receiverAccountNumber: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      title: '',
    },
  });

  const currentAmount = watch('amount');
  const receiverAccountNumber = watch('receiverAccountNumber');
  const receiverUser = watch('receiverUser');
  const isAmountTooHigh = parseFloat(currentAmount || '0') > senderBalance;

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await axios.get('/users');
        const filteredUsers = response.data.filter((user: User) => user.id !== userId);
        setUsers(filteredUsers);
      } catch (error) {
        const message = errorHandler(error);
        setErrorAlert(new Error(`Failed to fetch users: ${message}`));
        console.error('Users fetch error:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [userId, setErrorAlert]);

  useEffect(() => {
    if (receiverAccountNumber) {
      const unformattedAccountNumber = receiverAccountNumber;
      const matchingUser = users.find(
        user =>
          user.accountNumber === unformattedAccountNumber ||
          user.accountNumber.replace(/\s/g, '') === unformattedAccountNumber,
      );

      if (matchingUser && (!receiverUser || receiverUser.id !== matchingUser.id)) {
        setValue('receiverUser', matchingUser);
        setValue('receiverName', matchingUser.name);
      }
    }
  }, [receiverAccountNumber, users, setValue, receiverUser]);

  const handleUserChange = (newUser: User | null) => {
    if (newUser) {
      setValue('receiverName', newUser.name);
      setValue('receiverAccountNumber', formatAccountNumber(newUser.accountNumber));
    } else {
      setValue('receiverName', '');
      setValue('receiverAccountNumber', '');
    }
  };

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
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalanceIcon sx={{ color: theme.palette.primary.contrastText }} />
                  </InputAdornment>
                ),
              },
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

          <FormAutocomplete<PaymentFormData, 'receiverUser', User>
            control={control}
            name="receiverUser"
            options={users}
            loading={loadingUsers}
            getOptionLabel={(option: User) => `${option.name}`}
            isOptionEqualToValue={(option: User, value: User) => option.id === value.id}
            label="Select recipient"
            renderInputProps={{
              fullWidth: true,
              sx: { mb: 2 },
              slotProps: {
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: theme.palette.primary.contrastText }} />
                    </InputAdornment>
                  ),
                },
              },
            }}
            onChangeExtra={(newValue: User | null) => handleUserChange(newValue)}
          />

          <FormTextfield
            control={control}
            name="receiverAccountNumber"
            label="Recipient Account Number"
            fullWidth
            placeholder="00 0000 0000 0000 0000 0000 0000"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const formattedValue = formatAccountNumber(e.target.value);
              setValue('receiverAccountNumber', formattedValue);
            }}
            rules={{
              required: 'Account number is required',
              validate: value => {
                const cleaned = value.replace(/\s/g, '');
                return cleaned.length === 26 || 'Account number must be 26 digits';
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalanceIcon sx={{ color: theme.palette.primary.contrastText }} />
                  </InputAdornment>
                ),
              },
            }}
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
            <FormTextfield
              control={control}
              name="amount"
              label="Amount"
              fullWidth
              rules={{
                required: 'Amount is required',
                pattern: {
                  value: PaymentValueRegex,
                  message: 'Enter a valid amount (like 100 or 100.50)',
                },
                validate: value => parseFloat(value) <= senderBalance || 'Insufficient funds',
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon sx={{ color: theme.palette.primary.contrastText }} />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">$</InputAdornment>,
                },
              }}
            />

            <FormTextfield
              control={control}
              name="date"
              label="Transfer Date"
              type="date"
              fullWidth
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
              rules={{ required: 'Date is required' }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: theme.palette.primary.contrastText }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <FormTextfield
            control={control}
            name="title"
            label="Payment Title"
            fullWidth
            rules={{ required: 'Transfer title is required' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SubjectIcon sx={{ color: theme.palette.primary.contrastText }} />
                  </InputAdornment>
                ),
              },
            }}
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
