import * as yup from "yup";
import { emailRegex } from "./constants";

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Please provide valid email"),
  password: yup.string().required("You must provide your password"),
});

export const registerSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Please provide a valid email"),
  password: yup.string().required("You must provide your password"),
  repeatPassword: yup
    .string()
    .required("Please retype your password.")
    .oneOf([yup.ref("password")], "Your passwords do not match"),
});
