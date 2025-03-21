import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Typography, Button, Box } from "@mui/material";
import { Step3Values } from "../../types/types";
import { validationSchemaStep3 } from "../../utils/validationSchemaStepper";
import { getBankNameFromAccountNumber } from "../../utils/bankAutoComplete";
import { formatAccountNumber } from "../../utils/formatAccountNumber";
import { theme } from "../../themes/theme";

export const BankDetails: React.FC<{
  setIsStepValid: (isValid: boolean) => void;
  onSubmit: (data: Step3Values) => void;
}> = ({ setIsStepValid, onSubmit }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchemaStep3),
    defaultValues: {
      accountNumber: "",
      bankName: "",
    },
  });

  useEffect(() => {
    setIsStepValid(isValid);
  }, [isValid, setIsStepValid]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography>Bank Details</Typography>
      <Controller
        name="accountNumber"
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <TextField
            {...field}
            value={value}
            label="Account Number"
            fullWidth
            error={!!errors.accountNumber}
            helperText={errors.accountNumber?.message}
            onChange={(e) => {
              const formattedData = formatAccountNumber(e.target.value);
              onChange(formattedData);
              const bankName = getBankNameFromAccountNumber(formattedData);
              setValue("bankName", bankName || "");
            }}
          />
        )}
      />
      <Controller
        name="bankName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Bank Name"
            fullWidth
            error={!!errors.bankName}
            helperText={errors.bankName?.message}
            margin="normal"
            InputProps={{ readOnly: true }}
            style={{ pointerEvents: "none" }}
          />
        )}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          sx={{
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.secondary.main,
          }}
          type="submit"
          variant="contained"
          disabled={!isValid}
        >
          Continue
        </Button>
      </Box>
    </form>
  );
};
