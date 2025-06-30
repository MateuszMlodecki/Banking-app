import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
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

interface MonthlyReport {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

interface CategoryReport {
  category: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

const monthlyColumns: GridColDef[] = [
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

const categoryColumns: GridColDef[] = [
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

const Report = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [categoryReports, setCategoryReports] = useState<CategoryReport[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [reportType, setReportType] = useState<'expenses' | 'income'>('expenses');
  const { id: userId = '' } = useParams();
  const { request } = useRequest();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      await request(async () => {
        const response = await axios.get<Transaction[]>(`/user/${userId}/transactions`);
        setTransactions(response.data);
      });
    };

    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    if (transactions.length > 0) {
      generateMonthlyReports();
      generateCategoryReports();
    }
  }, [transactions, selectedYear, reportType]);

  const generateMonthlyReports = () => {
    const monthlyData: { [key: string]: MonthlyReport } = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = `${year}-${month}`;

      if (year !== selectedYear) return;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthNames[month],
          year: year,
          totalIncome: 0,
          totalExpenses: 0,
          balance: 0,
          transactionCount: 0,
        };
      }

      const amount = parseFloat(transaction.amount);
      if (transaction.isSent) {
        monthlyData[monthKey].totalExpenses += amount;
      } else {
        monthlyData[monthKey].totalIncome += amount;
      }
      monthlyData[monthKey].transactionCount++;
    });

    const reports = Object.values(monthlyData).map(report => ({
      ...report,
      balance: report.totalIncome - report.totalExpenses,
    }));

    reports.sort((a, b) => {
      const aDate = new Date(a.year, monthNames.indexOf(a.month));
      const bDate = new Date(b.year, monthNames.indexOf(b.month));
      return aDate.getTime() - bDate.getTime();
    });

    setMonthlyReports(reports);
  };

  const generateCategoryReports = () => {
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

    const reports: CategoryReport[] = Object.entries(categoryData).map(([category, data]) => ({
      category,
      totalAmount: data.total,
      transactionCount: data.count,
      percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0,
    }));

    reports.sort((a, b) => b.totalAmount - a.totalAmount);
    setCategoryReports(reports);
  };

  const totalIncome = monthlyReports.reduce((sum, report) => sum + report.totalIncome, 0);
  const totalExpenses = monthlyReports.reduce((sum, report) => sum + report.totalExpenses, 0);
  const totalBalance = totalIncome - totalExpenses;

  const availableYears = Array.from(
    new Set(transactions.map(t => new Date(t.date).getFullYear())),
  ).sort((a, b) => b - a);

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: 'auto', mt: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Financial Reports
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
          '& > *': { flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } },
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" color="success.main">
              Total Income
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              +${totalIncome.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" color="error.main">
              Total Expenses
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              -${totalExpenses.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" color={totalBalance >= 0 ? 'success.main' : 'error.main'}>
              Net Balance
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              color={totalBalance >= 0 ? 'success.main' : 'error.main'}
            >
              {totalBalance >= 0 ? '+' : ''}${totalBalance.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
          '& > *': { flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } },
        }}
      >
        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            label="Year"
            onChange={e => setSelectedYear(Number(e.target.value))}
          >
            {availableYears.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Category Report Type</InputLabel>
          <Select
            value={reportType}
            label="Category Report Type"
            onChange={e => setReportType(e.target.value as 'expenses' | 'income')}
          >
            <MenuItem value="expenses">Expenses</MenuItem>
            <MenuItem value="income">Income</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Monthly Analysis - {selectedYear}
        </Typography>
        <DataGrid
          rows={monthlyReports.map((report, index) => ({
            id: `${report.month}-${report.year}-${index}`,
            ...report,
          }))}
          columns={monthlyColumns}
          disableRowSelectionOnClick
          autoHeight
          localeText={{ noRowsLabel: 'No data available for selected year!' }}
        />
      </Box>

      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {reportType === 'expenses' ? 'Expense' : 'Income'} Categories - {selectedYear}
        </Typography>
        <DataGrid
          rows={categoryReports.map((report, index) => ({
            id: `${report.category}-${index}`,
            ...report,
          }))}
          columns={categoryColumns}
          disableRowSelectionOnClick
          autoHeight
          localeText={{ noRowsLabel: `No ${reportType} data available for selected year!` }}
        />
      </Box>
    </Box>
  );
};

export default Report;
