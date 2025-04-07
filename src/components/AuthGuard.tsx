import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthGuard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem('token');
        const pathname = window.location.pathname.split('/')[1];
        const isLendingPage = pathname === '';
        const isLoginPage = pathname === 'login';
        const isRegisterPage = pathname === 'register';

        const isAuthPage = isLendingPage || isLoginPage || isRegisterPage;

        if (!token && !isAuthPage) {
          navigate('/login');
          return;
        }

        if (token) {
          const response = await axios.get('http://localhost:4000/validate-token');

          if (response.status === 200 && isAuthPage) {
            navigate('/user');
            return;
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [navigate]);

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Outlet />
    </>
  );
};
