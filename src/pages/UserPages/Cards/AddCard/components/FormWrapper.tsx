import { Box, Button, useTheme } from '@mui/material';
import { useCardContext } from '../CardProvider';
import { PropsWithChildren } from 'react';

type Props = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};
export const FormWrapper = ({ children, onSubmit }: PropsWithChildren<Props>) => {
  const theme = useTheme();
  const { activeStep, setActiveStep } = useCardContext();

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}
    >
      {children}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.grey[800],
            '&.Mui-disabled': {
              backgroundColor: theme.palette.grey[800],
              opacity: 0.5,
            },
          }}
          onClick={() => setActiveStep(prevStep => prevStep - 1)}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        <Button variant="contained" type="submit">
          Next
        </Button>
      </Box>
    </Box>
  );
};
