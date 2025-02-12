import React, { useState } from "react";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import { useUserDetails } from "../../context/UserContext";
import { PersonalDetails } from "./PersonalDetails";
import { AddressInfo } from "./AddressInfo";
import { BankDetails } from "./BankDetails";
import { Summary } from "./Summary";
import { Step1Values, Step2Values, Step3Values } from "../../types/types";
import { theme } from "../../themes/theme"; // Import your theme

export const StepperParent: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isStepValid, setIsStepValid] = useState(false);
  const { setUserDetails } = useUserDetails();

  const handleNext = () => {
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFormSubmit = (data: Step1Values | Step2Values | Step3Values) => {
    console.log("data submitted", data);
    setUserDetails((prev) => ({ ...prev, ...data }));
    handleNext();
  };

  const steps = [
    {
      id: 0,
      label: "Personal Details",
      component: (
        <PersonalDetails
          setIsStepValid={setIsStepValid}
          key={"personal-details"}
          onSubmit={(data: Step1Values) => handleFormSubmit(data)}
        />
      ),
    },
    {
      id: 1,
      label: "Address Info",
      component: (
        <AddressInfo
          setIsStepValid={setIsStepValid}
          key={"address-info"}
          onSubmit={(data: Step2Values) => handleFormSubmit(data)}
        />
      ),
    },
    {
      id: 2,
      label: "Bank Details",
      component: (
        <BankDetails
          onSubmit={(data: Step3Values) => handleFormSubmit(data)}
          setIsStepValid={setIsStepValid}
          key={"bank-details"}
        />
      ),
    },
    { id: 3, label: "Summary", component: <Summary key={"summary"} /> },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: 3,
      }}
    >
      <Box
        sx={{
          marginTop: "50px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          boxShadow: 3,
          padding: 3,
        }}
      >
        <Stepper activeStep={activeStep} sx={{ marginBottom: 3 }}>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>
          {steps.map(({ id, component }) => activeStep === id && component)}
          <Box sx={{ marginTop: 3, display: "flex", justifyContent: "center" }}>
            <Button onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>

            {activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": { backgroundColor: theme.palette.secondary.dark },
                  marginLeft: 2,
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
