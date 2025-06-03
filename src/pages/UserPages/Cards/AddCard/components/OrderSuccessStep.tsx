import { Box, Typography } from '@mui/material';

export const OrderSuccessStep = () => (
  <Box textAlign="center" py={4}>
    <Typography variant="h5" color="success.main" gutterBottom>
      Card Ordered Successfully!
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Your card has been ordered and will be processed soon.
    </Typography>
  </Box>
);
