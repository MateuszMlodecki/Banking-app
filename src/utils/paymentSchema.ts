import * as yup from 'yup';

export const paymentSchema = yup.object().shape({
  receiverId: yup.string().required('Receiver is required'),
  receiverName: yup.string(),
  receiverAccountNumber: yup.string().required('Receiver Account Number is required'),
  amount: yup.string().typeError('Amount must be a number').required('Amount is required'),
  date: yup.string().required('Date is required'),
  title: yup.string().required('Title is required'),
});
