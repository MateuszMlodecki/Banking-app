import * as yup from "yup";
import { emailRegex } from "../../../utils/constants";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { RegisterValues } from "../../../types/types";

const validationSchemaForRegister = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(15, "Name must be at most 15 characters long"),
  lastName: yup
    .string()
    .required("Lastname is required")
    .min(2, "Lastname must be at least 2 characters long")
    .max(25, "Lastname must be at most 25 characters long"),
  age: yup
    .number()
    .required("Age is required")
    .typeError("Age have to be a number")
    .min(18, "You must be atleast 18 years old"),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Please provide valid email"),
  password: yup.string().required("You must provide your password"),
  repeatPassword: yup
    .string()
    .required("Please retype your password.")
    .oneOf([yup.ref("password")], "Your passwords do not match"),
  city: yup.string().notRequired(),
});

export const Register = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const methods = useForm<RegisterValues>({
    mode: "onChange",
    resolver: yupResolver(validationSchemaForRegister),
    defaultValues: {
      name: "",
      lastName: "",
      //age: 0,
      email: "",
      password: "",
      repeatPassword: "",
      city: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = (data: RegisterValues) => {
    console.log(data);
    setSuccessMessage("Registration succesful");
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <Typography sx={{ color: "black" }}>
        Please provide your details to register
      </Typography>
      <TextField
        {...register("name")}
        label="Name"
        name="name"
        error={!!errors.name}
        helperText={errors.name?.message ?? ""}
      />
      <TextField
        {...register("lastName")}
        label="LastName"
        name="lastName"
        error={!!errors.lastName}
        helperText={errors.lastName?.message ?? ""}
      />
      <TextField
        {...register("age")}
        label="Age"
        name="age"
        type="number"
        error={!!errors.age}
        helperText={errors.age?.message ?? ""}
      />
      <TextField
        {...register("email")}
        label="Email"
        name="email"
        error={!!errors.email}
        helperText={errors.email?.message ?? ""}
      />
      <TextField
        {...register("password")}
        label="Password"
        name="password"
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message ?? ""}
      />
      <TextField
        {...register("repeatPassword")}
        label="RepeatPassword"
        name="repeatPassword"
        type="password"
        error={!!errors.repeatPassword}
        helperText={errors.repeatPassword?.message ?? ""}
      />
      <TextField
        {...register("city")}
        label="City (Optional)"
        name="city"
        error={!!errors.city}
        helperText={errors.city?.message ?? ""}
      />
      <Button type="submit" variant="contained">
        sign in
      </Button>
      {successMessage && (
        <Typography sx={{ color: "black" }}>{successMessage}</Typography>
      )}
    </Box>
  );
};
