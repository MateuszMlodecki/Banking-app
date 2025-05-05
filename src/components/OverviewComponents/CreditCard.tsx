import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios-config';
import { formatAccountNumber } from 'utils';
import VisaLogo from 'assets/visa.svg';

const CardContainer = styled(Box)(({ theme }) => ({
  minWidth: 350,
  maxWidth: 400,
  height: 250,
  borderRadius: 16,
  background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
  color: '#fff',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
}));

const CardTop = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const CardMiddle = styled(Box)({
  letterSpacing: '2px',
  fontSize: '14px',
  fontFamily: 'monospace',
  marginTop: '8px',
});

const CardBottom = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '16px',
});

export const CreditCard = () => {
  const { id: userId } = useParams<{ id: string }>();

  const [accountNumber, setAccountNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        if (!userId) {
          throw new Error('Missing user ID');
        }

        const [accountResponse, profileResponse] = await Promise.all([
          axios.get<{ accountNumber: string; balance: number }>(`/user/${userId}/account`),
          axios.get<{ firstName: string; lastName: string }>(`/user/${userId}/profile`),
        ]);

        const formattedAccountNumber = formatAccountNumber(accountResponse.data.accountNumber);
        const fullName = `${profileResponse.data.firstName} ${profileResponse.data.lastName}`;

        setAccountNumber(formattedAccountNumber);
        setCardHolder(fullName);
        setBalance(accountResponse.data.balance);
      } catch (err) {
        console.error(err);
        setError('Failed to load card data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <CardContainer>
      <CardTop>
        <Typography variant="h6" sx={{ fontSize: 16 }}>
          Available founds {balance === null ? <CircularProgress /> : ` ${balance.toFixed(2)} $`}
        </Typography>
        <img src={VisaLogo} alt="Visa" style={{ width: 60 }} />
      </CardTop>

      <CardMiddle>{accountNumber}</CardMiddle>

      <CardBottom>
        <Box>
          <Typography variant="subtitle2" sx={{ fontSize: 10 }}>
            Card Holder
          </Typography>
          <Typography variant="body2">{cardHolder}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontSize: 10 }}>
            Expires
          </Typography>
          <Typography variant="body2">99/99</Typography>
        </Box>
      </CardBottom>
    </CardContainer>
  );
};
