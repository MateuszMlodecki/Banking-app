import { Box } from '@mui/material';
import { CardWithPackage } from 'components/ContextComponents/OverviewComponents/CardWithPackage';
import { CreditCard } from 'components/ContextComponents/OverviewComponents/CreditCard';

export const Overview = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CreditCard />
      <CardWithPackage />
    </Box>
  );
};
