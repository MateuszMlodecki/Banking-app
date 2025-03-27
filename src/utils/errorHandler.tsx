import axios from 'axios';
//import { useNavigate } from "react-router-dom";

export const errorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    const message = status ? errorStatuses[status] : 'An error occurred. Please try again.';
    return message;
  } else {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return errorMessage;
  }
};

// MUIAlert
const errorStatuses: Record<number, string> = {
  400: 'Invalid request. Please check your input.',
  401: 'Session expired. Please log in again.',
  403: 'Session expired. Please log in again.',
  404: 'Requested resource not found.',
  // 408: () => {
  // console.error('Request Timeout:', message);
  // console.log('Server took too long to respond. Please try again.');
  // },
  // 429: () => {
  // console.error('Too Many Requests:', message);
  // console.log('You are making too many requests. Please slow down.');
  // },
  // 500: () => {
  // console.error('Internal Server Error:', message);
  // console.log('An error occurred on the server. Try again later.');
  // },
  // 503: () => {
  // console.error('Service Unavailable:', message);
  // console.log('Server is currently unavailable. Please try again later.');
  // },
};
