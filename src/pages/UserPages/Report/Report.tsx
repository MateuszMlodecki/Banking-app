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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { YearReport } from './components/YearReport';
import { MonthReport } from './components/MonthReport';
import { CategoryReport } from './components/CategoryReport';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  if (value !== index) return null;
  return <Box sx={{ py: 3 }}>{children}</Box>;
};

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
}

const SummaryCards = ({ totalIncome, totalExpenses }: SummaryCardsProps) => {
  const totalBalance = totalIncome - totalExpenses;

  return (
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
  );
};

const Report = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [reportType, setReportType] = useState<'expenses' | 'income'>('expenses');
  const [activeTab, setActiveTab] = useState(0);
  const [summaryData, setSummaryData] = useState({ totalIncome: 0, totalExpenses: 0 });
  const { id: userId = '' } = useParams();

  const selectedYear = selectedDate ? selectedDate.year() : new Date().getFullYear();
  const selectedMonth = selectedDate ? selectedDate.month() + 1 : new Date().getMonth() + 1;

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSummaryUpdate = (income: number, expenses: number) => {
    setSummaryData({ totalIncome: income, totalExpenses: expenses });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', maxWidth: '1200px', margin: 'auto', mt: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Financial Reports
        </Typography>

        <SummaryCards {...summaryData} />

        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                flex: 1,
                maxWidth: 'none',
                borderBottom: 1,
                borderColor: 'divider',
              },
            }}
          >
            <Tab label="Yearly Overview" />
            <Tab label="Monthly Details" />
            <Tab label="Category Analysis" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <DatePicker
                label="Select Year"
                value={dayjs().year(selectedYear)}
                onChange={handleDateChange}
                views={['year']}
                sx={{ width: { xs: '100%', md: '300px' } }}
              />
            </Box>
            <YearReport
              userId={userId}
              selectedYear={selectedYear}
              onSummaryUpdate={handleSummaryUpdate}
              isActive={activeTab === 0}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box
              sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <DatePicker
                label="Select Month & Year"
                value={selectedDate}
                onChange={handleDateChange}
                views={['year', 'month']}
                sx={{ width: { xs: '100%', md: '300px' } }}
              />
            </Box>
            <MonthReport
              userId={userId}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              isActive={activeTab === 1}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box
              sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}
            >
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
            <CategoryReport
              userId={userId}
              selectedYear={selectedYear}
              reportType={reportType}
              isActive={activeTab === 2}
            />
          </TabPanel>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Report;
