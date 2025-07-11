import { Box, InputAdornment, Typography, useTheme } from '@mui/material';
import { FormAutocomplete, FormTextfield } from 'components';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FC, useEffect, useState } from 'react';
import { PaymentFormValues } from '../Payment';
import axios from 'axios';
import { useRequest } from 'utils/hooks/useRequest';
import { useParams } from 'react-router-dom';
import { formatAccountNumber } from 'utils';

interface User {
  id: string;
  name: string;
  accountNumber: string;
}

type RecipientDetailsFormProps = {
  control: Control<PaymentFormValues, any>;
  watch: UseFormWatch<PaymentFormValues>;
  setValue: UseFormSetValue<PaymentFormValues>;
};

export const RecipientDetailsForm: FC<RecipientDetailsFormProps> = ({
  control,
  watch,
  setValue,
}) => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const { id: userId } = useParams();
  const receiverId = watch('receiverId');
  const { request } = useRequest();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userId) return;
      await request(async () => {
        const response = await axios.get('/users');
        const filteredUsers = response.data.filter(
          (user: User) => user.id !== userId && user.name.toLowerCase() !== 'unknown user',
        );
        setUsers(filteredUsers);
      });
    };
    fetchUsers();
  }, [userId]);

  useEffect(() => {
    const rawAccountNumber = users.find(user => user.id === receiverId)?.accountNumber;
    const accountNumber = rawAccountNumber ? formatAccountNumber(rawAccountNumber) : '';
    setValue('receiverAccountNumber', accountNumber);
  }, [receiverId, setValue, users]);

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight="500"
        sx={{ mb: 1, color: theme.palette.primary.contrastText }}
      >
        Recipient Details
      </Typography>

      <FormAutocomplete
        control={control}
        name="receiverId"
        options={users.map(user => ({ label: user.name, value: user.id }))}
        label="Select recipient"
        muiTextFieldProps={{
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
      />

      <FormTextfield
        control={control}
        name="receiverAccountNumber"
        label="Recipient Account Number"
        fullWidth
        placeholder="00 0000 0000 0000 0000 0000 0000"
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
    </Box>
  );
};
