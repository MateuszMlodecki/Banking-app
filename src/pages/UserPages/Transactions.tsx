import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useRequest } from 'utils/hooks/useRequest';

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
  const { id: userId = '' } = useParams();
  const { request } = useRequest();

  useEffect(() => {
    const fetchTransactions = async () => {
      await request(async () => {
        const response = await axios.get<Transaction[]>(`/user/${userId}/transactions`);
        setTransactions(response.data);
      });
    };

    fetchTransactions();
  }, [userId]);

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
