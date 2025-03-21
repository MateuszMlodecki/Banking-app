import React, { useState } from "react";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import { useUserDetails } from "../../context/UserContext";
import { PersonalDetails } from "./PersonalDetails";
import { AddressInfo } from "./AddressInfo";
import { BankDetails } from "./BankDetails";
import { Summary } from "./Summary";
import { Step1Values, Step2Values, Step3Values } from "../../types/types";
import { theme } from "../../themes/theme";

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
        width: "100%",
        margin: "50px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.primary.dark,
        padding: 3,
        [theme.breakpoints.down("sm")]: {
          maxWidth: "90%",
          padding: 2,
        },
      }}
    >
      <Stepper activeStep={activeStep} sx={{ marginBottom: 3, width: "80%" }}>
        {steps.map((step) => (
          <Step key={step.id}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ width: "80%", maxWidth: "600px" }}>
        {steps.map(({ id, component }) => activeStep === id && component)}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.grey[800],
              "&.Mui-disabled": {
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
  );
};
