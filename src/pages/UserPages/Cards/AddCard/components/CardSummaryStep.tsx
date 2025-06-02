import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useRequest } from 'utils/hooks/useRequest';
import { useCardContext } from '../CardProvider';

const SummaryStep = () => {
  const { cardData } = useCardContext();
  const { id: userId } = useParams();
  const { request } = useRequest();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleOrderCard = async () => {
    if (!userId) {
      setOrderError('User ID not found');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    try {
      await request(async () => {
        const response = await axios.post(`/user/${userId}/cards/order`, {
          type: cardData.type,
          format: cardData.format,
          subtype: cardData.subtype,
          pin: cardData.pin,
          shipping: cardData.shipping,
          limits: cardData.limits,
        });

        console.log('Card ordered successfully:', response.data);
        setOrderSuccess(true);
      });
    } catch (error) {
      console.error('Error ordering card:', error);
      setOrderError('Failed to order card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h5" color="success.main" gutterBottom>
          Card Ordered Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your card has been ordered and will be processed soon.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>

      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Card Details:
        </Typography>
        <Typography>Type: {cardData.type}</Typography>
        <Typography>Format: {cardData.format}</Typography>
        <Typography>Subtype: {cardData.subtype}</Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Shipping Information:
        </Typography>
        <Typography>
          Name: {cardData.shipping.firstName} {cardData.shipping.lastName}
        </Typography>
        <Typography>City: {cardData.shipping.city}</Typography>
        <Typography>
          Street: {cardData.shipping.streetName} {cardData.shipping.streetNumber}
        </Typography>
        {cardData.shipping.flatNumber && (
          <Typography>Flat Number: {cardData.shipping.flatNumber}</Typography>
        )}
        <Typography>Date of Birth: {cardData.shipping.dateOfBirth}</Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Card Limits:
        </Typography>
        <Typography>Online: ${cardData.limits.online}</Typography>
        <Typography>In Store: ${cardData.limits.inStore}</Typography>
        <Typography>ATM: ${cardData.limits.atm}</Typography>
      </Box>

      {orderError && (
        <Typography color="error" gutterBottom>
          {orderError}
        </Typography>
      )}

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleOrderCard}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Ordering Card...' : 'Order Card'}
        </Button>
      </Box>
    </Box>
  );
};

export default SummaryStep;
