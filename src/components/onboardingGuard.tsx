import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserDetails } from 'types/types';
import { CircularProgress } from '@mui/material';
import axios, { setAuthHeader } from '../axios-config';

export const OnboardingGuard = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { id: userId } = useParams();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
      if (token) {
        setAuthHeader(token);
      }

      if (onboardingCompleted && token && userId) {
        setIsOnboardingComplete(true);
        setLoading(false);
        return;
      }

      if (!token || !userId) {
        setIsOnboardingComplete(false);
        setLoading(false);
        return;
      }

      try {
        await axios.get<UserDetails>(`/user/${userId}`);
        setIsOnboardingComplete(true);
      } catch (error) {
        setIsOnboardingComplete(false);
        // alert context
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) return <CircularProgress />;

  return isOnboardingComplete ? <Outlet /> : <Navigate to={`/user/${userId}/profile`} />;
};
