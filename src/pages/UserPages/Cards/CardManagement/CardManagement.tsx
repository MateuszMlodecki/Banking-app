import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRequest } from 'utils/hooks/useRequest';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

type Card = {
  id: string;
  cardNumber: string;
};

const CardManagement = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const { request } = useRequest();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    request(async () => {
      const response = await axios.get('/cards'); //na razie to moze rzucac errorem, najpierw zrob dodawanie a potem pobieranie
      setCards(response.data);
    });
  }, []);
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
      {cards.length < 1 ? (
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">No cards available</Typography>
          <Typography variant="caption">
            You can add a new card by clicking the button below.
          </Typography>
          <Button variant="contained" onClick={() => navigate(`/user/${id}/cards/add`)}>
            Add new card
          </Button>
        </Box>
      ) : (
        <p>todo</p>
      )}
    </Box>
  );
};
export default CardManagement;
