import React, { useEffect } from "react";
import { TextField, Typography, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Step1Values } from "../../types/types";
import { validationSchemaStep1 } from "../../utils/validationSchemaStepper";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

export const PersonalDetails: React.FC<{
  setIsStepValid: (isValid: boolean) => void;
  onSubmit: (data: Step1Values) => void;
}> = ({ setIsStepValid, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchemaStep1),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    setIsStepValid(isValid);
  }, [isValid]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography>Personal details</Typography>
        <TextField
          {...register("firstName")}
          label="First Name"
          name="firstName"
          defaultValue=""
          fullWidth
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />

        <TextField
          {...register("lastName")}
          name="lastName"
          label="Last Name"
          defaultValue=""
          fullWidth
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />

        <Controller
          name="dateOfBirth"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <DatePicker
              format="DD-MM-YYYY"
              label="Date of Birth"
              value={field.value ? dayjs(field.value, "DD-MM-YYYY") : null}
              onChange={(date: Dayjs | null) => {
                field.onChange(date ? date.format("DD-MM-YYYY") : "");
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  error: !!errors.dateOfBirth,
                  helperText: errors.dateOfBirth?.message,
                },
              }}
            />
          )}
        />
        <Button type="submit" variant="contained" disabled={!isValid}>
          Submit
        </Button>
      </form>
    </LocalizationProvider>
  );
};
