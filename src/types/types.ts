export type RegisterValues = {
  name: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  repeatPassword: string;
  city?: string | null;
};
export type LoginValues = Pick<RegisterValues, "email" | "password">;

export type UserDetails = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  streetName: string;
  streetNumber: string;
  flatNumber?: string | null;
  city: string;
  bankName: string;
  accountNumber: string;
};

export type Step1Values = Pick<
  UserDetails,
  "firstName" | "lastName" | "dateOfBirth"
>;
export type Step2Values = Pick<
  UserDetails,
  "streetName" | "streetNumber" | "flatNumber" | "city"
>;
export type Step3Values = Pick<UserDetails, "bankName" | "accountNumber">;

export type FormData = Step1Values | Step2Values | Step3Values;

export type ActiveViewType = "Overview" | "Transactions" | "Payment" | "Report";
