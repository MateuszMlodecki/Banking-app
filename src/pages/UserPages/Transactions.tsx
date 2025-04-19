import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAlertContext } from '../../context/AlertContext';
import { errorHandler } from '../../utils/errorHandler';
import { useLoading } from '../../context/LoadingContext';
import dayjs from 'dayjs';

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
    valueFormatter: ({ value }) => dayjs(value as string).format('DD.MM.YYYY'),
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
  const { id: userId } = useParams();
  const { setErrorAlert } = useAlertContext();
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/${userId}/transactions`);
        setTransactions(response.data);
        console.log(response.data);
      } catch (error) {
        const message = errorHandler(error);
        setErrorAlert(new Error(message));
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, setErrorAlert, setLoading]);

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto', mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Transaction History
      </Typography>

      <DataGrid
        rows={transactions.map((transaction, index) => ({ id: index, ...transaction }))}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        localeText={{ noRowsLabel: 'There is no transactions!' }}
      />
    </Box>
  );
};
