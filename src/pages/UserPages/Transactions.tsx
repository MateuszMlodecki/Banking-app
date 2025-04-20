import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAlertContext } from '../../context/AlertContext';
import { errorHandler } from '../../utils/errorHandler';
import { useLoading } from '../../context/LoadingContext';

interface Transaction {
  title: string;
  amount: string;
  date: string;
  isSent: boolean;
}

const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Date',
    width: 200,
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 400,
  },
  {
    field: 'amount',
    headerName: 'Amount ($)',
    width: 250,
    renderCell: ({ row }) => {
      const amount = parseFloat(row.amount).toFixed(2);
      const formatted = `${row.isSent ? '-' : '+'}${amount} $`;

      return (
        <Box color={row.isSent ? 'error.main' : 'success.main'} fontWeight="bold">
          {formatted}
        </Box>
      );
    },
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 150,
    renderCell: ({ row }) => (
      <Box color={row.isSent ? 'error.main' : 'success.main'} fontWeight="bold">
        {row.isSent ? 'Sent' : 'Received'}
      </Box>
    ),
  },
];

export const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { id: userId } = useParams();
  const { setErrorAlert } = useAlertContext();
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/${userId}/transactions`);
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format');
        }
        setTransactions(response.data);
        setError(null);
      } catch (error) {
        const message = errorHandler(error);
        setError(message);
        setErrorAlert(new Error(message));
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId, setErrorAlert, setLoading]);

  if (error) {
    return (
      <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto', mt: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Transaction History
        </Typography>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto', mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Transaction History
      </Typography>

      <DataGrid
        rows={transactions.map((transaction, index) => ({
          id: `${transaction.date}-${transaction.title}-${index}`,
          ...transaction,
        }))}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        localeText={{ noRowsLabel: 'There are no transactions!' }}
      />
    </Box>
  );
};
