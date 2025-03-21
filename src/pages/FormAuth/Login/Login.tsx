import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography, CssBaseline } from "@mui/material";
import { useForm } from "react-hook-form";
import { LoginValues } from "../../../types/types";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../themes/theme";
import { LandingPageAppBar } from "../../../Layout/LandingPage/LandingPageAppBar";
import { LandingPageDrawer } from "../../../Layout/LandingPage/LandingPageDrawer";
import { loginSchema } from "../../../utils/AuthSchemas";
import axios from "axios";

export const Login = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    mode: "all",
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleDrawerToggle = () => setMobileOpen((prevState) => !prevState);

  const onSubmit = async (data: LoginValues) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post("/login", data);
      const result = await response.data;

      if (!response.data) {
        setErrorMessage(result.message || "Invalid credentials.");
        return;
      }

      const { token, userId, onboardingCompleted } = result;

      if (!token || !userId) {
        setErrorMessage("Unexpected response from server. Please try again.");
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("onboardingCompleted", onboardingCompleted);

      setSuccessMessage("Login successful!");

      navigate("/user/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: theme.palette.primary.dark,
      }}
    >
      <CssBaseline />
      <LandingPageAppBar handleDrawerToggle={handleDrawerToggle} />
      <LandingPageDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: theme.palette.primary.dark,
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          padding: "40px",
          borderRadius: 1,
          boxShadow: 3,
          maxWidth: "400px",
          margin: "auto",
          marginTop: "100px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.primary.contrastText,
            textAlign: "center",
          }}
        >
          Please provide your details to authenticate
        </Typography>

        <TextField
          {...register("email")}
          label="Email"
          error={!!errors.email}
          helperText={errors.email?.message ?? ""}
          sx={{ backgroundColor: theme.palette.primary.dark }}
        />

        <TextField
          {...register("password")}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message ?? ""}
          sx={{ backgroundColor: theme.palette.primary.dark }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: theme.palette.primary.main,
            "&:hover": { backgroundColor: theme.palette.secondary.dark },
          }}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        {successMessage && (
          <Typography
            variant="body1"
            sx={{ color: theme.palette.success.main, textAlign: "center" }}
          >
            {successMessage}
          </Typography>
        )}
        {errorMessage && (
          <Typography
            variant="body1"
            sx={{ color: theme.palette.error.main, textAlign: "center" }}
          >
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
