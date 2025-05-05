import { Box } from '@mui/material';
import { CardWithPackage } from 'components/OverviewComponents/CardWithPackage';
import { CreditCard } from 'components/OverviewComponents/CreditCard';

export const Overview = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CreditCard />
      <CardWithPackage />
    </Box>
  );
};
