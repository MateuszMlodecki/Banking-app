import axios from 'axios';

// MUIAlert
const errorStatuses: Record<number, string> = {
  400: 'Invalid request. Please check your input.',
  401: 'Session expired. Please log in again.',
  403: 'Session expired. Please log in again.',
  404: 'Requested resource not found.',
  405: 'Method not allowed.',
  406: 'Not acceptable.',
  408: 'Server took too long to respond. Please try again.',
  429: 'You are making too many requests. Please slow down.',
  500: 'An error occurred on the server. Try again later.',
  503: 'Server is currently unavailable. Please try again later.',
};

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
