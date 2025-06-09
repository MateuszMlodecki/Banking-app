import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AddDebitCardDialog } from '../AddCard/AddDebitCardDialog';
import { CreditCardList } from './CreditCardList';
import { useRequest } from 'utils/hooks/useRequest';

type Card = {
  id: string;
  cardNumber: string;
};

const CardManagement: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const { userId } = useParams();
  const { request } = useRequest();

  useEffect(() => {
    request(async () => {
      const { data } = await axios.get(`/user/${userId}/cards`);
      setCards(data.cards);
    });
  }, [userId, request]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <Typography variant="h2">Card Management</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add New Card
      </Button>
      {cards.length < 1 ? (
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">No cards available</Typography>
          <Typography variant="caption">
            You can add a new card by clicking the button below.
          </Typography>
        </Box>
      ) : (
        <Box>
          <CreditCardList />
        </Box>
      )}
      <AddDebitCardDialog open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
};

export default CardManagement;
