import React from 'react';
import { useUserDetails } from 'context';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { theme } from 'themes';
import axios from 'axios';
import { useAlertContext } from 'context';
import { useRequest } from 'utils/hooks/useRequest';

export const Summary: React.FC = () => {
  const { userDetails } = useUserDetails();
  const { setSuccessAlert, setErrorAlert } = useAlertContext();
  const { request } = useRequest();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setErrorAlert(new Error('User unauthorized please log in again'));
      return;
    }

    await request(async () => {
      const profileData = {
        userId: userId,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        dateOfBirth: userDetails.dateOfBirth,
        streetName: userDetails.streetName,
        streetNumber: userDetails.streetNumber,
        flatNumber: userDetails.flatNumber,
        city: userDetails.city,
      };
      await axios.post(`user/${userId}/profile`, profileData);
      localStorage.setItem('onboardingCompleted', 'true');
      setSuccessAlert(`Profile saved successfully`);
      navigate(`/user/${userId}/dashboard`);
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <Box>
        <Typography variant="h2">Summary</Typography>
        <Typography>First name: {userDetails.firstName}</Typography>
        <Typography>Last name: {userDetails.lastName}</Typography>
        <Typography>Date of birth: {userDetails.dateOfBirth}</Typography>
        <Typography>Street name: {userDetails.streetName}</Typography>
        <Typography>Street number: {userDetails.streetNumber}</Typography>
        <Typography>Flat number: {userDetails.flatNumber}</Typography>
        <Typography>City: {userDetails.city}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{
            width: '200px',
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.secondary.main,
          }}
          variant="contained"
          onClick={handleSaveProfile}
        >
          {'Save Profile'}
        </Button>
      </Box>
    </Box>
  );
};
