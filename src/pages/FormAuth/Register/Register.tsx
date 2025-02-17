import * as yup from "yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { RegisterValues } from "../../../types/types";
import { theme } from "../../../themes/theme";

const validationSchemaForRegister = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please provide a valid email"),
  password: yup.string().required("You must provide your password"),
  repeatPassword: yup
    .string()
    .required("Please retype your password.")
    .oneOf([yup.ref("password")], "Your passwords do not match"),
});

export const Register = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    mode: "onChange",
    resolver: yupResolver(validationSchemaForRegister),
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message || "Registration failed");
        return;
      }

      setSuccessMessage("Registration successful!");
      setErrorMessage("");
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <Typography>Register with your email</Typography>

      <TextField
        {...register("email")}
        label="Email"
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        {...register("password")}
        label="Password"
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        {...register("repeatPassword")}
        label="Repeat Password"
        type="password"
        error={!!errors.repeatPassword}
        helperText={errors.repeatPassword?.message}
      />

      <Button
        sx={{ background: theme.palette.secondary.light }}
        type="submit"
        variant="contained"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Registering..." : "Register"}
      </Button>

      {successMessage && (
        <Typography sx={{ color: "green", fontWeight: "bold" }}>
          {successMessage}
        </Typography>
      )}
      {errorMessage && (
        <Typography sx={{ color: "red", fontWeight: "bold" }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};
