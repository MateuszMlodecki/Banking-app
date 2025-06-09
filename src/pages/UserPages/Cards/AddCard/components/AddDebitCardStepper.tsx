import React from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import { STEPS, useCardContext } from '../CardProvider';

export const AddDebitCardStepper: React.FC = () => {
  const { activeStep } = useCardContext();
  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {STEPS.map(step => (
          <Step key={step.id}>
            <StepLabel>{step.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box style={{ marginTop: 20 }}>
        {STEPS.map(({ id, component }) => activeStep === id && component)}
      </Box>
    </Box>
  );
};
