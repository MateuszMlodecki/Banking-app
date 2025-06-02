import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios-config';
import { useLoading } from 'context';
import CardItem, { CardType, UnlockCardData } from 'components/CardItem';
import UnlockCardDialog from './UnlockCardDialog';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';

import EditLimitsDialog from './EditLimitsDialog';

export const CreditCardList = () => {
  const { id: userId = '' } = useParams();
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [unlockedCards, setUnlockedCards] = useState<{
    [key: string]: UnlockCardData;
  }>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pinError, setPinError] = useState<string | undefined>();
  const { loading, setLoading } = useLoading();

  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [limitCard, setLimitCard] = useState<CardType | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/${userId}/cards`);
        setCards(Array.isArray(response.data.cards) ? response.data.cards : []);
      } catch (error) {
        console.error('Error fetching cards:', error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchCards();
    }
  }, [userId, setLoading]);

  const handleCardClick = (card: CardType) => {
    const cardKey = String(card._id);
    if (unlockedCards[cardKey]) {
      return;
    }
    setSelectedCard(card);
    setDialogOpen(true);
    setPinError(undefined);
  };

  const handleUnlock = async (pin: string) => {
    if (!selectedCard || !userId) return;
    try {
      setLoading(true);
      const response = await axios.post(`/user/${userId}/cards/${selectedCard._id}/unlock`, {
        pin,
      });
      const cardKey = String(selectedCard._id);

      setUnlockedCards(prev => ({
        ...prev,
        [cardKey]: {
          cardNumber: response.data.cardNumber,
          cvc: response.data.cvc,
        },
      }));
      setPinError(undefined);
      handleDialogClose();
    } catch (err: unknown) {
      setPinError('Wrong PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCard(null);
    setPinError(undefined);
  };

  const handleCopyNumber = (cardKey: string) => {
    const unlockedData = unlockedCards[cardKey];
    if (!unlockedData) return;
    navigator.clipboard
      .writeText(unlockedData.cardNumber)
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleDeleteCard = async (cardKey: string) => {
    if (!userId) return;
    try {
      setLoading(true);
      await axios.delete(`/user/${userId}/cards/${cardKey}`);
      setCards(prev => prev.filter(card => String(card._id) !== cardKey));

      setUnlockedCards(prev => {
        const copy = { ...prev };
        delete copy[cardKey];
        return copy;
      });
    } catch (err) {
      console.error('Error deleting card:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLimitDialog = (card: CardType) => {
    setLimitCard(card);
    setLimitDialogOpen(true);
  };
  const handleCloseLimitDialog = () => {
    setLimitDialogOpen(false);
    setLimitCard(null);
  };

  if (loading) {
    return <Typography sx={{ mt: 4, textAlign: 'center' }}>Loading...</Typography>;
  }

  if (!cards.length) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 4 }}>
        <Typography variant="h6">You don’t have any cards yet</Typography>
        <Typography variant="caption">Add a card in the card management panel</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 2 }}>
        {cards.map(card => {
          const cardKey = String(card._id);
          const unlockedData = unlockedCards[cardKey];

          return (
            <Box
              key={cardKey}
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 360,
                mb: 2,
              }}
            >
              <Box onClick={() => handleCardClick(card)}>
                <CardItem
                  card={card}
                  unlockedData={unlockedData}
                  onClick={() => handleCardClick(card)}
                />
              </Box>

              {unlockedData && (
                <SpeedDial
                  ariaLabel="Card actions"
                  icon={<SettingsIcon />}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                  FabProps={{
                    size: 'small',
                  }}
                  direction="down"
                >
                  <SpeedDialAction
                    key="copy"
                    slotProps={{
                      tooltip: {
                        open: false,
                        title: 'Copy number',
                      },
                    }}
                    icon={<ContentCopyIcon />}
                    onClick={() => handleCopyNumber(cardKey)}
                  />

                  <SpeedDialAction
                    key="delete"
                    slotProps={{
                      tooltip: {
                        open: false,
                        title: 'Delete card',
                      },
                    }}
                    icon={<DeleteIcon />}
                    onClick={() => handleDeleteCard(cardKey)}
                  />

                  <SpeedDialAction
                    key="edit-limits"
                    slotProps={{
                      tooltip: {
                        open: false,
                        title: 'Edit limits',
                      },
                    }}
                    icon={<EditIcon />}
                    onClick={() => handleOpenLimitDialog(card)}
                  />
                </SpeedDial>
              )}
            </Box>
          );
        })}
      </Box>

      <UnlockCardDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onUnlock={handleUnlock}
        error={pinError}
      />

      {limitCard && (
        <EditLimitsDialog
          open={limitDialogOpen}
          onClose={handleCloseLimitDialog}
          card={limitCard}
        />
      )}
    </>
  );
};
