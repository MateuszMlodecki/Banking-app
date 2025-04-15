import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAlertContext } from '../../context/AlertContext';
import { errorHandler } from '../../utils/errorHandler';
import { useLoading } from '../../context/LoadingContext';

interface Transaction {
  id: string;
  senderId: string;
  receiverEmail: string;
  amount: string;
  date: string;
  title: string;
  transactionType: 'sent' | 'received';
}

export const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  //const [loading, setLoading] = useState<boolean>(true);
  const { id: userId } = useParams();
  const { setErrorAlert } = useAlertContext();
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/${userId}/transactions`);
        setTransactions(response.data);
      } catch (error) {
        const message = errorHandler(error);
        setErrorAlert(new Error(message));
        console.error('Error fetching transactions:', error);
      } finally {
        //setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, setErrorAlert]);

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Data',
      width: 120,
      valueFormatter: ({ value }) => {
        new Date(value as string).toLocaleDateString();
      },
    },
    { field: 'title', headerName: 'Title', width: 200 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: ({ row }) => (
        <Box color={row.transactionType === 'sent' ? 'error.main' : 'success.main'}>
          {row.transactionType === 'sent' ? '-' : '+'}
          {row.amount} $
        </Box>
      ),
    },
    {
      field: 'receiverEmail',
      headerName: 'Receiver Email',
      width: 200,
    },
    {
      field: 'transactionType',
      headerName: 'Type',
      width: 100,
      valueFormatter: ({ value }) => (value === 'sent' ? 'Sent' : 'Received'),
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: 'auto', mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Transaction History
      </Typography>

      <DataGrid
        rows={transactions}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        localeText={{ noRowsLabel: 'There is no transactions!' }}
      />
    </Box>
  );
};
