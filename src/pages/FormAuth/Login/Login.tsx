import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  CssBaseline,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { emailRegex } from "../../../utils/constants";
import { LoginValues } from "../../../types/types";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../themes/theme";

const validationSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Please provide valid email"),
  password: yup.string().required("You must provide your password"),
});

export const Login = () => {
  const methods = useForm<LoginValues>({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: LoginValues) => {
    console.log(data);
    navigate("/dashboard");
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
      <AppBar position="static" sx={{ background: theme.palette.primary.dark }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              color: theme.palette.primary.contrastText,
              fontWeight: "bold",
            }}
          >
            BankingApp
          </Typography>
        </Toolbar>
      </AppBar>
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
          name="email"
          error={!!errors.email}
          helperText={errors.email?.message ?? ""}
          sx={{ backgroundColor: theme.palette.primary.dark }}
        />
        <TextField
          {...register("password")}
          label="Password"
          name="password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message ?? ""}
          sx={{ backgroundColor: theme.palette.primary.dark }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            "&:hover": { backgroundColor: theme.palette.secondary.dark },
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};
