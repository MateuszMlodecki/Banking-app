import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { RegisterValues } from 'types/types';
import { theme } from 'themes';
import { LandingPageAppBar, LandingPageDrawer } from 'Layout';
import { registerSchema } from 'utils';
import { useNavigate } from 'react-router-dom';
import { useAlertContext } from 'context';
import axios from 'axios';

export const Register = () => {
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };
  const navigate = useNavigate();
  const { setErrorAlert, setSuccessAlert } = useAlertContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    mode: 'onChange',
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      const response = await axios.post('/register', data);
      const result = response.data;

      if (!result) {
        setErrorAlert(result.message || 'Registration failed');
        return;
      }

      setSuccessAlert('Registration sucessfull');
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      setErrorAlert(new Error('Registration failed. Please try again.'));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        margin: 'auto',
      }}
    >
      <LandingPageAppBar handleDrawerToggle={handleDrawerToggle} />
      <LandingPageDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Typography>Register with your email</Typography>

      <TextField
        {...register('email')}
        label="Email"
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        {...register('password')}
        label="Password"
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        {...register('repeatPassword')}
        label="Repeat Password"
        type="password"
        error={!!errors.repeatPassword}
        helperText={errors.repeatPassword?.message}
      />

      <Button
        sx={{ background: theme.palette.secondary.light }}
        type="submit"
        variant="contained"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </Box>
  );
};
