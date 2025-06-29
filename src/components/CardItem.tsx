import { FC } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import VisaLogo from 'assets/visa.svg';
import MasterCardLogo from 'assets/Mastercard-logo.svg';

const CardContainer = styled(Box)(({ theme }) => ({
  minWidth: 350,
  maxWidth: 400,
  height: 250,
  borderRadius: 16,
  background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
  color: '#fff',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
  marginBottom: theme.spacing(3),
  cursor: 'pointer',
}));

const CardTop = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const CardMiddle = styled(Box)({
  letterSpacing: '2px',
  fontSize: '14px',
  fontFamily: 'monospace',
  marginTop: '8px',
});

const CardBottom = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '16px',
});

export type CardType = {
  limits: {
    online: number;
    inStore: number;
    atm: number;
  };
  _id: string;
  userId: string;
  cardNumber: string;
  expiryDate: string;
  type: string;
  subtype: string;
  status: string;
  cvc: string;
};

export type CardItemProps = {
  card: CardType;
  isUnlocked: boolean;
  onClick: (card: CardType) => void;
};

export const CardItem: FC<CardItemProps> = ({ card, isUnlocked = false, onClick }) => {
  const cardKey = card._id || '';

  const displayNumber = card.cardNumber;
  const logoSrc = card.subtype === 'mastercard' ? MasterCardLogo : VisaLogo;

  const label = {
    credit: 'Credit',
    debit: 'Debit',
    kids: 'Kids',
  }[card.type];

  return (
    <CardContainer onClick={() => onClick(card)} key={cardKey}>
      <CardTop>
        <Typography variant="h6" sx={{ fontSize: 16 }}>
          {label}
        </Typography>
        <img src={logoSrc} style={{ width: 60 }} alt={`${card.subtype} logo`} />
      </CardTop>

      <CardMiddle>{displayNumber}</CardMiddle>

      <CardBottom>
        {isUnlocked && card.expiryDate && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontSize: 10 }}>
              Expires
            </Typography>
            <Typography variant="body2">{card.expiryDate}</Typography>
          </Box>
        )}
        {isUnlocked && card.cvc && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontSize: 10 }}>
              CVC
            </Typography>
            <Typography variant="body2">{card.cvc}</Typography>
          </Box>
        )}
        {!isUnlocked && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontSize: 10, opacity: 0.7 }}>
              Unlock to see details
            </Typography>
          </Box>
        )}
      </CardBottom>
    </CardContainer>
  );
};
