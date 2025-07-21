import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FC, useEffect, useState, useMemo } from 'react';
import { useRequest } from 'utils/hooks/useRequest';
import axios from 'axios';

interface Transaction {
  title: string;
  amount: string;
  date: string;
  isSent: boolean;
}

interface CategoryData {
  category: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

interface CategoryReportProps {
  userId: string;
  selectedYear: number;
  reportType: 'expenses' | 'income';
  isActive: boolean;
}

const columns: GridColDef[] = [
  {
    field: 'category',
    headerName: 'Category',
    width: 200,
  },
  {
    field: 'totalAmount',
    headerName: 'Total Amount ($)',
    width: 180,
    renderCell: ({ row }) => <Box fontWeight="bold">{row.totalAmount.toFixed(2)}</Box>,
  },
  {
    field: 'transactionCount',
    headerName: 'Count',
    width: 120,
  },
  {
    field: 'percentage',
    headerName: 'Percentage',
    width: 120,
    renderCell: ({ row }) => `${row.percentage.toFixed(1)}%`,
  },
];

export const CategoryReport: FC<CategoryReportProps> = ({
  userId,
  selectedYear,
  reportType,
  isActive,
}) => {
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!isActive || !userId) return;

    const fetchTransactions = async () => {
      setLoading(true);
      await request(async () => {
        const response = await axios.get<Transaction[]>(`/user/${userId}/transactions`);
        setTransactions(response.data);
      }, false);
      setLoading(false);
    };

    fetchTransactions();
  }, [userId, isActive]);

  const categoryReports = useMemo(() => {
    const categoryData: { [key: string]: { total: number; count: number } } = {};
    let totalAmount = 0;

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      if (date.getFullYear() !== selectedYear) return;

      if (transaction.isSent === (reportType === 'expenses')) {
        const category = transaction.title.split(' ')[0] || 'Other';
        const amount = parseFloat(transaction.amount);

        if (!categoryData[category]) {
          categoryData[category] = { total: 0, count: 0 };
        }

        categoryData[category].total += amount;
        categoryData[category].count++;
        totalAmount += amount;
      }
    });

    const reports: CategoryData[] = Object.entries(categoryData).map(([category, data]) => ({
      category,
      totalAmount: data.total,
      transactionCount: data.count,
      percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0,
    }));

    return reports.sort((a, b) => b.totalAmount - a.totalAmount);
  }, [transactions, selectedYear, reportType]);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        {reportType === 'expenses' ? 'Expense' : 'Income'} Categories - {selectedYear}
      </Typography>
      <DataGrid
        rows={categoryReports.map((report, index) => ({
          id: `${report.category}-${index}`,
          ...report,
        }))}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        localeText={{ noRowsLabel: `No ${reportType} data available for selected year!` }}
      />
    </>
  );
};
