import * as yup from 'yup';

export const paymentSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .min(0.01, 'Amount must be greater than zero')
    .test('balance-check', 'Insufficient funds', function (value) {
      const senderBalance = this.options.context?.senderBalance;
      return value <= senderBalance;
    }),
});
