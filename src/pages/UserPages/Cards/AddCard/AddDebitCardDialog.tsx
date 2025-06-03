import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { FC } from 'react';
import { CardProvider } from 'Pages/UserPages/Cards/AddCard/CardProvider';
import { AddDebitCardStepper } from './components/AddDebitCardStepper';

type Props = {
  open: boolean;
  handleClose: () => void;
};

export const AddDebitCardDialog: FC<Props> = ({ open, handleClose }) => {
  return (
    <CardProvider>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Card</DialogTitle>
        <DialogContent>
          <AddDebitCardStepper />
        </DialogContent>
      </Dialog>
    </CardProvider>
  );
};
