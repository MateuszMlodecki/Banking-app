import * as Yup from "yup";
import { addressNumberRegex, polishCharactersRegex } from "./constants";
import {
  validateAccountNumber,
  getBankNameFromAccountNumber,
} from "./bankAutoComplete";
import dayjs from "dayjs";

export const validationSchemaStep1 = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters long")
    .max(15, "First name must be at most 15 characters long")
    .matches(polishCharactersRegex, "First name must contain only letters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters long")
    .max(25, "Last name must be at most 25 characters long")
    .matches(polishCharactersRegex, "Last name must be contain only letters "),
  dateOfBirth: Yup.string()
    .required("Date of birth is required")
    .test("is-adult", "You must be at least 18 years old", (value) => {
      if (!value) return false;

      const today = dayjs();
      const birthDate = dayjs(value, "DD-MM-YYYY");
      const age = today.diff(birthDate, "year");

      return age >= 18;
    }),
});

export const validationSchemaStep2 = Yup.object({
  streetName: Yup.string()
    .required("Street name is required")
    .matches(polishCharactersRegex, "Street name must be contain only letters"),
  streetNumber: Yup.string()
    .required("Street number is required")
    .matches(
      addressNumberRegex,
      "Invalid street number format (e.g., 15, 15A, 15/17"
    ),
  flatNumber: Yup.string()
    .notRequired()
    .matches(
      addressNumberRegex,
      "Invalid flat number format (e.g., 5, 5A, 5/1)"
    ),
  city: Yup.string()
    .required("City is requrired")
    .matches(polishCharactersRegex, "City must be contain only letters"),
});

export const validationSchemaStep3 = Yup.object({
  bankName: Yup.string().required("Bank Name is required"),
  accountNumber: Yup.string()
    .required("Account Number is required")
    .test("is-valid-account-number", "Invalid account number", (value) => {
      return validateAccountNumber(value);
    })
    .test("get-bank-name", "Bank not found", function (value) {
      const bankName = getBankNameFromAccountNumber(value);
      if (bankName) {
        this.parent.bankName = bankName;
        return true;
      }
      return false;
    }),
});
