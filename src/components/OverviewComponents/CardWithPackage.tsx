import React, { useEffect, useState } from 'react';
import { Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { formatAccountNumber } from 'utils';
import { useLoading } from 'context';

export const CardWithPackage: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const { setLoading } = useLoading();
  const { id: userId } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const [accountResponse, profileResponse] = await Promise.all([
          axios.get<{ accountNumber: string; balance: number }>(`/user/${userId}/account`),
          axios.get<{ firstName: string; lastName: string }>(`/user/${userId}/profile`),
        ]);

        const formattedAccountNumber = formatAccountNumber(accountResponse.data.accountNumber);
        const fullName = `${profileResponse.data.firstName} ${profileResponse.data.lastName}`;

        setAccountNumber(formattedAccountNumber);
        setCardHolder(fullName);
      } catch (error) {
        console.error('Failed to load card data ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [userId]);

  return (
    <Paper
      elevation={5}
      sx={{
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #1976d2, #0d47a1)',
        color: '#fff',
        width: '100%',
        maxWidth: 380,
        mx: 'auto',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
        minHeight: 200,
      }}
    >
      <>
        <Typography variant="h6" sx={{ letterSpacing: 2, mb: 2 }}>
          {accountNumber}
        </Typography>

        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
          Card holder
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {cardHolder}
        </Typography>
      </>
    </Paper>
  );
};
