import { useAlertContext, useLoading } from 'context';
import { errorHandler } from 'utils/errorHandler';

export const useRequest = () => {
  const { setErrorAlert } = useAlertContext();
  const { setLoading } = useLoading();

  const request = async (callbackFunc: () => Promise<void>, enableLoading: boolean = true) => {
    enableLoading && setLoading(true);
    try {
      await callbackFunc();
    } catch (error) {
      const message = errorHandler(error);
      setErrorAlert(new Error(message));
    } finally {
      enableLoading && setLoading(false);
    }
  };

  return { request };
};
