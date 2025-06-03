import React, { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useRequest } from 'utils/hooks/useRequest';
import { CardTypeStep } from './components/CardTypeStep';
import { CardDetailsStep } from './components/CardDetailsStep';
import { PinStep } from './components/CardPinStep';
import { ShippingStep } from './components/CardShippingStep';
import { CardSummaryStep } from './components/CardSummaryStep';
import { CardFormatStep } from './components/CardFormatStep';
import { UserDetails } from 'types/types';
import { OrderSuccessStep } from './components/OrderSuccessStep';

export interface CardLimits {
  online: number;
  inStore: number;
  atm: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  streetName: string;
  streetNumber: string;
  flatNumber?: string | null;
  city: string;
  dateOfBirth: string;
}

export type DebitCardType = 'credit' | 'debit' | 'kids';
export interface CardData {
  format: string;
  type: DebitCardType;
  subtype: string;
  pin: string;
  confirmPin: string;
  shipping: ShippingInfo;
  limits: CardLimits;
}
export interface CardContextType {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const defaultCardData: CardData = {
  type: '' as DebitCardType,
  format: '',
  subtype: '',
  pin: '',
  confirmPin: '',
  shipping: {
    firstName: '',
    lastName: '',
    streetName: '',
    streetNumber: '',
    flatNumber: '',
    city: '',
    dateOfBirth: '',
  },
  limits: { online: 1000, inStore: 500, atm: 300 },
};

export const STEPS = [
  { name: 'Card Type', component: <CardTypeStep />, id: 0 },
  { name: 'Card Format', component: <CardFormatStep />, id: 1 },
  { name: 'Card Details', component: <CardDetailsStep />, id: 2 },
  { name: 'Set PIN', component: <PinStep />, id: 3 },
  { name: 'Shipping Info', component: <ShippingStep />, id: 4 },
  { name: 'Summary', component: <CardSummaryStep />, id: 5 },
  { name: 'Order', component: <OrderSuccessStep />, id: 6 },
];

export const CardContext = createContext<CardContextType | null>(null);

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cardData, setCardData] = useState<CardData>(defaultCardData);
  const [activeStep, setActiveStep] = useState(0);

  const { id: userId } = useParams();
  const { request } = useRequest();

  useEffect(() => {
    const fetchData = async () => {
      await request(async () => {
        const response = await axios.get<UserDetails>(`/user/${userId}/profile`);
        const user = response.data;
        setCardData(prev => ({
          ...prev,
          shipping: {
            ...user,
          },
        }));
      });
    };
    fetchData();
  }, [userId]);

  return (
    <CardContext.Provider value={{ cardData, setCardData, activeStep, setActiveStep }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};
