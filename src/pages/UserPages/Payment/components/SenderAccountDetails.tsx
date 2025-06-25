import { Box, InputAdornment, TextField, Typography, useTheme } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { formatAccountNumber } from 'utils';
import { useRequest } from 'utils/hooks/useRequest';

type SenderAccountDetailsProps = {
  setSenderBalance: React.Dispatch<React.SetStateAction<number>>;
  userId: string;
};

export const SenderAccountDetails: FC<SenderAccountDetailsProps> = ({
  userId,
  setSenderBalance,
}) => {
  const theme = useTheme();
  const { request } = useRequest();

  const [userDetails, setUserDetails] = useState<{ accountNumber: string; balance: number }>();

  useEffect(() => {
    const fetchAccountData = async () => {
      await request(async () => {
        const response = await axios.get(`/user/${userId}/account`);
        const formattedAccount = formatAccountNumber(response.data.accountNumber);
        const balance = response.data.balance;
        setUserDetails({ accountNumber: formattedAccount, balance });
        setSenderBalance(balance);
      });
    };
    fetchAccountData();
  }, [userId]);

  return (
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
        value={userDetails?.accountNumber || ''}
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
        Available balance: {userDetails?.balance} $
      </Typography>
    </Box>
  );
};
