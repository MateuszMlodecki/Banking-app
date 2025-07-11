import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FC } from 'react';
import { Reports } from '../Report';

const columns: GridColDef[] = [
  {
    field: 'fullDate',
    headerName: 'Date',
    width: 150,
    renderCell: ({ row }) =>
      new Date(row.fullDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
  },
  {
    field: 'totalIncome',
    headerName: 'Income ($)',
    width: 150,
    renderCell: ({ row }) => (
      <Box color="success.main" fontWeight="bold">
        +{row.totalIncome.toFixed(2)}
      </Box>
    ),
  },
  {
    field: 'totalExpenses',
    headerName: 'Expenses ($)',
    width: 150,
    renderCell: ({ row }) => (
      <Box color="error.main" fontWeight="bold">
        -{row.totalExpenses.toFixed(2)}
      </Box>
    ),
  },
  {
    field: 'balance',
    headerName: 'Balance ($)',
    width: 150,
    renderCell: ({ row }) => (
      <Box color={row.balance >= 0 ? 'success.main' : 'error.main'} fontWeight="bold">
        {row.balance >= 0 ? '+' : ''}
        {row.balance.toFixed(2)}
      </Box>
    ),
  },
  {
    field: 'transactionCount',
    headerName: 'Transactions',
    width: 120,
  },
];

export const MonthReport: FC<{ reports: Reports[] }> = ({ reports }) => {
  return (
    <DataGrid
      rows={reports.map((report, index) => ({
        id: `${report.month}-${report.year}-${index}`,
        ...report,
      }))}
      columns={columns}
      disableRowSelectionOnClick
      localeText={{ noRowsLabel: 'No data available for selected month!' }}
    />
  );
};
