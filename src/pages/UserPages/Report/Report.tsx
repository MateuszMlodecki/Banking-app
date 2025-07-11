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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useRequest } from 'utils/hooks/useRequest';
import { YearReport } from './components/YearReport';
import { MonthReport } from './components/MonthReport';

interface Transaction {
  title: string;
  amount: string;
  date: string;
  isSent: boolean;
}

export interface Reports {
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
  const [reports, setReports] = useState<Reports[]>([]);
  const [monthyReports, setMonthyReports] = useState<Reports[]>([]);
  // reports = {yearly: [], category: []}
  const [categoryReports, setCategoryReports] = useState<CategoryReport[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [reportType, setReportType] = useState<'expenses' | 'income'>('expenses');
  const { id: userId = '' } = useParams();
  const { request } = useRequest();

  console.log(selectedDate);
  console.log(selectedMonth);
  console.log(selectedDate);
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        request(async () => {
          const response = await axios.get<Transaction[]>(`/user/${userId}/transactions`);
          setTransactions(response.data);
        }),
        request(async () => {
          const response = await axios.get<{ reports: Reports[] }>(
            `/user/${userId}/reports/year?year=${selectedYear}`,
          );
          setReports(response.data.reports);
        }),
        request(async () => {
          const response = await axios.get<{ reports: Reports[] }>(
            `/user/${userId}/reports/month?year=${selectedYear}&month=${selectedMonth}`,
          );
          setMonthyReports(response.data.reports);
        }),
      ]);
    };

    fetchData();
  }, [userId, selectedYear, selectedMonth]);

  useEffect(() => {
    if (transactions.length > 0) {
      generateCategoryReports();
    }
  }, [transactions, selectedYear, reportType]);

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

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    if (newDate) {
      setSelectedYear(newDate.year());
      setSelectedMonth(newDate.month() + 1);
    }
  };

  const totalIncome = reports.reduce((sum, report) => sum + report.totalIncome, 0);
  const totalExpenses = reports.reduce((sum, report) => sum + report.totalExpenses, 0);
  const totalBalance = totalIncome - totalExpenses;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          <DatePicker
            label="Select Year"
            value={selectedDate}
            onChange={handleDateChange}
            views={['year', 'month']}
            sx={{ width: '100%' }}
          />
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
          <YearReport reports={reports} />
          <MonthReport reports={monthyReports} />
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
    </LocalizationProvider>
  );
};

export default Report;
