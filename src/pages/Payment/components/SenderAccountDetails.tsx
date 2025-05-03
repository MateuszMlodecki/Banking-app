import { Box, InputAdornment, TextField, Typography, useTheme } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { FC, useEffect, useState } from 'react';
import { useAlertContext, useLoading } from 'context';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { errorHandler, formatAccountNumber } from 'utils';

type SenderAccountDetailsProps = {
  setSenderAccountNumber: (account: string) => void;
  setSenderBalance: (balance: number) => void;
};

export const SenderAccountDetails: FC<SenderAccountDetailsProps> = ({
  setSenderAccountNumber,
  setSenderBalance,
}) => {
  const theme = useTheme();
  const { setLoading } = useLoading();
  const { id: userId } = useParams();
  const { setErrorAlert } = useAlertContext();

  const [userDetails, setUserDetails] = useState<{ accountNumber: string; balance: number }>();

  useEffect(() => {
    const fetchAccountData = async () => {
      await axios
        .get(`/user/${userId}/account`)
        .then(response => {
          setSenderAccountNumber(formatAccountNumber(response.data.accountNumber));
          setSenderBalance(response.data.balance);
          setUserDetails({
            accountNumber: formatAccountNumber(response.data.accountNumber),
            balance: response.data.balance.toFixed(2),
          });
        })
        .catch(error => {
          const message = errorHandler(error);
          setErrorAlert(new Error(`Failed to fetch account information: ${message}`));
          console.error('Account fetch error:', error);
        })
        .finally(() => {
          setLoading(false);
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
