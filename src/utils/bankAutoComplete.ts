import { bankCodes } from "./bankCodes";

export const validateAccountNumber = (accountNumber: string): boolean => {
  const cleanedAccountNumber = accountNumber.replace(/\s/g, "");
  return /^\d{26}$/.test(cleanedAccountNumber);
};
export const getBankNameFromAccountNumber = (
  accountNumber: string
): string | null => {
  const cleanedAccountNumber = accountNumber.replace(/\s/g, "");
  const bankCode = cleanedAccountNumber.substring(2, 6);
  return bankCodes[bankCode] || null;
};
