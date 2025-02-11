import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField, Typography } from "@mui/material";
import { Step3Values } from "../../types/types";
import { validationSchemaStep3 } from "../../utils/validationSchemaStepper";
import { getBankNameFromAccountNumber } from "../../utils/bankAutoComplete";
import { formatAccountNumber } from "../../utils/constants";

export const BankDetails: React.FC<{
  setIsStepValid: (isValid: boolean) => void;
  onSubmit: (data: Step3Values) => void;
}> = ({ setIsStepValid, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<Step3Values>({
    mode: "all",
    resolver: yupResolver(validationSchemaStep3),
  });

  useEffect(() => {
    setIsStepValid(isValid);
  }, [isValid, setIsStepValid]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography>Bank details</Typography>
      <TextField
        {...register("accountNumber")}
        label="Account Number"
        fullWidth
        error={!!errors.accountNumber}
        helperText={errors.accountNumber?.message}
        onChange={(e) => {
          const formattedData = formatAccountNumber(e.target.value);
          setValue("accountNumber", formattedData);
          const accountNumber = e.target.value;
          const bankName = getBankNameFromAccountNumber(accountNumber);
          if (bankName) {
            setValue("bankName", bankName);
          } else {
            setValue("bankName", "");
          }
        }}
      />
      <TextField
        {...register("bankName")}
        label="Bank Name"
        slotProps={{ input: { readOnly: true } }}
        fullWidth
        error={!!errors.bankName}
        helperText={errors.bankName?.message}
        margin="normal"
        focused
        style={{ pointerEvents: "none" }}
      />
      <Button type="submit" variant="contained" disabled={!isValid}>
        Submit
      </Button>
    </form>
  );
};
