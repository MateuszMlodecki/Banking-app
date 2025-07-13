import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
  );
};

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
  const [yearReports, setYearReports] = useState<Reports[]>([]);
  const [monthReports, setMonthReports] = useState<Reports[]>([]);
  const [categoryReports, setCategoryReports] = useState<CategoryReport[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [reportType, setReportType] = useState<'expenses' | 'income'>('expenses');
  const [activeTab, setActiveTab] = useState(0);
  const { id: userId = '' } = useParams();
  const { request } = useRequest();

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    if (activeTab === 0) {
      fetchYearReport();
    } else if (activeTab === 1) {
      fetchMonthReport();
    }
  }, [userId, selectedYear, selectedMonth, activeTab]);

  useEffect(() => {
    if (transactions.length > 0 && activeTab === 2) {
      generateCategoryReports();
    }
  }, [transactions, selectedYear, reportType, activeTab]);

  const fetchTransactions = async () => {
    await request(async () => {
      const response = await axios.get<Transaction[]>(`/user/${userId}/transactions`);
      setTransactions(response.data);
    });
  };

  const fetchYearReport = async () => {
    await request(async () => {
      const response = await axios.get<{ reports: Reports[] }>(
        `/user/${userId}/reports/year?year=${selectedYear}`,
      );
      setYearReports(response.data.reports);
    });
  };

  const fetchMonthReport = async () => {
    await request(async () => {
      const response = await axios.get<{ reports: Reports[] }>(
        `/user/${userId}/reports/month?year=${selectedYear}&month=${selectedMonth}`,
      );
      setMonthReports(response.data.reports);
    });
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

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    if (newDate) {
      setSelectedYear(newDate.year());
      setSelectedMonth(newDate.month() + 1);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const totalIncome = yearReports.reduce((sum, report) => sum + report.totalIncome, 0);
  const totalExpenses = yearReports.reduce((sum, report) => sum + report.totalExpenses, 0);
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

        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Yearly Overview" />
              <Tab label="Monthly Details" />
              <Tab label="Category Analysis" />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <Box sx={{ mb: 3 }}>
              <DatePicker
                label="Select Year"
                value={dayjs().year(selectedYear)}
                onChange={handleDateChange}
                views={['year']}
                sx={{ width: { xs: '100%', md: '300px' } }}
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly Breakdown - {selectedYear}
            </Typography>
            <YearReport reports={yearReports} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <DatePicker
                label="Select Month & Year"
                value={selectedDate}
                onChange={handleDateChange}
                views={['year', 'month']}
                sx={{ width: { xs: '100%', md: '300px' } }}
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Daily Breakdown -{' '}
              {dayjs()
                .month(selectedMonth - 1)
                .format('MMMM')}{' '}
              {selectedYear}
            </Typography>
            <MonthReport reports={monthReports} />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <DatePicker
                label="Select Year"
                value={dayjs().year(selectedYear)}
                onChange={handleDateChange}
                views={['year']}
                sx={{ width: { xs: '100%', md: '300px' } }}
              />
              <FormControl sx={{ width: { xs: '100%', md: '300px' } }}>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={e => setReportType(e.target.value as 'expenses' | 'income')}
                >
                  <MenuItem value="expenses">Expenses</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {reportType === 'expenses' ? 'Expense' : 'Income'} Categories - {selectedYear}
            </Typography>
            <DataGrid
              rows={categoryReports.map((report, index) => ({
                id: `${report.category}-${index}`,
                ...report,
              }))}
              columns={categoryColumns}
              disableRowSelectionOnClick
              localeText={{ noRowsLabel: `No ${reportType} data available for selected year!` }}
            />
          </TabPanel>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Report;
