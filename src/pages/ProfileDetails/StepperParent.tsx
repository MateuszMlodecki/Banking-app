import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box, Paper } from '@mui/material';
import { useUserDetails } from 'context';
import { PersonalDetails } from './PersonalDetails';
import { AddressInfo } from './AddressInfo';
import { Summary } from './Summary';
import { Step1Values, Step2Values } from 'types/types';
import { theme } from 'themes';

const StepperParent: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isStepValid, setIsStepValid] = useState(false);
  const { setUserDetails } = useUserDetails();

  const handleNext = () => {
    if (isStepValid) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleFormSubmit = (data: Step1Values | Step2Values) => {
    setUserDetails(prev => ({ ...prev, ...data }));
    handleNext();
  };

  const steps = [
    {
      id: 0,
      label: 'Personal Details',
      component: (
        <PersonalDetails
          setIsStepValid={setIsStepValid}
          key={'personal-details'}
          onSubmit={(data: Step1Values) => handleFormSubmit(data)}
        />
      ),
    },
    {
      id: 1,
      label: 'Address Info',
      component: (
        <AddressInfo
          setIsStepValid={setIsStepValid}
          key={'address-info'}
          onSubmit={(data: Step2Values) => handleFormSubmit(data)}
        />
      ),
    },

    { id: 2, label: 'Summary', component: <Summary key={'summary'} /> },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        width: '100%',
        margin: 'auto',
        borderRadius: 2,
        border: `1px solid ${theme.palette.primary.contrastText}`,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          margin: '50px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          [theme.breakpoints.down('sm')]: {
            maxWidth: '90%',
            padding: 2,
          },
        }}
      >
        <Stepper activeStep={activeStep} sx={{ marginBottom: 3, width: '80%' }}>
          {steps.map(step => (
            <Step key={step.id}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ width: '80%', maxWidth: '600px' }}>
          {steps.map(({ id, component }) => activeStep === id && component)}
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
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default StepperParent;
