import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FC, useEffect, useState } from 'react';
import { useRequest } from 'utils/hooks/useRequest';
import axios from 'axios';

export interface YearReportData {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

interface YearReportProps {
  userId: string;
  selectedYear: number;
  onSummaryUpdate?: (totalIncome: number, totalExpenses: number) => void;
  isActive: boolean;
}

const columns: GridColDef[] = [
  {
    field: 'month',
    headerName: 'Month',
    width: 150,
    renderCell: ({ row }) => `${row.month} ${row.year}`,
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

export const YearReport: FC<YearReportProps> = ({
  userId,
  selectedYear,
  onSummaryUpdate,
  isActive,
}) => {
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<YearReportData[]>([]);

  useEffect(() => {
    if (!isActive || !userId) return;

    const fetchReport = async () => {
      setLoading(true);
      await request(async () => {
        const response = await axios.get<{ reports: YearReportData[] }>(
          `/user/${userId}/reports/year?year=${selectedYear}`,
        );
        setReports(response.data.reports);

        if (onSummaryUpdate) {
          const totalIncome = response.data.reports.reduce((sum, r) => sum + r.totalIncome, 0);
          const totalExpenses = response.data.reports.reduce((sum, r) => sum + r.totalExpenses, 0);
          onSummaryUpdate(totalIncome, totalExpenses);
        }
      }, false);
      setLoading(false);
    };

    fetchReport();
  }, [userId, selectedYear, isActive]);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Monthly Breakdown - {selectedYear}
      </Typography>
      <DataGrid
        rows={reports.map((report, index) => ({
          id: `${report.month}-${report.year}-${index}`,
          ...report,
        }))}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        localeText={{ noRowsLabel: 'No data available for selected year!' }}
        initialState={{
          pagination: { paginationModel: { pageSize: 12 } },
        }}
        pageSizeOptions={[12]}
      />
    </>
  );
};
