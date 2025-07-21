import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FC, useEffect, useState } from 'react';
import { useRequest } from 'utils/hooks/useRequest';
import axios from 'axios';
import dayjs from 'dayjs';

export interface MonthReportData {
  fullDate: string;
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

interface MonthReportProps {
  userId: string;
  selectedYear: number;
  selectedMonth: number;
  isActive: boolean;
}

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

export const MonthReport: FC<MonthReportProps> = ({
  userId,
  selectedYear,
  selectedMonth,
  isActive,
}) => {
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<MonthReportData[]>([]);

  useEffect(() => {
    if (!isActive || !userId) return;

    const fetchReport = async () => {
      setLoading(true);
      await request(async () => {
        const response = await axios.get<{ reports: MonthReportData[] }>(
          `/user/${userId}/reports/month?year=${selectedYear}&month=${selectedMonth}`,
        );
        setReports(response.data.reports);
      }, false);
      setLoading(false);
    };

    fetchReport();
  }, [userId, selectedYear, selectedMonth, isActive]);

  const monthName = dayjs()
    .month(selectedMonth - 1)
    .format('MMMM');

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Daily Breakdown - {monthName} {selectedYear}
      </Typography>
      <DataGrid
        rows={reports.map((report, index) => ({
          id: `${report.fullDate}-${index}`,
          ...report,
        }))}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        localeText={{ noRowsLabel: 'No data available for selected month!' }}
        initialState={{
          pagination: { paginationModel: { pageSize: 31 } },
        }}
        pageSizeOptions={[31]}
      />
    </>
  );
};
