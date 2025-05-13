import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Typography, CssBaseline } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoginValues } from 'types/types';
import { useNavigate } from 'react-router-dom';
import { theme } from 'themes';
import { LandingPageAppBar, LandingPageDrawer } from 'Layout';
import { loginSchema } from 'utils';
import { useAlertContext } from 'context';
import { FormTextfield } from 'components';
import axios from 'axios';
import { useRequest } from 'utils/hooks/useRequest';

export const Login = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { setErrorAlert, setSuccessAlert } = useAlertContext();
  const { request } = useRequest();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>({
    mode: 'all',
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleDrawerToggle = () => setMobileOpen(prevState => !prevState);

  const onSubmit = async (data: LoginValues) => {
    await request(async () => {
      const response = await axios.post('/login', data);
      const result = await response.data;

      if (!result) {
        setErrorAlert(result.message || 'Invalid credentials.');
        return;
      }

      const { token, userId, onboardingCompleted } = result;

      if (!token || !userId) {
        setErrorAlert(new Error('Unexpected response from server. Please try again.'));
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('onboardingCompleted', onboardingCompleted);

      setSuccessAlert('Login successful!');

      navigate(`/user/${userId}/dashboard`);
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: theme.palette.primary.dark,
      }}
    >
      <CssBaseline />
      <LandingPageAppBar handleDrawerToggle={handleDrawerToggle} />
      <LandingPageDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: theme.palette.primary.dark,
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          padding: '40px',
          borderRadius: 1,
          boxShadow: 3,
          maxWidth: '400px',
          margin: 'auto',
          marginTop: '100px',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.primary.contrastText,
            textAlign: 'center',
          }}
        >
          Please provide your details to authenticate
        </Typography>

        <FormTextfield
          control={control}
          name="email"
          label="Email"
          sx={{ backgroundColor: theme.palette.primary.dark }}
        />
        <FormTextfield
          control={control}
          name="password"
          label="Password"
          type="password"
          sx={{ backgroundColor: theme.palette.primary.dark }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: theme.palette.primary.main,
            '&:hover': { backgroundColor: theme.palette.secondary.dark },
          }}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Box>
  );
};
