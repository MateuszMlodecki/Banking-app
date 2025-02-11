import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Typography, Button } from "@mui/material";
import { Step2Values } from "../../types/types";
import { validationSchemaStep2 } from "../../utils/validationSchemaStepper";

export const AddressInfo: React.FC<{
  setIsStepValid: (isValid: boolean) => void;
  onSubmit: (data: Step2Values) => void;
}> = ({ setIsStepValid, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchemaStep2),
  });

  useEffect(() => {
    setIsStepValid(isValid);
  }, [isValid, setIsStepValid]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography>Address information</Typography>
      <TextField
        {...register("streetName")}
        name="streetName"
        label="streetName"
        fullWidth
        error={!!errors.streetName}
        helperText={errors.streetName?.message}
      />
      <TextField
        {...register("streetNumber")}
        name="streetNumber"
        label="StreetNumber"
        fullWidth
        error={!!errors.streetNumber}
        helperText={errors.streetNumber?.message}
      />
      <TextField
        {...register("flatNumber")}
        name="flatNumber"
        label="flatNumber"
        fullWidth
        error={!!errors.flatNumber}
        helperText={errors.flatNumber?.message ?? ""}
      />
      <TextField
        {...register("city")}
        name="city"
        label="City"
        fullWidth
        error={!!errors.city}
        helperText={errors.city?.message}
      />
      <Button type="submit" variant="contained" disabled={!isValid}>
        Submit
      </Button>
    </form>
  );
};
