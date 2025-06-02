import { Box } from '@mui/material';
import { CreditCard } from 'Pages/UserPages/Overview/components/AccountNumberDisplayer';

const Overview = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CreditCard />
    </Box>
  );
};

export default Overview;
