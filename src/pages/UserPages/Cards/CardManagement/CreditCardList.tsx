import { FC, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios-config';
import { CardItem, CardType } from 'components/CardItem';
import { UnlockCardDialog } from './UnlockCardDialog';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';

import { EditLimitsDialog } from './EditLimitsDialog';
import { useRequest } from 'utils/hooks/useRequest';

export const CreditCardList: FC<{ cards: CardType[] }> = ({ cards }) => {
  const { id: userId = '' } = useParams();
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [unlockedCards, setUnlockedCards] = useState<Record<string, CardType>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [limitCard, setLimitCard] = useState<CardType | null>(null);
  const { request } = useRequest();

  const handleCardClick = (card: CardType) => {
    const cardKey = card._id;
    if (unlockedCards[cardKey]) {
      return;
    }
    setSelectedCard(card);
    setDialogOpen(true);
  };

  const handleUnlock = async (password: string) => {
    if (!selectedCard) return;

    request(async () => {
      const { data } = await axios.post<{
        cardNumber: string;
        cvc: string;
        cardExpiry: string;
      }>(`/user/${userId}/cards/${selectedCard._id}/unlock`, { password });

      const fullCard: CardType = {
        ...selectedCard,
        cardNumber: data.cardNumber,
        cvc: data.cvc,
        expiryDate: data.cardExpiry,
      };

      setUnlockedCards(prev => ({
        ...prev,
        [selectedCard._id]: fullCard,
      }));

      handleDialogClose();
    });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCard(null);
  };

  const handleCopyNumber = (cardKey: string) => {
    const unlockedData = unlockedCards[cardKey];
    if (!unlockedData) return;
    navigator.clipboard
      .writeText(unlockedData.cardNumber)
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleDeleteCard = (cardKey: string): Promise<void> => {
    return request(async () => {
      await axios.delete(`/user/${userId}/cards/${cardKey}`);

      setUnlockedCards(prev => {
        const copy = { ...prev };
        delete copy[cardKey];
        return copy;
      });
    });
  };

  const handleOpenLimitDialog = (card: CardType) => {
    setLimitCard(card);
    setLimitDialogOpen(true);
  };
  const handleCloseLimitDialog = () => {
    setLimitDialogOpen(false);
    setLimitCard(null);
  };

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
                <CardItem card={card} isUnlocked={false} onClick={() => handleCardClick(card)} />
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

      <UnlockCardDialog open={dialogOpen} onClose={handleDialogClose} onUnlock={handleUnlock} />

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
