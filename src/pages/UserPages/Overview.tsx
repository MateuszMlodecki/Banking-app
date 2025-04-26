import { Box, Typography } from '@mui/material';
import { CreditCard } from 'components/ContextComponents/OverviewComponents/CreditCard';

export const Overview = () => {
  return (
    <Box>
      <Typography sx={{ color: 'text.primary' }}>Overview</Typography>
      <CreditCard />
    </Box>
  );
};
